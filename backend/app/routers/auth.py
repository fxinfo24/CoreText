"""Authentication router: login, register, current-user, logout (stateless).

Plus owner/admin/viewer RBAC: `owner` (fxinfo24@gmail.com, pinned) is the only
role that can manage OTHER users (list/create/update/delete) and invite codes.
`admin` can manage content (shareholder suites) but NOT other users.
`viewer` is read-only. Self-registration is invite-gated and temp-mail blocked.
"""
import os
import uuid
import time
from datetime import datetime
from hashlib import sha256
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.database import SessionLocal
from app import models, schemas
from app.security import (
    hash_password,
    create_access_token,
    authenticate,
    get_current_user,
    require_role,
    is_protected_owner,
    ROLE_OWNER,
    ROLE_ADMIN,
    ROLE_VIEWER,
    VALID_ROLES,
    generate_totp_secret,
    totp_provisioning_uri,
    verify_totp,
    encrypt_secret,
    decrypt_secret,
    create_temp_token,
    decode_temp_token,
    generate_backup_codes,
    hash_backup_codes,
    verify_backup_code,
    _fernet,
    TOTP_ISSUER,
)
from app.blocklist import is_disposable_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- Persistent (DB-backed) sliding-window rate limiter ----------------------
# Replaces the old in-memory limiter, which (a) reset on every Vercel
# deploy/cold-start and (b) was not shared across serverless instances. Now the
# counter lives in Postgres, so limits hold across restarts and concurrent
# functions. Applied to BOTH login (brute-force defense) and register (spam).
from sqlalchemy import and_ as _and
LOGIN_LIMIT = int(os.getenv("LOGIN_RATE_LIMIT", "10"))
LOGIN_WINDOW_SEC = int(os.getenv("LOGIN_RATE_WINDOW", "300"))
REG_LIMIT = int(os.getenv("REGISTER_RATE_LIMIT", "5"))
REG_WINDOW_SEC = int(os.getenv("REGISTER_RATE_WINDOW", "600"))


def _rate_ok(db: Session, scope: str, key: str, limit: int, window: int) -> bool:
    """Sliding-window check: allow `limit` hits per `window` seconds per (scope, key).
    Returns True if the request is permitted (and records the hit)."""
    now = time.time()
    row = (
        db.query(models.DBRateLimit)
        .filter(_and(models.DBRateLimit.scope == scope, models.DBRateLimit.key == key))
        .first()
    )
    if row is None:
        db.add(models.DBRateLimit(scope=scope, key=key, last_ts=now, count=1))
        db.commit()
        return True
    if now - row.last_ts >= window:
        # Window expired — reset the counter.
        row.last_ts = now
        row.count = 1
        db.commit()
        return True
    if row.count >= limit:
        return False
    row.count += 1
    row.last_ts = now
    db.commit()
    return True


def _client_ip(request: Request) -> str:
    return request.client.host if (request and request.client) else "unknown"


def _norm_email(email: str) -> str:
    return email.strip().lower()


def _hash_code(code: str) -> str:
    # Deterministic hash for invite codes (bcrypt salts randomly, so it cannot
    # be used to compare submitted codes). Codes are high-entropy random tokens.
    return sha256(code.encode("utf-8")).hexdigest()


@router.post("/register", response_model=schemas.UserPublic)
def register(
    req: schemas.RegisterRequest,
    db: Session = Depends(get_db),
    request: Request = None,
):
    client_ip = _client_ip(request)
    if not _rate_ok(db, "register", client_ip, REG_LIMIT, REG_WINDOW_SEC):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many registration attempts. Try again later.",
        )
    # Invite-code gate: self-signup requires a valid, unused, unrevoked code.
    if not req.invite_code:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="An invite code is required to register.",
        )
    code_hash = _hash_code(req.invite_code)  # deterministic compare (not bcrypt)
    invite = (
        db.query(models.DBInviteCode)
        .filter(models.DBInviteCode.code_hash == code_hash)
        .first()
    )
    if not invite or invite.revoked or invite.used_by:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid, used, or revoked invite code.",
        )
    email = _norm_email(req.email)
    if is_disposable_email(email):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Disposable / temporary email addresses are not allowed.",
        )
    if db.query(models.DBUser).filter(models.DBUser.email == email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )
    if len(req.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters",
        )
    role = invite.role if invite.role in VALID_ROLES else "viewer"
    user = models.DBUser(
        id=uuid.uuid4().hex,
        email=email,
        hashed_password=hash_password(req.password),
        full_name=req.full_name or "",
        role=role,
    )
    db.add(user)
    db.flush()  # assign user.id before stamping the invite
    # Consume the invite code (single-use, traceable to the new account).
    invite.used_by = user.id
    invite.used_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(user)
    return _to_public(user)


@router.post("/login", response_model=schemas.LoginResponse)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db), request: Request = None):
    # Brute-force defense: throttle repeated login attempts per client IP.
    client_ip = _client_ip(request)
    if not _rate_ok(db, "login", client_ip, LOGIN_LIMIT, LOGIN_WINDOW_SEC):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Slow down and try again shortly.",
        )
    email = _norm_email(req.email)
    user = authenticate(db, email, req.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    # Two-step login when 2FA is enabled on the account.
    if user.totp_enabled:
        if not req.totp_code:
            # Password OK, but need the TOTP code next. Issue a short-lived temp token.
            return schemas.LoginResponse(
                totp_required=True,
                temp_token=create_temp_token(user),
            )
        # Validate the provided code against the (decrypted) secret, OR a backup code.
        try:
            secret = decrypt_secret(user.totp_secret) if user.totp_secret else ""
        except Exception:
            secret = ""
        code_ok = bool(secret) and verify_totp(secret, req.totp_code)
        if not code_ok:
            # Fall back to a one-time recovery code (consumed on success).
            ok, remaining = verify_backup_code(user.totp_backup_codes, req.totp_code)
            if ok:
                user.totp_backup_codes = remaining
                db.commit()
                code_ok = True
        if not code_ok:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid two-factor code",
            )
    return schemas.LoginResponse(access_token=create_access_token(user))


@router.get("/me", response_model=schemas.UserPublic)
def me(user: models.DBUser = Depends(get_current_user)):
    return _to_public(user)


# --- Two-Factor Authentication (TOTP) ----------------------------------------
# Each user manages 2FA on their OWN account. The TOTP secret is encrypted at
# rest (FERNET_KEY); it is never returned in plaintext after initial setup.
@router.post("/2fa/setup", response_model=schemas.TwoFactorSetupResponse)
def tfa_setup(current_user: models.DBUser = Depends(get_current_user), db: Session = Depends(get_db)):
    # Operate on the db-scoped session (single session, no cross-session staleness).
    user = db.query(models.DBUser).filter(models.DBUser.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.totp_enabled:
        raise HTTPException(status_code=400, detail="2FA is already enabled on this account")
    if _fernet is None:
        raise HTTPException(
            status_code=503,
            detail="2FA is not available: server missing FERNET_KEY configuration.",
        )
    secret = generate_totp_secret()
    # Persist encrypted, but flagged disabled until the user confirms a code.
    user.totp_secret = encrypt_secret(secret)
    user.totp_enabled = False
    db.commit()
    return schemas.TwoFactorSetupResponse(
        secret=secret,
        otpauth_uri=totp_provisioning_uri(user.email, secret),
        issuer=TOTP_ISSUER,
    )


@router.post("/2fa/enable", response_model=schemas.TwoFactorBackupCodesResponse)
def tfa_enable(
    req: schemas.TwoFactorEnableRequest,
    current_user: models.DBUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Confirm the TOTP code, activate 2FA, and return one-time backup codes.

    The backup codes are shown EXACTLY ONCE (plaintext here); afterwards only
    their bcrypt hashes remain in the DB. Store them somewhere safe.
    """
    user = db.query(models.DBUser).filter(models.DBUser.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.totp_secret:
        raise HTTPException(status_code=400, detail="Call /2fa/setup first")
    try:
        secret = decrypt_secret(user.totp_secret)
    except Exception:
        raise HTTPException(status_code=500, detail="Could not decrypt 2FA secret")
    if not verify_totp(secret, req.code):
        raise HTTPException(status_code=400, detail="Invalid code; 2FA not enabled")
    user.totp_enabled = True
    # Generate one-time recovery codes (hashed at rest; plaintext returned ONCE).
    codes = generate_backup_codes(10)
    user.totp_backup_codes = hash_backup_codes(codes)
    db.commit()
    return schemas.TwoFactorBackupCodesResponse(backup_codes=codes)


@router.post("/2fa/backup-codes", response_model=schemas.TwoFactorBackupCodesResponse)
def tfa_regen_backup_codes(
    current_user: models.DBUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Regenerate backup codes. Old codes are invalidated. New codes shown ONCE."""
    user = db.query(models.DBUser).filter(models.DBUser.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.totp_enabled:
        raise HTTPException(status_code=400, detail="Enable 2FA before generating backup codes")
    codes = generate_backup_codes(10)
    user.totp_backup_codes = hash_backup_codes(codes)
    db.commit()
    return schemas.TwoFactorBackupCodesResponse(backup_codes=codes)


@router.post("/2fa/disable", response_model=schemas.UserPublic)
def tfa_disable(current_user: models.DBUser = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(models.DBUser).filter(models.DBUser.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.totp_enabled:
        raise HTTPException(status_code=400, detail="2FA is not enabled on this account")
    user.totp_enabled = False
    user.totp_secret = None
    user.totp_backup_codes = None
    db.commit()
    fresh = SessionLocal().query(models.DBUser).filter(models.DBUser.id == user.id).first()
    return _to_public(fresh)


@router.post("/2fa/verify", response_model=schemas.LoginResponse)
def tfa_verify(req: schemas.TwoFactorConfirmRequest, db: Session = Depends(get_db)):
    """Second step of login: exchange (temp_token + code) for a real JWT."""
    payload = decode_temp_token(req.temp_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired login session")
    user = db.query(models.DBUser).filter(models.DBUser.id == payload.get("sub")).first()
    if not user or not user.is_active or not user.totp_enabled:
        raise HTTPException(status_code=401, detail="Account state changed; please sign in again")
    try:
        secret = decrypt_secret(user.totp_secret) if user.totp_secret else ""
    except Exception:
        secret = ""
    code_ok = bool(secret) and verify_totp(secret, req.code)
    if not code_ok:
        # Fall back to a one-time recovery code (consumed on success).
        ok, remaining = verify_backup_code(user.totp_backup_codes, req.code)
        if ok:
            user.totp_backup_codes = remaining
            db.commit()
            code_ok = True
    if not code_ok:
        raise HTTPException(status_code=401, detail="Invalid two-factor code")
    return schemas.LoginResponse(access_token=create_access_token(user))


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout():
    # Stateless JWT: client discards the token. Endpoint exists for UX symmetry.
    return {"status": "ok"}


# --- Super-Admin (owner) user management -------------------------------------
# Only the `owner` role may manage OTHER users. `admin` manages content only.
@router.get("/users", response_model=list[schemas.UserPublic])
def list_users(owner: models.DBUser = Depends(require_role("owner")), db: Session = Depends(get_db)):
    return [_to_public(u) for u in db.query(models.DBUser).order_by(models.DBUser.created_at).all()]


@router.post("/users", response_model=schemas.UserPublic)
def create_user(
    req: schemas.RegisterRequest,
    owner: models.DBUser = Depends(require_role("owner")),
    db: Session = Depends(get_db),
):
    email = _norm_email(req.email)
    if is_disposable_email(email):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Disposable / temporary email addresses are not allowed.",
        )
    if db.query(models.DBUser).filter(models.DBUser.email == email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")
    if len(req.password) < 8:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Password must be at least 8 characters")
    role = req.role if req.role in VALID_ROLES else "viewer"
    user = models.DBUser(
        id=uuid.uuid4().hex,
        email=email,
        hashed_password=hash_password(req.password),
        full_name=req.full_name or "",
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _to_public(user)


@router.put("/users/{user_id}", response_model=schemas.UserPublic)
def update_user(
    user_id: str,
    payload: schemas.UserUpdate,
    owner: models.DBUser = Depends(require_role("owner")),
    db: Session = Depends(get_db),
):
    user = db.query(models.DBUser).filter(models.DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # The pinned owner can never be demoted, deactivated, or have its role changed.
    if is_protected_owner(user.email):
        if payload.role is not None and payload.role != "owner":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The owner account role is protected and cannot be changed")
        if payload.is_active is False:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The owner account cannot be deactivated")
    if payload.email is not None:
        email = _norm_email(payload.email)
        if is_disposable_email(email):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Disposable email not allowed")
        clash = db.query(models.DBUser).filter(models.DBUser.email == email, models.DBUser.id != user_id).first()
        if clash:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")
        user.email = email
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.role is not None:
        if payload.role not in VALID_ROLES:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="role must be 'owner', 'admin', or 'viewer'")
        user.role = payload.role
    if payload.password is not None:
        if len(payload.password) < 8:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Password must be at least 8 characters")
        user.hashed_password = hash_password(payload.password)
    if payload.is_active is not None:
        user.is_active = payload.is_active
    db.commit()
    db.refresh(user)
    return _to_public(user)


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(
    user_id: str,
    owner: models.DBUser = Depends(require_role("owner")),
    db: Session = Depends(get_db),
):
    user = db.query(models.DBUser).filter(models.DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Guardrails: never delete yourself, never delete the pinned owner.
    if user.id == owner.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot delete your own account")
    if is_protected_owner(user.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The owner account cannot be deleted")
    db.delete(user)
    db.commit()
    return {"status": "success", "message": f"User {user.email} removed"}


# --- Admin invitation-code management -----------------------------------------
def _gen_code() -> str:
    # Unambiguous, URL-safe token; admins copy/paste these.
    import secrets
    return secrets.token_urlsafe(16)


@router.post("/invites", response_model=list[schemas.InviteCodePublic])
def create_invites(
    req: schemas.InviteGenerateRequest,
    owner: models.DBUser = Depends(require_role("owner")),
    db: Session = Depends(get_db),
):
    role = req.role if req.role in VALID_ROLES else "viewer"
    created = []
    for _ in range(req.count):
        raw = _gen_code()
        code = models.DBInviteCode(
            code_hash=_hash_code(raw),
            role=role,
            created_by=owner.id,
        )
        db.add(code)
        db.flush()
        # Return the raw code ONLY here; it is never stored or listed again.
        created.append(schemas.InviteCodePublic(
            id=code.id,
            role=code.role,
            created_at=code.created_at,
            created_by=code.created_by,
            code=raw,
        ))
    db.commit()
    return created


@router.get("/invites", response_model=list[schemas.InviteCodePublic])
def list_invites(
    owner: models.DBUser = Depends(require_role("owner")),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(models.DBInviteCode)
        .order_by(models.DBInviteCode.created_at.desc())
        .all()
    )
    return [
        schemas.InviteCodePublic(
            id=r.id,
            role=r.role,
            created_at=r.created_at,
            created_by=r.created_by,
            used_by=r.used_by,
            used_at=r.used_at,
            revoked=r.revoked,
            revoked_at=r.revoked_at,
            # code intentionally omitted
        )
        for r in rows
    ]


@router.delete("/invites/{invite_id}", status_code=status.HTTP_200_OK)
def revoke_invite(
    invite_id: str,
    owner: models.DBUser = Depends(require_role("owner")),
    db: Session = Depends(get_db),
):
    code = db.query(models.DBInviteCode).filter(models.DBInviteCode.id == invite_id).first()
    if not code:
        raise HTTPException(status_code=404, detail="Invite code not found")
    if code.revoked:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already revoked")
    if code.used_by:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Code already used; cannot revoke")
    code.revoked = True
    code.revoked_at = datetime.utcnow().isoformat()
    db.commit()
    return {"status": "success", "message": f"Invite code {invite_id} revoked"}


def _to_public(u: models.DBUser) -> schemas.UserPublic:
    remaining = 0
    if u.totp_backup_codes:
        try:
            import json as _json
            remaining = len(_json.loads(u.totp_backup_codes))
        except Exception:
            remaining = 0
    return schemas.UserPublic(
        id=u.id,
        email=u.email,
        full_name=u.full_name,
        role=u.role,
        is_active=u.is_active,
        totp_enabled=bool(u.totp_enabled),
        backup_codes_remaining=remaining,
    )

"""Authentication router: login, register, current-user, logout (stateless).

Plus admin user-management: list / create / update / delete users.
Self-registration is allowed but disposable (temp-mail) domains are blocked to
reduce spam/bot signups. User-management mutations require the `admin` role.
"""
import os
import uuid
import time
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.security import (
    hash_password,
    create_access_token,
    authenticate,
    get_current_user,
    require_role,
)
from app.blocklist import is_disposable_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- Minimal in-memory rate limiter for registration -------------------------
# Keyed by client IP. 5 attempts / 10 minutes. Sufficient to blunt scripted
# spam floods; swap for Redis in a horizontally-scaled deployment.
_REG_ATTEMPTS: "defaultdict[str, list[float]]" = defaultdict(list)
REG_LIMIT = int(os.getenv("REGISTER_RATE_LIMIT", "5"))
REG_WINDOW_SEC = int(os.getenv("REGISTER_RATE_WINDOW", "600"))


def _reg_rate_ok(client_ip: str) -> bool:
    now = time.time()
    attempts = _REG_ATTEMPTS[client_ip]
    # drop stale
    _REG_ATTEMPTS[client_ip] = [t for t in attempts if now - t < REG_WINDOW_SEC]
    if len(_REG_ATTEMPTS[client_ip]) >= REG_LIMIT:
        return False
    _REG_ATTEMPTS[client_ip].append(now)
    return True


def _norm_email(email: str) -> str:
    return email.strip().lower()


@router.post("/register", response_model=schemas.UserPublic)
def register(
    req: schemas.RegisterRequest,
    db: Session = Depends(get_db),
    request: Request = None,
):
    client_ip = request.client.host if (request and request.client) else "unknown"
    if not _reg_rate_ok(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many registration attempts. Try again later.",
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
    role = req.role if req.role in ("admin", "viewer") else "viewer"
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


@router.post("/login", response_model=schemas.Token)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    email = _norm_email(req.email)
    user = authenticate(db, email, req.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    return schemas.Token(access_token=create_access_token(user))


@router.get("/me", response_model=schemas.UserPublic)
def me(user: models.DBUser = Depends(get_current_user)):
    return _to_public(user)


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout():
    # Stateless JWT: client discards the token. Endpoint exists for UX symmetry.
    return {"status": "ok"}


# --- Admin user management ---------------------------------------------------
@router.get("/users", response_model=list[schemas.UserPublic])
def list_users(admin: models.DBUser = Depends(require_role("admin")), db: Session = Depends(get_db)):
    return [_to_public(u) for u in db.query(models.DBUser).order_by(models.DBUser.created_at).all()]


@router.post("/users", response_model=schemas.UserPublic)
def create_user(
    req: schemas.RegisterRequest,
    admin: models.DBUser = Depends(require_role("admin")),
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
    role = req.role if req.role in ("admin", "viewer") else "viewer"
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
    admin: models.DBUser = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    user = db.query(models.DBUser).filter(models.DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
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
        if payload.role not in ("admin", "viewer"):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="role must be 'admin' or 'viewer'")
        # Prevent the last admin from being demoted/locked out
        if user.role == "admin" and payload.role != "admin":
            admin_count = db.query(models.DBUser).filter(models.DBUser.role == "admin").count()
            if admin_count <= 1:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot remove the last admin account")
        user.role = payload.role
    if payload.password is not None:
        if len(payload.password) < 8:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Password must be at least 8 characters")
        user.hashed_password = hash_password(payload.password)
    if payload.is_active is not None:
        if not payload.is_active and user.role == "admin":
            admin_count = db.query(models.DBUser).filter(models.DBUser.role == "admin", models.DBUser.is_active == True).count()
            if admin_count <= 1:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot deactivate the last active admin")
        user.is_active = payload.is_active
    db.commit()
    db.refresh(user)
    return _to_public(user)


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(
    user_id: str,
    admin: models.DBUser = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    user = db.query(models.DBUser).filter(models.DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Guardrails: never delete yourself, never delete the last active admin.
    if user.id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot delete your own account")
    if user.role == "admin":
        active_admins = db.query(models.DBUser).filter(models.DBUser.role == "admin", models.DBUser.is_active == True).count()
        if active_admins <= 1:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete the last active admin")
    db.delete(user)
    db.commit()
    return {"status": "success", "message": f"User {user.email} removed"}


def _to_public(u: models.DBUser) -> schemas.UserPublic:
    return schemas.UserPublic(
        id=u.id,
        email=u.email,
        full_name=u.full_name,
        role=u.role,
        is_active=u.is_active,
    )

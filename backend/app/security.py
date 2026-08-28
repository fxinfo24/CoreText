"""Authentication & authorization helpers (JWT + bcrypt + TOTP 2FA).

Tokens are signed with JWT_SECRET (env). Passwords are hashed with bcrypt via passlib.
TOTP secrets are encrypted at rest with Fernet (FERNET_KEY env) — never stored plaintext.
All protected routers depend on `get_current_user` from this module.
"""
import os
import json
import base64
import jwt
import pyotp
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

# --- Config -----------------------------------------------------------------
JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))  # 24h default
# Short-lived token issued after password check, before 2FA code is verified.
JWT_TEMP_EXPIRE_MINUTES = int(os.getenv("JWT_TEMP_EXPIRE_MINUTES", "5"))

TOTP_ISSUER = os.getenv("TOTP_ISSUER", "CoreText Executive OS")

# --- Secret encryption (Fernet) ----------------------------------------------
# The TOTP shared secret is encrypted before it touches the database. If
# FERNET_KEY is missing we refuse to store secrets (fail closed, never plaintext).
_FERNET_KEY = os.getenv("FERNET_KEY")
_fernet = None
if _FERNET_KEY:
    try:
        from cryptography.fernet import Fernet
        _fernet = Fernet(_FERNET_KEY.encode() if _FERNET_KEY.startswith("-----") or len(_FERNET_KEY) == 44 else _FERNET_KEY)
    except Exception:
        _fernet = None


def encrypt_secret(plain: str) -> str:
    if not _fernet:
        raise RuntimeError(
            "FERNET_KEY is not configured — cannot encrypt TOTP secret. "
            "Set FERNET_KEY (a 32-byte url-safe base64 key) in the environment."
        )
    return _fernet.encrypt(plain.encode()).decode()


def decrypt_secret(cipher: str) -> str:
    if not _fernet:
        raise RuntimeError("FERNET_KEY is not configured — cannot decrypt TOTP secret.")
    return _fernet.decrypt(cipher.encode()).decode()

# The Super-Admin (owner) is pinned by email. The owner is the only role that
# can manage OTHER users' roles/accounts, and can never be demoted/deactivated/
# deleted (see auth.py guards). Override via OWNER_EMAIL env (comma-list).
OWNER_EMAILS = [
    e.strip().lower()
    for e in os.getenv("OWNER_EMAIL", "fxinfo24@gmail.com").split(",")
    if e.strip()
]

ROLE_OWNER = "owner"
ROLE_ADMIN = "admin"
ROLE_VIEWER = "viewer"
VALID_ROLES = (ROLE_OWNER, ROLE_ADMIN, ROLE_VIEWER)


def is_owner(user) -> bool:
    return bool(user) and user.role == ROLE_OWNER


def is_protected_owner(email: str) -> bool:
    return email.strip().lower() in OWNER_EMAILS

# passlib bcrypt context (no native bcrypt import needed)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def hash_password(password: str) -> str:
    # bcrypt rejects >72 bytes; truncate defensively (passlib<1.8 quirk with bcrypt>=4.1)
    return pwd_context.hash(password.encode("utf-8")[:72].decode("utf-8", "ignore"))


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(plain.encode("utf-8")[:72].decode("utf-8", "ignore"), hashed)
    except Exception:
        return False


def create_access_token(user: models.DBUser) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "exp": expires,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def authenticate(db: Session, email: str, password: str) -> Optional[models.DBUser]:
    user = db.query(models.DBUser).filter(models.DBUser.email == email).first()
    if not user or not user.is_active:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


# --- 2FA (TOTP) --------------------------------------------------------------
def generate_totp_secret() -> str:
    """Return a new base32 TOTP secret (plaintext; encrypt before storing)."""
    return pyotp.random_base32()


def totp_provisioning_uri(email: str, secret: str) -> str:
    return pyotp.TOTP(secret).provisioning_uri(name=email, issuer_name=TOTP_ISSUER)


def verify_totp(secret: str, code: str) -> bool:
    # Allow a 1-step clock-skew window on each side.
    return pyotp.TOTP(secret).verify(code, valid_window=1)


# --- Two-step login tokens ---------------------------------------------------
def create_temp_token(user: models.DBUser) -> str:
    """Short-lived token proving password succeeded; 2FA code still required."""
    expires = datetime.now(timezone.utc) + timedelta(minutes=JWT_TEMP_EXPIRE_MINUTES)
    payload = {
        "sub": user.id,
        "email": user.email,
        "totp_pending": True,
        "exp": expires,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_temp_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if not payload.get("totp_pending"):
            return None
        return payload
    except jwt.PyJWTError:
        return None


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.DBUser:
    """Dependency that resolves the current user from a Bearer token.

    Returns 401 if missing/invalid/expired. Use on any router that must be
    protected.
    """
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise cred_exc
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise cred_exc
    except jwt.PyJWTError:
        raise cred_exc
    user = db.query(models.DBUser).filter(models.DBUser.id == user_id).first()
    if not user or not user.is_active:
        raise cred_exc
    return user


def require_role(*roles: str):
    """Dependency factory: restrict an endpoint to specific roles.

    `owner` always satisfies any role requirement (superuser passthrough).
    Usage: `@router.delete("/x", dependencies=[Depends(require_role("admin"))])`
    """

    def checker(user: models.DBUser = Depends(get_current_user)) -> models.DBUser:
        if is_owner(user):
            return user
        if roles and user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions for this action",
            )
        return user

    return checker

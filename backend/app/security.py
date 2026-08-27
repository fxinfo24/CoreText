"""Authentication & authorization helpers (JWT + bcrypt).

Tokens are signed with JWT_SECRET (env). Passwords are hashed with bcrypt via passlib.
All protected routers depend on `get_current_user` from this module.
"""
import os
import jwt
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

    Usage: `@router.delete("/x", dependencies=[Depends(require_role("admin"))])`
    """

    def checker(user: models.DBUser = Depends(get_current_user)) -> models.DBUser:
        if roles and user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions for this action",
            )
        return user

    return checker

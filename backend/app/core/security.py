import jwt
import bcrypt
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.database.mongodb import get_database

# OAuth2 Scheme definition
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_PREFIX}/auth/login",
    auto_error=False
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies if the plain password matches the bcrypt hashed password."""
    if not hashed_password or not plain_password:
        return False
    try:
        # Pre-hash with SHA-256 digest to safely handle any length under 72-byte limit
        sha_digest = hashlib.sha256(plain_password.encode("utf-8")).hexdigest().encode("utf-8")
        return bcrypt.checkpw(sha_digest, hashed_password.encode("utf-8"))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Generates a secure bcrypt hash of the plain password."""
    sha_digest = hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(sha_digest, salt)
    return hashed.decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generates an encrypted JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({
        "exp": expire,
        "type": "access"
    })
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generates an encrypted JWT refresh token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({
        "exp": expire,
        "type": "refresh"
    })
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes a JWT access token, returning its payload. Returns None if invalid."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Optional[AsyncIOMotorDatabase] = Depends(get_database)
) -> Dict[str, Any]:
    """Retrieves authenticated user from database using JWT access token."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection unavailable"
        )

    from app.repositories.user import UserRepository
    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with token no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user["_id"] = str(user["_id"])
    return user

async def get_current_active_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Ensures the authenticated user account is active."""
    if not current_user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    return current_user

class RoleChecker:
    """Dependency checking if the authenticated user has one of the allowed roles."""
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: Dict[str, Any] = Depends(get_current_active_user)) -> Dict[str, Any]:
        if current_user.get("role") not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have authorization to perform this action."
            )
        return current_user

def RequireRole(roles: List[str]):
    """Helper alias for role verification dependency."""
    return Depends(RoleChecker(roles))

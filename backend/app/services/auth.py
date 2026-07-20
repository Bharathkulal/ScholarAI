import logging
import secrets
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_access_token,
)
from app.core.config import settings
from app.repositories.user import UserRepository
from app.schemas.auth import UserCreate, UserLogin, PasswordResetConfirm, GoogleLoginRequest

logger = logging.getLogger(__name__)

class AuthService:
    """Service class handling authentication workflows, JWT management, and user accounts."""

    @staticmethod
    def _format_user_data(user: Dict[str, Any]) -> Dict[str, Any]:
        """Formats MongoDB user document for schema serialization."""
        user_copy = user.copy()
        user_copy["_id"] = str(user_copy["_id"])
        # Remove sensitive password hash
        user_copy.pop("password_hash", None)
        # Ensure backward compatibility keys
        if "gpa" not in user_copy or not user_copy["gpa"]:
            user_copy["gpa"] = user_copy.get("cgpa") or "9.0 CGPA"
        if "savedCount" not in user_copy:
            user_copy["savedCount"] = 0
        if "appliedCount" not in user_copy:
            user_copy["appliedCount"] = 0
        return user_copy

    @classmethod
    async def register_user(cls, user_in: UserCreate, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        user_repo = UserRepository(db)
        
        # Check duplicate email
        existing_user = await user_repo.get_by_email(user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )

        # Hash password and prepare user dictionary
        password_hash = get_password_hash(user_in.password)
        user_dict = user_in.model_dump()
        user_dict.pop("password", None)
        user_dict["password_hash"] = password_hash
        user_dict["role"] = "student"  # Public registration is strictly student role
        user_dict["provider"] = "email"
        user_dict["is_email_verified"] = False
        user_dict["profile_completion"] = 50

        created_user = await user_repo.create_user(user_dict)
        user_id = str(created_user["_id"])

        # Generate Access & Refresh tokens
        token_data = {"sub": user_id, "email": created_user["email"], "role": created_user["role"]}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        # Store refresh token & update last login
        await user_repo.store_refresh_token(user_id, refresh_token)
        await user_repo.update_last_login(user_id)

        formatted_user = cls._format_user_data(created_user)

        return {
            "user": formatted_user,
            "tokens": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            }
        }

    @classmethod
    async def login_user(cls, login_in: UserLogin, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        user_repo = UserRepository(db)
        user = await user_repo.get_by_email(login_in.email)

        if not user or not verify_password(login_in.password, user.get("password_hash", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email address or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive. Please contact system support."
            )

        user_id = str(user["_id"])
        token_data = {"sub": user_id, "email": user["email"], "role": user.get("role", "student")}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        await user_repo.store_refresh_token(user_id, refresh_token)
        await user_repo.update_last_login(user_id)

        formatted_user = cls._format_user_data(user)

        return {
            "user": formatted_user,
            "tokens": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            }
        }

    @classmethod
    async def refresh_tokens(cls, refresh_token: str, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        payload = decode_access_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get("sub")
        user_repo = UserRepository(db)
        user = await user_repo.get_by_id(user_id)

        if not user or not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account no longer active or exists",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Check if refresh_token is stored
        if refresh_token not in user.get("refresh_tokens", []):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has been revoked or invalidated",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token_data = {"sub": user_id, "email": user["email"], "role": user.get("role", "student")}
        new_access_token = create_access_token(token_data)

        return {
            "access_token": new_access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }

    @classmethod
    async def logout_user(cls, user_id: str, refresh_token: Optional[str], db: AsyncIOMotorDatabase) -> None:
        user_repo = UserRepository(db)
        if refresh_token:
            await user_repo.remove_refresh_token(user_id, refresh_token)
        else:
            await user_repo.clear_all_refresh_tokens(user_id)

    @classmethod
    async def forgot_password(cls, email: str, db: AsyncIOMotorDatabase) -> str:
        user_repo = UserRepository(db)
        user = await user_repo.get_by_email(email)

        if user:
            reset_token = secrets.token_urlsafe(32)
            expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
            await user_repo.store_reset_token(str(user["_id"]), reset_token, expires_at)
            
            # Log mocked password reset email trigger
            logger.info(
                f"[MOCK EMAIL SERVICE] Password reset token generated for user '{email}': "
                f"Token = {reset_token} (Valid for 1 hour)"
            )

        return "If an account with that email exists, password reset instructions have been sent."

    @classmethod
    async def reset_password(cls, reset_in: PasswordResetConfirm, db: AsyncIOMotorDatabase) -> None:
        user_repo = UserRepository(db)
        user = await user_repo.get_by_reset_token(reset_in.token)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired password reset token."
            )

        user_id = str(user["_id"])
        new_password_hash = get_password_hash(reset_in.new_password)

        await user_repo.update_user(user_id, {"password_hash": new_password_hash})
        await user_repo.clear_reset_token(user_id)
        await user_repo.clear_all_refresh_tokens(user_id)

    @classmethod
    async def google_login(cls, google_in: GoogleLoginRequest, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        user_repo = UserRepository(db)
        email = google_in.email
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google OAuth profile did not contain a valid email address."
            )

        user = await user_repo.get_by_email(email)

        if user:
            # Update existing user if needed
            update_fields = {}
            if not user.get("google_id") and google_in.id_token:
                update_fields["google_id"] = google_in.id_token
            if not user.get("avatar") and google_in.avatar:
                update_fields["avatar"] = google_in.avatar
            
            if update_fields:
                user = await user_repo.update_user(str(user["_id"]), update_fields)
        else:
            # Create new user via Google
            new_user_data = {
                "full_name": google_in.full_name or "Google User",
                "email": email,
                "password_hash": None,
                "role": "student",
                "avatar": google_in.avatar,
                "google_id": google_in.id_token or "google_oauth",
                "provider": "google",
                "is_email_verified": True,
                "is_active": True,
                "profile_completion": 60,
            }
            user = await user_repo.create_user(new_user_data)

        user_id = str(user["_id"])
        token_data = {"sub": user_id, "email": user["email"], "role": user.get("role", "student")}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        await user_repo.store_refresh_token(user_id, refresh_token)
        await user_repo.update_last_login(user_id)

        formatted_user = cls._format_user_data(user)

        return {
            "user": formatted_user,
            "tokens": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            }
        }

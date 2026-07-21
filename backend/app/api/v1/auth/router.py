from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, status, Body, Request, Response, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_database
from app.core.security import get_current_user, set_auth_cookies, clear_auth_cookies
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    PasswordResetRequest,
    PasswordResetConfirm,
    GoogleLoginRequest,
)
from app.schemas.token import RefreshTokenRequest, Token
from app.schemas.user import UserResponse
from app.schemas.response import SuccessResponse
from app.services.auth import AuthService

router = APIRouter()

@router.post("/register", summary="Register a new student account", response_model=SuccessResponse[Dict[str, Any]], status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    result = await AuthService.register_user(user_in, db)
    tokens = result.get("tokens", {})
    set_auth_cookies(
        response,
        access_token=tokens.get("access_token", ""),
        refresh_token=tokens.get("refresh_token", ""),
        remember_me=False
    )
    return SuccessResponse(
        success=True,
        message="Registration successful. Account created successfully.",
        data=result
    )

@router.post("/login", summary="Authenticate user and return tokens", response_model=SuccessResponse[Dict[str, Any]])
async def login(
    login_in: UserLogin,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    result = await AuthService.login_user(login_in, db)
    tokens = result.get("tokens", {})
    set_auth_cookies(
        response,
        access_token=tokens.get("access_token", ""),
        refresh_token=tokens.get("refresh_token", ""),
        remember_me=login_in.remember_me or False
    )
    return SuccessResponse(
        success=True,
        message="Authentication successful.",
        data=result
    )

@router.get("/me", summary="Retrieve currently logged-in user profile", response_model=SuccessResponse[Dict[str, Any]])
async def get_me(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    formatted_user = AuthService._format_user_data(current_user)
    return SuccessResponse(
        success=True,
        message="Current user profile retrieved successfully.",
        data={"user": formatted_user}
    )

@router.post("/refresh", summary="Refresh access token using valid refresh token", response_model=SuccessResponse[Dict[str, Any]])
async def refresh_token(
    request: Request,
    response: Response,
    token_in: Optional[RefreshTokenRequest] = Body(None),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    refresh_token_val = (token_in.refresh_token if token_in else None) or request.cookies.get("refresh_token")
    if not refresh_token_val:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token required in request body or cookies."
        )

    result = await AuthService.refresh_tokens(refresh_token_val, db)
    set_auth_cookies(
        response,
        access_token=result.get("access_token", ""),
        refresh_token=result.get("refresh_token", refresh_token_val),
        remember_me=True
    )
    return SuccessResponse(
        success=True,
        message="Access token refreshed successfully.",
        data=result
    )

@router.post("/logout", summary="Invalidate user active refresh token session", response_model=SuccessResponse[None])
async def logout(
    request: Request,
    response: Response,
    token_in: Optional[RefreshTokenRequest] = Body(None),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    refresh_token_val = (token_in.refresh_token if token_in else None) or request.cookies.get("refresh_token")
    await AuthService.logout_user(current_user["_id"], refresh_token_val, db)
    clear_auth_cookies(response)
    return SuccessResponse(
        success=True,
        message="Logged out successfully.",
        data=None
    )

@router.post("/forgot-password", summary="Request password reset token", response_model=SuccessResponse[str])
async def forgot_password(
    request_in: PasswordResetRequest,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    msg = await AuthService.forgot_password(request_in.email, db)
    return SuccessResponse(
        success=True,
        message=msg,
        data=None
    )

@router.post("/reset-password", summary="Reset password using valid reset token", response_model=SuccessResponse[None])
async def reset_password(
    reset_in: PasswordResetConfirm,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    await AuthService.reset_password(reset_in, db)
    return SuccessResponse(
        success=True,
        message="Password updated successfully. Please sign in with your new password.",
        data=None
    )

@router.post("/google", summary="Authenticate or register user via Google OAuth Token", response_model=SuccessResponse[Dict[str, Any]])
async def google_login(
    google_in: GoogleLoginRequest,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    result = await AuthService.google_login(google_in, db)
    tokens = result.get("tokens", {})
    set_auth_cookies(
        response,
        access_token=tokens.get("access_token", ""),
        refresh_token=tokens.get("refresh_token", ""),
        remember_me=google_in.remember_me or False
    )
    return SuccessResponse(
        success=True,
        message="Google authentication successful.",
        data=result
    )

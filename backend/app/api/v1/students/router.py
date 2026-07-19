from typing import Dict, Any
from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_database
from app.core.security import get_current_user
from app.schemas.user import UserProfileUpdate
from app.schemas.response import SuccessResponse
from app.repositories.user import UserRepository
from app.services.auth import AuthService

router = APIRouter()

@router.get("/profile", summary="Get current student profile details", response_model=SuccessResponse[Dict[str, Any]])
async def get_profile(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    formatted_user = AuthService._format_user_data(current_user)
    return SuccessResponse(
        success=True,
        message="Student profile retrieved successfully.",
        data={"profile": formatted_user}
    )

@router.put("/profile", summary="Update student profile details", response_model=SuccessResponse[Dict[str, Any]])
async def update_profile(
    profile_in: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    update_data = {k: v for k, v in profile_in.model_dump().items() if v is not None}
    
    # Calculate profile completion dynamically
    total_fields = 10
    filled = sum(1 for v in update_data.values() if v)
    update_data["profile_completion"] = min(100, max(40, int((filled / total_fields) * 100)))

    updated_user = await user_repo.update_user(current_user["_id"], update_data)
    if not updated_user:
        updated_user = current_user
        
    formatted_user = AuthService._format_user_data(updated_user)
    return SuccessResponse(
        success=True,
        message="Profile updated successfully.",
        data={"profile": formatted_user}
    )

@router.get("/recommendations", summary="Get AI scholarship recommendations")
async def get_recommendations():
    return {"recommendations": [], "status": "placeholder"}

@router.get("/settings", summary="Get student configuration settings")
async def get_settings():
    return {"settings": {}, "status": "placeholder"}

@router.put("/settings", summary="Update student configuration settings")
async def update_settings():
    return {"updated": True, "status": "placeholder"}

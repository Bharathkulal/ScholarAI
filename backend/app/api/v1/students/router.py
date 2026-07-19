from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, status, File, UploadFile, Form, Path
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_database
from app.core.security import get_current_user
from app.schemas.student import StudentProfileUpdateSchema
from app.schemas.response import SuccessResponse
from app.services.student import StudentService
from app.services.storage import get_storage_service, BaseStorageService

router = APIRouter()

@router.get("/profile", summary="Get complete student profile with completion & eligibility data", response_model=SuccessResponse[Dict[str, Any]])
async def get_profile(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    profile = await StudentService.get_student_profile(current_user["_id"], db)
    return SuccessResponse(
        success=True,
        message="Student profile retrieved successfully.",
        data={"profile": profile}
    )

@router.put("/profile", summary="Update student profile wizard details", response_model=SuccessResponse[Dict[str, Any]])
async def update_profile(
    profile_in: StudentProfileUpdateSchema,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    updated_profile = await StudentService.update_student_profile(current_user["_id"], profile_in, db)
    return SuccessResponse(
        success=True,
        message="Profile updated successfully.",
        data={"profile": updated_profile}
    )

@router.post("/profile/avatar", summary="Upload student profile photo avatar", response_model=SuccessResponse[Dict[str, Any]])
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user),
    storage_service: BaseStorageService = Depends(get_storage_service),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    res = await StudentService.upload_avatar(current_user["_id"], file, storage_service, db)
    return SuccessResponse(
        success=True,
        message=res["message"],
        data={"avatar_url": res["avatar_url"]}
    )

@router.post("/profile/documents", summary="Upload a new student verification document", response_model=SuccessResponse[Dict[str, Any]])
async def upload_document(
    file: UploadFile = File(...),
    type: str = Form(..., description="Document type (e.g. aadhaar, income, caste, marks_card, etc.)"),
    title: Optional[str] = Form(None, description="Document title descriptor"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    storage_service: BaseStorageService = Depends(get_storage_service),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    res = await StudentService.upload_document(
        current_user["_id"], file, type, title or type, storage_service, db
    )
    return SuccessResponse(
        success=True,
        message=res["message"],
        data={"document": res["document"]}
    )

@router.delete("/profile/documents/{id}", summary="Delete an uploaded student verification document", response_model=SuccessResponse[None])
async def delete_document(
    id: str = Path(..., description="Document unique identifier ID"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    storage_service: BaseStorageService = Depends(get_storage_service),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    await StudentService.delete_document(current_user["_id"], id, storage_service, db)
    return SuccessResponse(
        success=True,
        message="Document deleted successfully.",
        data=None
    )

@router.get("/profile/completion", summary="Get detailed module completion percentages", response_model=SuccessResponse[Dict[str, Any]])
async def get_completion(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    res = await StudentService.get_completion_scores(current_user["_id"], db)
    return SuccessResponse(
        success=True,
        message="Profile completion status calculated.",
        data=res
    )

@router.get("/profile/eligibility", summary="Evaluate student eligibility match standing", response_model=SuccessResponse[Dict[str, Any]])
async def get_eligibility(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    res = await StudentService.get_eligibility_evaluation(current_user["_id"], db)
    return SuccessResponse(
        success=True,
        message="Eligibility evaluation complete.",
        data=res
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

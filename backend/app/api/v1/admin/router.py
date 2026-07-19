from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, status, Path, Query, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_database
from app.core.security import RequireRole
from app.schemas.response import SuccessResponse
from app.schemas.student import DocumentVerificationRequest
from app.repositories.user import UserRepository
from app.services.student import StudentService

router = APIRouter(dependencies=[RequireRole(["admin", "superadmin"])])

@router.get("/dashboard", summary="Retrieve admin dashboard statistics")
async def get_dashboard(db: AsyncIOMotorDatabase = Depends(get_database)):
    user_repo = UserRepository(db)
    total_students = await user_repo.count({"role": "student"})
    return SuccessResponse(
        success=True,
        message="Dashboard statistics retrieved.",
        data={
            "statistics": {
                "total_students": total_students,
                "active_applications": 0,
                "verified_documents": 0,
                "pending_verifications": 0
            }
        }
    )

@router.get("/students", summary="Manage and list student accounts")
async def list_students(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    students = await user_repo.find({"role": "student"}, limit=limit, skip=skip)
    total = await user_repo.count({"role": "student"})
    
    formatted_students = [StudentService._format_profile_response(s) for s in students]

    return SuccessResponse(
        success=True,
        message="Student list retrieved.",
        data={
            "students": formatted_students,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    )

@router.get("/students/{id}/profile", summary="View complete profile and documents of a specific student")
async def get_student_profile_admin(
    id: str = Path(..., description="Student User ID"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    profile = await StudentService.get_student_profile(id, db)
    return SuccessResponse(
        success=True,
        message="Student profile retrieved for admin verification.",
        data={"profile": profile}
    )

@router.put("/students/{id}/documents/{doc_id}/status", summary="Approve or reject a student document")
async def update_document_verification_status(
    req: DocumentVerificationRequest,
    id: str = Path(..., description="Student User ID"),
    doc_id: str = Path(..., description="Document ID"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if req.status not in ["approved", "rejected", "pending"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be one of: 'approved', 'rejected', 'pending'."
        )

    user_repo = UserRepository(db)
    updated_user = await user_repo.update_document_status(id, doc_id, req.status, req.rejection_reason)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student or document not found."
        )

    formatted_profile = StudentService._format_profile_response(updated_user)

    return SuccessResponse(
        success=True,
        message=f"Document verification status updated to '{req.status}'.",
        data={"profile": formatted_profile}
    )

@router.get("/scholarships", summary="Manage and list scholarships")
async def list_scholarships():
    return {"scholarships": [], "status": "placeholder"}

@router.post("/scholarships/bulk-import", summary="Bulk import scholarships from CSV/Excel")
async def bulk_import_scholarships():
    return {"imported": 0, "status": "placeholder"}

@router.get("/applications", summary="List and manage student applications")
async def list_applications():
    return {"applications": [], "status": "placeholder"}

@router.get("/analytics", summary="Retrieve advanced system analytics")
async def get_analytics():
    return {"analytics": {}, "status": "placeholder"}

@router.post("/announcements", summary="Publish global system announcement")
async def create_announcement():
    return {"published": True, "status": "placeholder"}

@router.get("/settings", summary="Get admin configuration settings")
async def get_settings():
    return {"settings": {}, "status": "placeholder"}

@router.get("/system", summary="Retrieve health metrics of internal systems")
async def get_system_health():
    return {"services": {}, "status": "placeholder"}

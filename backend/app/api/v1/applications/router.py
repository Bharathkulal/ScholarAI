from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, status, Path, Query, HTTPException, Body
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_database
from app.core.security import RequireRole, get_current_user
from app.schemas.response import SuccessResponse
from app.schemas.application import (
    ApplicationCreateSchema,
    ApplicationUpdateSchema,
)
from app.services.application import ApplicationService

router = APIRouter(dependencies=[RequireRole(["student", "admin"])])

@router.get("/dashboard", summary="Retrieve student portal dashboard stats & applications", response_model=SuccessResponse[Dict[str, Any]])
async def get_student_dashboard(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    data = await ApplicationService.get_student_dashboard_data(student_id, db)
    return SuccessResponse(
        success=True,
        message="Student dashboard overview loaded.",
        data=data
    )

@router.get("", summary="List all submitted & draft applications for student", response_model=SuccessResponse[List[Dict[str, Any]]])
async def list_student_applications(
    status_val: Optional[str] = Query(None, alias="status", description="Filter by status: draft, submitted, under_review, approved, rejected, cancelled"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    apps = await ApplicationService.get_student_applications(student_id, status_val, db)
    return SuccessResponse(
        success=True,
        message="Applications list retrieved.",
        data=apps
    )

@router.get("/saved", summary="List all saved scholarship bookmarks for student", response_model=SuccessResponse[List[Dict[str, Any]]])
async def list_saved_scholarships(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    saved = await ApplicationService.get_saved_scholarships(student_id, db)
    return SuccessResponse(
        success=True,
        message="Saved scholarships list retrieved.",
        data=saved
    )

@router.get("/{id}", summary="Get detailed application tracking record & history timeline", response_model=SuccessResponse[Dict[str, Any]])
async def get_application_detail(
    id: str = Path(..., description="Application ID or Application Number"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    app_doc = await ApplicationService.get_application_detail(id, student_id, db)
    return SuccessResponse(
        success=True,
        message="Application tracking file retrieved.",
        data={"application": app_doc}
    )

@router.post("", summary="Submit or draft a scholarship application", response_model=SuccessResponse[Dict[str, Any]], status_code=status.HTTP_201_CREATED)
async def submit_application(
    app_in: ApplicationCreateSchema,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    res = await ApplicationService.create_or_submit_application(student_id, app_in, db)
    msg = "Application submitted successfully!" if app_in.status == "submitted" else "Application draft saved."
    return SuccessResponse(
        success=True,
        message=msg,
        data={"application": res}
    )

@router.delete("/{id}", summary="Withdraw or cancel a pending application", response_model=SuccessResponse[Dict[str, Any]])
async def withdraw_application(
    id: str = Path(..., description="Application ID"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    updated = await ApplicationService.withdraw_application(id, student_id, db)
    return SuccessResponse(
        success=True,
        message="Application withdrawn successfully.",
        data={"application": updated}
    )

@router.post("/save", summary="Bookmark or un-bookmark a scholarship scheme", response_model=SuccessResponse[Dict[str, Any]])
async def toggle_save_scholarship(
    scholarship_id: str = Body(..., embed=True),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    res = await ApplicationService.toggle_saved_scholarship(student_id, scholarship_id, db)
    return SuccessResponse(
        success=True,
        message=res["message"],
        data=res
    )

@router.delete("/save/{scholarship_id}", summary="Remove a scholarship from bookmarks", response_model=SuccessResponse[Dict[str, Any]])
async def remove_saved_scholarship(
    scholarship_id: str = Path(..., description="Scholarship ID"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    res = await ApplicationService.toggle_saved_scholarship(student_id, scholarship_id, db)
    return SuccessResponse(
        success=True,
        message="Scholarship removed from bookmarks.",
        data=res
    )

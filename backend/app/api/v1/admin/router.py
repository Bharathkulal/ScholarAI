from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, status, Path, Query, HTTPException, File, UploadFile, Body
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_database
from app.core.security import RequireRole, get_current_user
from app.schemas.response import SuccessResponse
from app.schemas.student import DocumentVerificationRequest
from app.schemas.scholarship import (
    ScholarshipCreateSchema,
    ScholarshipUpdateSchema,
    BulkImportSummarySchema
)
from app.schemas.application import AdminApplicationReviewSchema
from app.schemas.admin import AnnouncementCreateSchema, SystemSettingsSchema
from app.repositories.user import UserRepository
from app.repositories.scholarship import ScholarshipRepository
from app.repositories.application import ApplicationRepository
from app.repositories.audit_log import AuditLogRepository
from app.repositories.announcement import AnnouncementRepository
from app.services.student import StudentService
from app.services.scholarship import ScholarshipService
from app.services.application import ApplicationService
from app.services.admin_analytics import AdminAnalyticsService
from app.services.report_generator import ReportGeneratorService

router = APIRouter(dependencies=[RequireRole(["admin", "superadmin"])])

# ==================== ENTERPRISE TELEMETRY & DASHBOARD ====================

@router.get("/dashboard", summary="Retrieve enterprise admin dashboard telemetry statistics")
async def get_dashboard(db: AsyncIOMotorDatabase = Depends(get_database)):
    telemetry = await AdminAnalyticsService.get_dashboard_telemetry(db)
    return SuccessResponse(
        success=True,
        message="Enterprise dashboard telemetry retrieved.",
        data={"statistics": telemetry}
    )

@router.get("/analytics", summary="Retrieve MongoDB real-time aggregation charts data")
async def get_analytics(db: AsyncIOMotorDatabase = Depends(get_database)):
    charts = await AdminAnalyticsService.get_analytics_charts(db)
    return SuccessResponse(
        success=True,
        message="Analytics aggregations retrieved.",
        data=charts
    )

@router.get("/reports", summary="Export custom platform reports (CSV / JSON)")
async def export_report(
    report_type: str = Query("students", description="students, scholarships, applications, income"),
    export_format: str = Query("csv", description="csv, json"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    content = await ReportGeneratorService.generate_report(report_type, export_format, db)
    media_type = "application/json" if export_format == "json" else "text/csv"
    ext = "json" if export_format == "json" else "csv"
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={report_type}_report.{ext}"}
    )

@router.get("/audit-logs", summary="Stream operational audit logs feed")
async def get_audit_logs(
    actor_email: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = AuditLogRepository(db)
    res = await repo.get_logs(actor_email=actor_email, page=page, limit=limit)
    return SuccessResponse(
        success=True,
        message="Audit logs feed retrieved.",
        data=res
    )

# ==================== ANNOUNCEMENTS & SYSTEM SETTINGS ====================

@router.post("/announcements", summary="Publish targeted system broadcast notification")
async def create_announcement(
    ann_in: AnnouncementCreateSchema,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = AnnouncementRepository(db)
    audit_repo = AuditLogRepository(db)

    admin_email = current_user.get("email") or "admin@scholarai.com"
    data = ann_in.model_dump()
    data["published_by"] = admin_email

    created = await repo.create_announcement(data)

    await audit_repo.log_event(
        action="ANNOUNCEMENT_BROADCAST",
        actor_email=admin_email,
        details={"title": ann_in.title, "priority": ann_in.priority}
    )

    return SuccessResponse(
        success=True,
        message=f"Announcement '{ann_in.title}' broadcasted successfully.",
        data={"announcement": created}
    )

@router.get("/announcements", summary="List published system announcements")
async def list_announcements(
    limit: int = Query(20, ge=1, le=50),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = AnnouncementRepository(db)
    items = await repo.get_announcements(limit=limit)
    return SuccessResponse(
        success=True,
        message="Announcements retrieved.",
        data={"announcements": items}
    )

# ==================== STUDENT MANAGEMENT APIS ====================

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
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    audit_repo = AuditLogRepository(db)

    updated_user = await user_repo.update_document_status(id, doc_id, req.status, req.rejection_reason)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student or document not found."
        )

    admin_email = current_user.get("email") or "admin@scholarai.com"
    await audit_repo.log_event(
        action=f"DOCUMENT_{req.status.upper()}",
        actor_email=admin_email,
        details={"student_id": id, "doc_id": doc_id, "status": req.status}
    )

    formatted_profile = StudentService._format_profile_response(updated_user)

    return SuccessResponse(
        success=True,
        message=f"Document verification status updated to '{req.status}'.",
        data={"profile": formatted_profile}
    )

# ==================== SCHOLARSHIP MANAGEMENT APIS ====================

@router.post("/scholarships", summary="Create a new scholarship entry", response_model=SuccessResponse[Dict[str, Any]], status_code=status.HTTP_201_CREATED)
async def create_scholarship(
    scholarship_in: ScholarshipCreateSchema,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    created_by = current_user.get("email") or "admin"
    res = await ScholarshipService.create_scholarship(scholarship_in, created_by, db)
    
    audit_repo = AuditLogRepository(db)
    await audit_repo.log_event(
        action="SCHOLARSHIP_CREATED",
        actor_email=created_by,
        details={"title": scholarship_in.title, "slug": res.get("slug")}
    )

    return SuccessResponse(
        success=True,
        message="Scholarship entry created successfully.",
        data={"scholarship": res}
    )

@router.get("/scholarships", summary="List all scholarships for admin management")
async def list_admin_scholarships(
    query: Optional[str] = Query(None),
    status_val: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query("newest"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = ScholarshipRepository(db)
    res = await repo.find_with_filters(
        query=query,
        category=category,
        status_val=status_val,
        page=page,
        limit=limit,
        sort_by=sort_by
    )
    return SuccessResponse(
        success=True,
        message="Admin scholarships list retrieved.",
        data=res
    )

@router.get("/scholarships/{id}", summary="Get detailed scholarship entry for admin editing")
async def get_admin_scholarship_detail(
    id: str = Path(..., description="Scholarship ID"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = ScholarshipRepository(db)
    scholarship = await repo.get_by_id(id)

    if not scholarship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scholarship record not found."
        )

    scholarship["_id"] = str(scholarship["_id"])

    return SuccessResponse(
        success=True,
        message="Scholarship detail retrieved.",
        data={"scholarship": scholarship}
    )

@router.put("/scholarships/{id}", summary="Update existing scholarship entry")
async def update_scholarship(
    scholarship_in: ScholarshipUpdateSchema,
    id: str = Path(..., description="Scholarship ID"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    updated = await ScholarshipService.update_scholarship(id, scholarship_in, db)
    return SuccessResponse(
        success=True,
        message="Scholarship entry updated successfully.",
        data={"scholarship": updated}
    )

@router.delete("/scholarships/{id}", summary="Archive a scholarship entry")
async def archive_scholarship(
    id: str = Path(..., description="Scholarship ID"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    await ScholarshipService.archive_scholarship(id, db)
    return SuccessResponse(
        success=True,
        message="Scholarship archived successfully.",
        data=None
    )

@router.post("/scholarships/{id}/publish", summary="Toggle scholarship publication status")
async def publish_scholarship(
    publish: bool = Body(True, embed=True),
    id: str = Path(..., description="Scholarship ID"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    res = await ScholarshipService.set_publish_status(id, publish, db)
    msg = "Scholarship published successfully." if publish else "Scholarship status set to draft."
    return SuccessResponse(
        success=True,
        message=msg,
        data={"scholarship": res}
    )

@router.post("/scholarships/import", summary="Bulk import scholarships from CSV file")
async def bulk_import_scholarships(
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    contents = await file.read()
    csv_text = contents.decode("utf-8-sig", errors="ignore")
    created_by = current_user.get("email") or "admin"

    summary = await ScholarshipService.bulk_import_csv(csv_text, created_by, db)

    return SuccessResponse(
        success=True,
        message=f"Bulk import processed: {summary.imported_count} imported, {summary.skipped_count} skipped.",
        data={"summary": summary.model_dump()}
    )

@router.get("/scholarships/export", summary="Export scholarships to CSV format")
async def export_scholarships(db: AsyncIOMotorDatabase = Depends(get_database)):
    csv_data = await ScholarshipService.export_csv(db)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=scholarships_export.csv"}
    )

# ==================== APPLICATION MANAGEMENT APIS ====================

@router.get("/applications", summary="List and audit all student scholarship applications")
async def list_admin_applications(
    query: Optional[str] = Query(None),
    status_val: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = ApplicationRepository(db)
    res = await repo.find_all_admin(status_val=status_val, query=query, page=page, limit=limit)
    return SuccessResponse(
        success=True,
        message="Admin applications catalog retrieved.",
        data=res
    )

@router.get("/applications/{id}", summary="Get detailed application record & frozen profile snapshot")
async def get_admin_application_detail(
    id: str = Path(..., description="Application ID"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = ApplicationRepository(db)
    app_doc = await repo.get_by_id(id)

    if not app_doc:
        app_doc = await repo.get_by_number(id)

    if not app_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application file not found."
        )

    app_doc["_id"] = str(app_doc["_id"])

    return SuccessResponse(
        success=True,
        message="Application detail retrieved for admin audit.",
        data={"application": app_doc}
    )

@router.put("/applications/{id}/status", summary="Approve, reject or update student application status")
async def review_application_status(
    review_in: AdminApplicationReviewSchema,
    id: str = Path(..., description="Application ID"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    admin_email = current_user.get("email") or "admin@scholarai.com"
    updated = await ApplicationService.admin_review_application(id, review_in, admin_email, db)

    audit_repo = AuditLogRepository(db)
    await audit_repo.log_event(
        action=f"APPLICATION_{review_in.status.upper()}",
        actor_email=admin_email,
        details={"app_id": id, "status": review_in.status}
    )

    return SuccessResponse(
        success=True,
        message=f"Application status updated to '{review_in.status}'.",
        data={"application": updated}
    )

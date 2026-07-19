from fastapi import APIRouter

# Import sub-routers
from app.api.v1.auth.router import router as auth_router
from app.api.v1.students.router import router as students_router
from app.api.v1.admin.router import router as admin_router
from app.api.v1.scholarships.router import router as scholarships_router
from app.api.v1.applications.router import router as applications_router
from app.api.v1.documents.router import router as documents_router
from app.api.v1.notifications.router import router as notifications_router
from app.api.v1.analytics.router import router as analytics_router
from app.api.v1.ai.router import router as ai_router

api_router = APIRouter()

# Include routes
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(students_router, prefix="/students", tags=["Student Portal"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin Portal"])
api_router.include_router(scholarships_router, prefix="/scholarships", tags=["Scholarships"])
api_router.include_router(applications_router, prefix="/applications", tags=["Applications"])
api_router.include_router(documents_router, prefix="/documents", tags=["Documents"])
api_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(ai_router, prefix="/ai", tags=["AI Copilot & Engines"])

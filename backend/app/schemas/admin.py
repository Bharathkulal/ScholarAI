from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AuditLogSchema(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    action: str  # e.g. "STUDENT_LOGIN", "SCHOLARSHIP_PUBLISHED", "APPLICATION_REVIEWED"
    actor_email: str
    actor_role: str = "admin"
    details: Dict[str, Any] = Field(default_factory=dict)
    ip_address: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now())

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }

class AnnouncementCreateSchema(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    message: str = Field(..., min_length=5)
    target_audience: Dict[str, Any] = Field(default_factory=lambda: {"course": "All", "district": "All", "category": "All"})
    priority: str = Field(default="Normal", pattern="^(Normal|Urgent|Emergency)$")

class SystemSettingsSchema(BaseModel):
    platform_name: str = "ScholarAI"
    logo_url: Optional[str] = None
    ai_provider: str = Field(default="gemini", pattern="^(gemini|openrouter|groq)$")
    maintenance_mode: bool = False
    jwt_expiration_minutes: int = 30
    updated_at: datetime = Field(default_factory=lambda: datetime.now())

class AdminDashboardMetricsSchema(BaseModel):
    total_students: int
    verified_students: int
    active_students: int
    total_scholarships: int
    published_scholarships: int
    expired_scholarships: int
    total_applications: int
    pending_applications: int
    approved_applications: int
    rejected_applications: int
    approval_rate: float
    rejection_rate: float
    ai_recommendations_run: int
    pending_document_verifications: int

class AnalyticsChartsSchema(BaseModel):
    registration_trend: List[Dict[str, Any]]
    category_distribution: List[Dict[str, Any]]
    state_distribution: List[Dict[str, Any]]
    course_distribution: List[Dict[str, Any]]
    income_distribution: List[Dict[str, Any]]
    application_status_distribution: List[Dict[str, Any]]

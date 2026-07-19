from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ApplicationHistoryEventSchema(BaseModel):
    step: str  # "Created", "Submitted", "Document Verified", "Under Review", "Approved", "Rejected", "Withdrawn"
    status: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now())
    by: str = "Student"  # "Student", "Admin", "System"
    remarks: Optional[str] = None

class ApplicationSnapshotSchema(BaseModel):
    personal: Dict[str, Any] = Field(default_factory=dict)
    academic: Dict[str, Any] = Field(default_factory=dict)
    family: Dict[str, Any] = Field(default_factory=dict)
    eligibility: Dict[str, Any] = Field(default_factory=dict)
    documents: List[Dict[str, Any]] = Field(default_factory=list)

class ApplicationCreateSchema(BaseModel):
    scholarship_id: str
    scholarship_slug: str
    scholarship_title: str
    scholarship_provider: str
    status: str = Field(default="submitted", pattern="^(draft|submitted)$")
    declaration_accepted: bool = True

class ApplicationUpdateSchema(BaseModel):
    status: Optional[str] = Field(None, pattern="^(draft|submitted|cancelled)$")
    declaration_accepted: Optional[bool] = None

class AdminApplicationReviewSchema(BaseModel):
    status: str = Field(..., pattern="^(submitted|under_review|approved|rejected|action_required|cancelled)$")
    verification_status: Optional[str] = Field("verified", pattern="^(pending|verified|action_required)$")
    admin_comments: Optional[str] = None
    remarks: Optional[str] = None

class ApplicationResponseSchema(BaseModel):
    id: str = Field(..., alias="_id")
    application_number: str
    student_id: str
    scholarship_id: str
    scholarship_slug: str
    scholarship_title: str
    scholarship_provider: str
    status: str  # "draft", "submitted", "under_review", "approved", "rejected", "cancelled"
    snapshot: ApplicationSnapshotSchema
    documents: List[Dict[str, Any]] = Field(default_factory=list)
    eligibility_standing: Dict[str, Any] = Field(default_factory=dict)
    verification_status: str = "pending"
    admin_comments: Optional[str] = None
    remarks: Optional[str] = None
    application_history: List[ApplicationHistoryEventSchema] = Field(default_factory=list)
    submitted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }

class SavedScholarshipSchema(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    student_id: str
    scholarship_id: str
    scholarship_slug: str
    scholarship_title: str
    scholarship_provider: str
    scholarship_amount: Optional[str] = None
    scholarship_deadline: Optional[str] = None
    saved_at: datetime = Field(default_factory=lambda: datetime.now())

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }

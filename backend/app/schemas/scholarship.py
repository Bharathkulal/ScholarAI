from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr

class AmountInfoSchema(BaseModel):
    amount: Any = Field(default="₹50,000 / year")
    numeric_amount: float = 50000.0
    currency: str = "INR"
    frequency: str = "Yearly"  # "Yearly", "Monthly", "One-Time"
    renewable: bool = True
    benefits_description: Optional[str] = None

class EligibilityCriteriaSchema(BaseModel):
    state: Optional[str] = "Karnataka"
    district: Optional[str] = None
    nationality: Optional[str] = "Indian"
    domicile: Optional[str] = "Karnataka"
    category: Optional[str] = None  # "General", "OBC", "SC", "ST", "EWS", "Minority"
    religion: Optional[str] = None
    gender: Optional[str] = "All"  # "All", "Female", "Male"
    course: Optional[str] = None
    department: Optional[str] = None
    branch: Optional[str] = None
    education_level: Optional[str] = None  # "SSLC", "PUC", "Diploma", "UG", "PG"
    min_cgpa: Optional[float] = 0.0
    min_percentage: Optional[float] = 0.0
    max_income: Optional[float] = 800000.0
    age_limit: Optional[int] = None
    disability: Optional[str] = "All"
    minority: Optional[str] = "All"
    farmer: Optional[str] = "All"
    sports_quota: Optional[str] = "All"
    ncc: Optional[str] = "All"
    single_girl_child: Optional[str] = "All"
    hosteller_day_scholar: Optional[str] = "All"

class ApplicationInfoSchema(BaseModel):
    mode: str = "Online"  # "Online", "Offline", "Hybrid"
    start_date: Optional[str] = None
    end_date: Optional[str] = "2026-08-31"
    official_apply_url: Optional[str] = "https://ssp.postmatric.karnataka.gov.in"
    steps: List[str] = Field(default_factory=lambda: [
      "Register on official state portal",
      "Upload verified Aadhaar & Income certificates",
      "Submit online application before deadline"
    ])
    faqs: List[Dict[str, str]] = Field(default_factory=list)

class ScholarshipCreateSchema(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    provider: str = Field(..., min_length=2, max_length=150)
    organization: Optional[str] = None
    government_level: str = Field(default="State", description="Central, State, Private, NGO, University")
    category: str = Field(default="Karnataka State")
    description: str
    short_description: Optional[str] = None
    banner_image: Optional[str] = None
    logo: Optional[str] = None
    official_website: Optional[str] = None
    official_apply_url: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    amount_info: AmountInfoSchema = Field(default_factory=AmountInfoSchema)
    eligibility_criteria: EligibilityCriteriaSchema = Field(default_factory=EligibilityCriteriaSchema)
    required_documents: List[str] = Field(default_factory=lambda: [
      "SSLC / PUC Marks Card",
      "Annual Income Certificate",
      "Caste & Category Certificate",
      "Aadhaar Identity Card"
    ])
    application_info: ApplicationInfoSchema = Field(default_factory=ApplicationInfoSchema)
    status: str = Field(default="published", pattern="^(draft|published|archived|expired)$")

class ScholarshipUpdateSchema(BaseModel):
    title: Optional[str] = None
    provider: Optional[str] = None
    organization: Optional[str] = None
    government_level: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    banner_image: Optional[str] = None
    logo: Optional[str] = None
    official_website: Optional[str] = None
    official_apply_url: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    amount_info: Optional[AmountInfoSchema] = None
    eligibility_criteria: Optional[EligibilityCriteriaSchema] = None
    required_documents: Optional[List[str]] = None
    application_info: Optional[ApplicationInfoSchema] = None
    status: Optional[str] = None

class ScholarshipResponseSchema(ScholarshipCreateSchema):
    id: str = Field(..., alias="_id")
    slug: str
    created_by: Optional[str] = "admin"
    created_at: datetime
    updated_at: datetime
    view_count: int = 0
    saved_count: int = 0
    application_count: int = 0

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }

class BulkImportSummarySchema(BaseModel):
    total_processed: int
    imported_count: int
    skipped_count: int
    errors: List[str] = Field(default_factory=list)

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr

class AddressSchema(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    taluk: Optional[str] = None
    village_city: Optional[str] = None
    pin_code: Optional[str] = None

class PersonalSchema(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    avatar: Optional[str] = None
    address: AddressSchema = Field(default_factory=AddressSchema)

class AcademicSchema(BaseModel):
    college_name: Optional[str] = None
    university: Optional[str] = None
    course: Optional[str] = None
    branch: Optional[str] = None
    semester: Optional[str] = None
    current_year: Optional[str] = None
    roll_number: Optional[str] = None
    registration_number: Optional[str] = None
    cgpa: Optional[str] = None
    percentage: Optional[str] = None
    sslc_percentage: Optional[str] = None
    puc_percentage: Optional[str] = None
    backlogs: Optional[int] = 0
    expected_graduation: Optional[str] = None

class FamilySchema(BaseModel):
    father_name: Optional[str] = None
    mother_name: Optional[str] = None
    guardian: Optional[str] = None
    occupation: Optional[str] = None
    annual_income: Optional[str] = None
    bpl_status: Optional[str] = None  # "Yes", "No"
    ration_card_type: Optional[str] = None  # "BPL", "APL", "AAY"

class EligibilitySchema(BaseModel):
    category: Optional[str] = None  # "General", "OBC", "SC", "ST", "EWS", "Minority"
    religion: Optional[str] = None
    nationality: Optional[str] = "Indian"
    state: Optional[str] = None
    domicile: Optional[str] = None
    disability: Optional[str] = "No"  # "Yes", "No"
    ncc: Optional[str] = "No"  # "Yes", "No"
    sports_quota: Optional[str] = "No"  # "Yes", "No"
    farmer_family: Optional[str] = "No"  # "Yes", "No"
    single_girl_child: Optional[str] = "No"  # "Yes", "No"
    orphan: Optional[str] = "No"  # "Yes", "No"
    ex_serviceman: Optional[str] = "No"  # "Yes", "No"
    hosteller_day_scholar: Optional[str] = "Hosteller"  # "Hosteller", "Day Scholar"

class DocumentItemSchema(BaseModel):
    id: str
    type: str  # e.g., "aadhaar", "income", "caste", "domicile", "marks_card", etc.
    title: str
    file_name: str
    file_url: str
    file_size: int
    mime_type: str
    upload_date: str
    status: str = "pending"  # "pending", "approved", "rejected"
    rejection_reason: Optional[str] = None

class EducationTimelineItemSchema(BaseModel):
    id: str
    level: str  # "SSLC", "PUC", "Diploma", "UG", "PG", "Other"
    institution: str
    board_university: str
    year_of_passing: str
    percentage_cgpa: str
    certificate_url: Optional[str] = None

class SkillsAchievementsSchema(BaseModel):
    programming_skills: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    projects: List[Dict[str, Any]] = Field(default_factory=list)
    internships: List[Dict[str, Any]] = Field(default_factory=list)
    certifications: List[Dict[str, Any]] = Field(default_factory=list)
    hackathons: List[Dict[str, Any]] = Field(default_factory=list)
    sports: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    volunteer_work: List[str] = Field(default_factory=list)

class ProfileCompletionSchema(BaseModel):
    personal: int = 0
    academic: int = 0
    family: int = 0
    eligibility: int = 0
    documents: int = 0
    skills: int = 0
    timeline: int = 0
    overall: int = 0

class EligibilityEvaluationSchema(BaseModel):
    status: str  # "Eligible", "Possibly Eligible", "Not Eligible"
    match_score: int  # 0-100
    matched_schemes: List[str] = Field(default_factory=list)
    reasons: List[str] = Field(default_factory=list)
    missing_fields: List[str] = Field(default_factory=list)
    required_documents: List[str] = Field(default_factory=list)

class StudentProfileFullSchema(BaseModel):
    user_id: str
    personal: PersonalSchema = Field(default_factory=PersonalSchema)
    academic: AcademicSchema = Field(default_factory=AcademicSchema)
    family: FamilySchema = Field(default_factory=FamilySchema)
    eligibility: EligibilitySchema = Field(default_factory=EligibilitySchema)
    documents: List[DocumentItemSchema] = Field(default_factory=list)
    timeline: List[EducationTimelineItemSchema] = Field(default_factory=list)
    skills: SkillsAchievementsSchema = Field(default_factory=SkillsAchievementsSchema)
    profile_completion: ProfileCompletionSchema = Field(default_factory=ProfileCompletionSchema)
    eligibility_summary: Optional[EligibilityEvaluationSchema] = None
    updated_at: Optional[datetime] = None

class StudentProfileUpdateSchema(BaseModel):
    personal: Optional[PersonalSchema] = None
    academic: Optional[AcademicSchema] = None
    family: Optional[FamilySchema] = None
    eligibility: Optional[EligibilitySchema] = None
    documents: Optional[List[DocumentItemSchema]] = None
    timeline: Optional[List[EducationTimelineItemSchema]] = None
    skills: Optional[SkillsAchievementsSchema] = None

class DocumentVerificationRequest(BaseModel):
    status: str  # "approved" or "rejected"
    rejection_reason: Optional[str] = None

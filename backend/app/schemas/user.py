from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: str = Field(default="student", description="Role of user: student, admin, superadmin")
    avatar: Optional[str] = None
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    college: Optional[str] = None
    course: Optional[str] = None
    semester: Optional[str] = None
    cgpa: Optional[str] = None
    category: Optional[str] = None
    income: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    college: Optional[str] = None
    course: Optional[str] = None
    semester: Optional[str] = None
    cgpa: Optional[str] = None
    category: Optional[str] = None
    income: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(UserBase):
    id: str = Field(..., alias="_id")
    is_email_verified: bool = False
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    google_id: Optional[str] = None
    provider: str = "email"
    profile_completion: int = 40
    
    # Frontend backward compatibility fields
    gpa: Optional[str] = None
    savedCount: int = 0
    appliedCount: int = 0

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }

class UserProfile(UserResponse):
    pass

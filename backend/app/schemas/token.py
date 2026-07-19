from typing import Optional
from pydantic import BaseModel, Field

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800  # seconds (30 mins)

class TokenPayload(BaseModel):
    sub: str
    email: str
    role: str = "student"
    type: str = "access"
    exp: Optional[int] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Valid refresh token")

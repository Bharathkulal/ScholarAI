class UserRole:
    ADMIN = "admin"
    STUDENT = "student"
    USER = "user"

class ApplicationStatus:
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"

class ScholarshipStatus:
    ACTIVE = "active"
    EXPIRED = "expired"
    DRAFT = "draft"

# Default pagination constants
DEFAULT_PAGE_SIZE = 10
MAX_PAGE_SIZE = 100

# File Upload Constraints (e.g. 5 MB)
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
ALLOWED_DOCUMENT_EXTENSIONS = {".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"}

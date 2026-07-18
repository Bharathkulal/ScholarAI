import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catches all unhandled generic Python exceptions."""
    logger.exception(f"Unhandled exception caught on request {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An internal server error occurred. Please try again later.",
            "error": "INTERNAL_SERVER_ERROR"
        }
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Catches standard FastAPI/Starlette HTTPExceptions."""
    # Attempt to derive custom error codes, defaulting to HTTP_ERROR or NOT_FOUND
    error_code = "HTTP_ERROR"
    if exc.status_code == 404:
        error_code = "NOT_FOUND"
    elif exc.status_code == 401:
        error_code = "UNAUTHORIZED"
    elif exc.status_code == 403:
        error_code = "FORBIDDEN"
    elif exc.status_code == 400:
        error_code = "BAD_REQUEST"

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "error": error_code
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Catches Pydantic schema input validation errors."""
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed for request parameters or body.",
            "error": "VALIDATION_ERROR",
            "details": exc.errors()
        }
    )

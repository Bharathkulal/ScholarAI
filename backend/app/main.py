import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import os

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.security_headers import SecurityHeadersMiddleware
from app.core.rate_limiter import RateLimiterMiddleware
from app.database.mongodb import db_manager, get_database
from app.database.indexes import create_indexes
from app.middleware.error_handler import (
    global_exception_handler,
    http_exception_handler,
    validation_exception_handler,
)
from app.middleware.request_logging import RequestLoggingMiddleware
from app.api.v1.router import api_router

# Setup structured logging
setup_logging()
logger = logging.getLogger("app.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Initializing server startup routines...")
    await db_manager.connect()
    await create_indexes()
    yield
    # Shutdown actions
    logger.info("Initializing server shutdown routines...")
    await db_manager.close()

# Initialize FastAPI App
app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "ScholarAI is an AI-powered Scholarship Discovery & Eligibility Platform "
        "where students discover scholarships, check eligibility, manage documents, "
        "receive AI recommendations, and apply through official scholarship portals."
    ),
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs" if settings.APP_ENV != "production" else None,
    redoc_url="/redoc" if settings.APP_ENV != "production" else None,
)

# Security & Rate Limiting Middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimiterMiddleware, max_requests=120, window_seconds=60)
app.add_middleware(RequestLoggingMiddleware)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Mount Static Uploads Directory
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Root-level health and info APIs
@app.get("/", tags=["Info"])
async def get_project_status():
    """Retrieve basic service branding and running confirmation."""
    return {
        "project": f"{settings.APP_NAME} API",
        "status": "Running",
        "version": settings.APP_VERSION
    }

@app.get("/health", tags=["Health"])
async def health_check(db = Depends(get_database)):
    """Retrieve detailed health indicators of the API and connected database."""
    db_status = "disconnected"
    if db is not None:
        try:
            await db.client.admin.command("ping")
            db_status = "connected"
        except Exception:
            db_status = "disconnected"

    return {
        "status": "healthy",
        "server": "running",
        "database": db_status
    }

@app.get("/version", tags=["Info"])
async def get_project_version():
    """Retrieve active API version indicator."""
    return {
        "version": settings.APP_VERSION
    }

# Register Versioned API Routers
app.include_router(api_router, prefix=settings.API_PREFIX)

logger.info("FastAPI Application setup complete.")

from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, status, Query, Path
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_database
from app.schemas.response import SuccessResponse
from app.repositories.scholarship import ScholarshipRepository
from app.services.scholarship import ScholarshipService

router = APIRouter()

@router.get("", summary="List published scholarships with search, filters, sorting and pagination", response_model=SuccessResponse[Dict[str, Any]])
async def list_scholarships(
    query: Optional[str] = Query(None, description="Search keyword query"),
    category: Optional[str] = Query(None, description="Scholarship category"),
    government_level: Optional[str] = Query(None, description="Central, State, Private, NGO, University"),
    provider: Optional[str] = Query(None, description="Provider or organization name"),
    state: Optional[str] = Query(None, description="State of domicile"),
    min_amount: Optional[float] = Query(None, description="Minimum financial award amount"),
    max_income: Optional[float] = Query(None, description="Maximum annual family income ceiling"),
    sort_by: str = Query("newest", description="newest, deadline, highest_amount, popularity, recently_updated, alphabetical"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = ScholarshipRepository(db)
    res = await repo.find_with_filters(
        query=query,
        category=category,
        government_level=government_level,
        provider=provider,
        state=state,
        min_amount=min_amount,
        max_income=max_income,
        status_val="published",
        page=page,
        limit=limit,
        sort_by=sort_by
    )
    return SuccessResponse(
        success=True,
        message="Scholarships list retrieved successfully.",
        data=res
    )

@router.get("/search", summary="Search scholarships", response_model=SuccessResponse[Dict[str, Any]])
async def search_scholarships(
    query: str = Query(..., description="Search keyword"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = ScholarshipRepository(db)
    res = await repo.find_with_filters(query=query, status_val="published", page=page, limit=limit)
    return SuccessResponse(
        success=True,
        message="Scholarship search results retrieved.",
        data=res
    )

@router.get("/filter", summary="Advanced scholarship filtering", response_model=SuccessResponse[Dict[str, Any]])
async def filter_scholarships(
    category: Optional[str] = Query(None),
    government_level: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    sort_by: str = Query("newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = ScholarshipRepository(db)
    res = await repo.find_with_filters(
        category=category,
        government_level=government_level,
        state=state,
        status_val="published",
        sort_by=sort_by,
        page=page,
        limit=limit
    )
    return SuccessResponse(
        success=True,
        message="Filtered scholarships retrieved.",
        data=res
    )

@router.get("/categories", summary="Get distinct scholarship categories", response_model=SuccessResponse[List[str]])
async def get_categories(db: AsyncIOMotorDatabase = Depends(get_database)):
    repo = ScholarshipRepository(db)
    categories = await repo.get_distinct_categories()
    return SuccessResponse(
        success=True,
        message="Scholarship categories retrieved.",
        data=categories
    )

@router.get("/providers", summary="Get distinct scholarship providers", response_model=SuccessResponse[List[str]])
async def get_providers(db: AsyncIOMotorDatabase = Depends(get_database)):
    repo = ScholarshipRepository(db)
    providers = await repo.get_distinct_providers()
    return SuccessResponse(
        success=True,
        message="Scholarship providers retrieved.",
        data=providers
    )

@router.get("/{slug}", summary="Get detailed information for a single scholarship by slug", response_model=SuccessResponse[Dict[str, Any]])
async def get_scholarship_detail(
    slug: str = Path(..., description="Scholarship unique slug identifier"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    scholarship = await ScholarshipService.get_by_slug(slug, increment_view=True, db=db)
    return SuccessResponse(
        success=True,
        message="Scholarship detail retrieved.",
        data={"scholarship": scholarship}
    )

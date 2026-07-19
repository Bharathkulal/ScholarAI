from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, status, Query, Body, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_database
from app.core.security import RequireRole, get_current_user
from app.schemas.response import SuccessResponse
from app.repositories.scholarship import ScholarshipRepository
from app.services.student import StudentService
from app.services.recommendation_engine import RecommendationEngine
from app.services.ai_advisor import ProfileAdvisorService
from app.services.ai_chat import AIChatService

router = APIRouter(dependencies=[RequireRole(["student", "admin"])])

@router.get("/recommendations", summary="Run AI Recommendation Engine for student", response_model=SuccessResponse[Dict[str, Any]])
async def get_ai_recommendations(
    limit: int = Query(10, ge=1, le=50),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    profile = await StudentService.get_student_profile(student_id, db)

    sch_repo = ScholarshipRepository(db)
    sch_res = await sch_repo.find_with_filters(status_val="published", limit=100)
    scholarships = sch_res.get("items", [])

    ranked = RecommendationEngine.rank_scholarships_for_student(profile, scholarships)

    return SuccessResponse(
        success=True,
        message="AI recommendations generated successfully.",
        data={
            "recommendations": ranked[:limit],
            "total_evaluated": len(scholarships)
        }
    )

@router.get("/profile-analysis", summary="Analyze student profile strength and improvement suggestions", response_model=SuccessResponse[Dict[str, Any]])
async def get_profile_analysis(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    profile = await StudentService.get_student_profile(student_id, db)

    analysis = ProfileAdvisorService.analyze_profile_strength(profile)
    return SuccessResponse(
        success=True,
        message="Profile strength analysis completed.",
        data=analysis
    )

@router.get("/eligibility-report", summary="Generate full AI eligibility audit report", response_model=SuccessResponse[Dict[str, Any]])
async def get_eligibility_report(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    profile = await StudentService.get_student_profile(student_id, db)

    sch_repo = ScholarshipRepository(db)
    sch_res = await sch_repo.find_with_filters(status_val="published", limit=100)
    scholarships = sch_res.get("items", [])

    report = ProfileAdvisorService.generate_eligibility_report(profile, scholarships)
    return SuccessResponse(
        success=True,
        message="AI eligibility report generated.",
        data=report
    )

@router.post("/chat", summary="Interact with grounded context-aware AI assistant", response_model=SuccessResponse[Dict[str, Any]])
async def ai_chat(
    question: str = Body(..., embed=True),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    profile = await StudentService.get_student_profile(student_id, db)

    sch_repo = ScholarshipRepository(db)
    sch_res = await sch_repo.find_with_filters(status_val="published", limit=10)
    scholarships = sch_res.get("items", [])

    answer = await AIChatService.answer_student_question(question, profile, scholarships)
    return SuccessResponse(
        success=True,
        message="AI assistant reply generated.",
        data=answer
    )

@router.post("/compare", summary="Compare 2 to 5 scholarships side-by-side", response_model=SuccessResponse[Dict[str, Any]])
async def compare_scholarships(
    scholarship_ids: List[str] = Body(..., embed=True),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if len(scholarship_ids) < 2 or len(scholarship_ids) > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comparison requires between 2 and 5 scholarship IDs."
        )

    student_id = current_user.get("user_id") or current_user.get("sub") or str(current_user.get("_id"))
    profile = await StudentService.get_student_profile(student_id, db)

    sch_repo = ScholarshipRepository(db)
    sch_res = await sch_repo.find_with_filters(status_val="published", limit=100)
    scholarships = sch_res.get("items", [])

    comparison = AIChatService.compare_scholarships_side_by_side(scholarship_ids, profile, scholarships)
    return SuccessResponse(
        success=True,
        message="Scholarships compared successfully.",
        data=comparison
    )

@router.post("/nl-search", summary="Convert natural language search query to structured filters", response_model=SuccessResponse[Dict[str, Any]])
async def natural_language_search(
    query: str = Body(..., embed=True),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    parsed_filters = AIChatService.parse_natural_language_search(query)
    return SuccessResponse(
        success=True,
        message="Natural language search query converted to filters.",
        data=parsed_filters
    )

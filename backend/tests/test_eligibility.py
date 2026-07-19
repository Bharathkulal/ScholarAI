import pytest
from app.services.eligibility_engine import EligibilityEngine
from app.services.recommendation_engine import RecommendationEngine

def test_eligibility_engine_profile_audit():
    student_profile = {
        "personal": {"address": {"state": "Karnataka"}},
        "academic": {"cgpa": "9.2"},
        "family": {"annual_income": "₹2,40,000 / year"},
        "eligibility": {"category": "OBC (Cat-3A)", "domicile": "Karnataka"},
        "documents": [{"type": "aadhaar"}, {"type": "income"}]
    }

    res = EligibilityEngine.evaluate_eligibility(student_profile)
    assert res is not None
    assert "matched_schemes" in res
    assert "match_score" in res
    assert res["status"] == "Eligible"

def test_recommendation_engine_scholarship_match():
    student_profile = {
        "personal": {"address": {"state": "Karnataka"}},
        "academic": {"cgpa": "9.2"},
        "family": {"annual_income": "₹2,40,000 / year"},
        "eligibility": {"category": "OBC (Cat-3A)", "domicile": "Karnataka"},
        "documents": [{"type": "aadhaar"}, {"type": "income"}]
    }

    scholarship = {
        "_id": "sch_ssp_1",
        "title": "Karnataka Post-Matric State Scholarship (SSP)",
        "provider": "Govt of Karnataka",
        "eligibility_criteria": {
            "state": "Karnataka",
            "category": "OBC",
            "min_cgpa": 6.0,
            "max_income": 250000.0
        }
    }

    res = RecommendationEngine.evaluate_scholarship_match(student_profile, scholarship)
    assert res["match_score"] >= 80.0
    assert res["recommendation_level"] in ["Perfect Match", "Highly Recommended", "Good Match"]

import logging
from typing import Dict, Any, List
from app.services.recommendation_engine import RecommendationEngine

logger = logging.getLogger(__name__)

class ProfileAdvisorService:
    """Service providing profile optimization advice and eligibility reports."""

    @classmethod
    def analyze_profile_strength(cls, student_profile: Dict[str, Any]) -> Dict[str, Any]:
        personal = student_profile.get("personal", {})
        academic = student_profile.get("academic", {})
        family = student_profile.get("family", {})
        eligibility = student_profile.get("eligibility", {})
        documents = student_profile.get("documents", [])
        completion = student_profile.get("profile_completion", {})

        suggestions = []

        if not personal.get("phone"):
            suggestions.append({
                "priority": "High",
                "module": "Personal",
                "action": "Add verified contact phone number to receive SMS deadline alerts."
            })

        if not family.get("annual_income"):
            suggestions.append({
                "priority": "Critical",
                "module": "Family",
                "action": "Specify annual family income to qualify for SSP & NSP fee reimbursement grants."
            })

        if not academic.get("cgpa"):
            suggestions.append({
                "priority": "High",
                "module": "Academic",
                "action": "Enter current college CGPA score to unlock merit-cum-means fellowships."
            })

        if len(documents) == 0:
            suggestions.append({
                "priority": "Critical",
                "module": "Documents",
                "action": "Upload Income Certificate and Aadhaar Card to enable automated eligibility verification."
            })
        elif len(documents) < 3:
            suggestions.append({
                "priority": "Medium",
                "module": "Documents",
                "action": "Upload Caste / SSLC Marks Card to complete document readiness."
            })

        overall_score = completion.get("overall", 75)
        strength_tier = "Excellent" if overall_score >= 90 else "Good" if overall_score >= 70 else "Needs Work"

        return {
            "overall_score": overall_score,
            "strength_tier": strength_tier,
            "completion_modules": completion,
            "suggestions": suggestions,
            "unlocked_eligibility_boost": f"+{max(0, 100 - overall_score)}% higher match chance upon completing suggestions."
        }

    @classmethod
    def generate_eligibility_report(
        cls, student_profile: Dict[str, Any], scholarships: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        ranked = RecommendationEngine.rank_scholarships_for_student(student_profile, scholarships)

        eligible = []
        near_eligible = []
        not_eligible = []

        for item in ranked:
            score = item["match_score"]
            if score >= 80.0:
                eligible.append(item)
            elif score >= 50.0:
                near_eligible.append(item)
            else:
                not_eligible.append(item)

        return {
            "student_name": student_profile.get("personal", {}).get("full_name") or "Student User",
            "report_generated_at": "2026-07-19",
            "total_analyzed": len(scholarships),
            "summary_counts": {
                "eligible": len(eligible),
                "near_eligible": len(near_eligible),
                "not_eligible": len(not_eligible)
            },
            "eligible_scholarships": eligible,
            "near_eligible_scholarships": near_eligible,
            "not_eligible_scholarships": not_eligible
        }

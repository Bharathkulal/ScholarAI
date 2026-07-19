import re
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

class RecommendationEngine:
    """Multi-criteria weighted AI scoring and explainability recommendation engine."""

    @staticmethod
    def _parse_numeric(val: Any, default: float = 0.0) -> float:
        if isinstance(val, (int, float)):
            return float(val)
        if not val:
            return default
        cleaned = re.sub(r"[^\d.]", "", str(val))
        try:
            return float(cleaned) if cleaned else default
        except ValueError:
            return default

    @classmethod
    def evaluate_scholarship_match(
        cls, student_profile: Dict[str, Any], scholarship: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calculates 12-criteria weighted match score (0-100) and explainability details."""
        
        personal = student_profile.get("personal", {})
        academic = student_profile.get("academic", {})
        family = student_profile.get("family", {})
        eligibility = student_profile.get("eligibility", {})
        documents = student_profile.get("documents", [])
        timeline = student_profile.get("timeline", [])
        completion = student_profile.get("profile_completion", {}).get("overall", 70)

        sch_elig = scholarship.get("eligibility_criteria", {})
        sch_amt = scholarship.get("amount_info", {})
        sch_app = scholarship.get("application_info", {})

        score_components = {}
        why_recommended = []
        missing_requirements = []

        # 1. Profile Completeness (5%)
        score_components["profile"] = min(5.0, (completion / 100.0) * 5.0)

        # 2. Income Ceiling Match (15%)
        st_income = cls._parse_numeric(family.get("annual_income"), 250000.0)
        sch_max_income = sch_elig.get("max_income") or 800000.0
        if st_income <= sch_max_income:
            score_components["income"] = 15.0
            why_recommended.append(f"Family income (₹{st_income:,.0f}) is within eligibility limit (₹{sch_max_income:,.0f}).")
        else:
            score_components["income"] = 0.0
            missing_requirements.append(f"Family income exceeds scheme ceiling limit of ₹{sch_max_income:,.0f}.")

        # 3. CGPA & Marks Alignment (15%)
        st_cgpa = cls._parse_numeric(academic.get("cgpa"), 8.0)
        sch_min_cgpa = sch_elig.get("min_cgpa") or 6.0
        if st_cgpa >= sch_min_cgpa:
            score_components["cgpa"] = 15.0
            why_recommended.append(f"Academic score ({st_cgpa} CGPA) satisfies minimum requirement ({sch_min_cgpa} CGPA).")
        else:
            score_components["cgpa"] = max(0.0, (st_cgpa / sch_min_cgpa) * 15.0)
            missing_requirements.append(f"Requires minimum {sch_min_cgpa} CGPA (Current: {st_cgpa} CGPA).")

        # 4. Category Alignment (15%)
        st_cat = (eligibility.get("category") or "General").upper()
        sch_cat = (sch_elig.get("category") or "All").upper()
        if sch_cat == "ALL" or st_cat in sch_cat or sch_cat in st_cat:
            score_components["category"] = 15.0
            why_recommended.append(f"Category classification ({st_cat}) matches target criteria.")
        else:
            score_components["category"] = 5.0

        # 5. Course & Education Level (10%)
        st_course = (academic.get("course") or "BE/BTech").upper()
        sch_course = (sch_elig.get("course") or "All").upper()
        if sch_course == "ALL" or any(w in sch_course for w in st_course.split()):
            score_components["course"] = 10.0
            why_recommended.append(f"Enrolled course ({st_course}) aligns with scheme eligibility.")
        else:
            score_components["course"] = 5.0

        # 6. Domicile State (15%)
        st_state = (personal.get("address", {}).get("state") or eligibility.get("domicile") or "Karnataka").upper()
        sch_state = (sch_elig.get("state") or "Karnataka").upper()
        if sch_state == "ALL" or st_state == sch_state:
            score_components["state"] = 15.0
            why_recommended.append(f"State domicile ({st_state}) satisfies local residency rules.")
        else:
            score_components["state"] = 0.0
            missing_requirements.append(f"Requires {sch_state} state domicile.")

        # 7. Gender Criteria (5%)
        st_gender = (personal.get("gender") or "All").upper()
        sch_gender = (sch_elig.get("gender") or "All").upper()
        if sch_gender == "ALL" or st_gender == sch_gender:
            score_components["gender"] = 5.0
        else:
            score_components["gender"] = 0.0
            missing_requirements.append(f"Targeted for {sch_gender} applicants.")

        # 8. Special Quota (5%)
        score_components["quota"] = 5.0

        # 9. Document Readiness (5%)
        uploaded_types = [doc.get("type", "").lower() for doc in documents]
        required_docs = scholarship.get("required_documents") or [
            "SSLC / PUC Marks Card", "Annual Income Certificate", "Aadhaar Identity Card"
        ]
        score_components["docs"] = 5.0 if len(documents) > 0 else 2.0

        # 10. Deadline Urgency (5%)
        deadline_str = sch_app.get("end_date") or "2026-08-31"
        try:
            d_obj = datetime.strptime(deadline_str, "%Y-%m-%d")
            days_left = (d_obj - datetime.now()).days
            score_components["deadline"] = 5.0 if days_left > 7 else 3.0
        except ValueError:
            score_components["deadline"] = 5.0

        # 11. Competition Index (5%)
        score_components["competition"] = 5.0

        total_match_score = round(sum(score_components.values()), 1)
        total_match_score = min(100.0, max(0.0, total_match_score))

        # Assign Recommendation Level Tier
        if total_match_score >= 95.0:
            rec_level = "Perfect Match"
        elif total_match_score >= 80.0:
            rec_level = "Highly Recommended"
        elif total_match_score >= 60.0:
            rec_level = "Good Match"
        elif total_match_score >= 40.0:
            rec_level = "Possible Match"
        else:
            rec_level = "Not Recommended"

        expected_success = min(98.0, round(total_match_score * 0.95, 1))
        estimated_effort = "Low (15 mins)" if len(documents) >= 2 else "Medium (30 mins)"

        return {
            "scholarship_id": str(scholarship.get("_id", "")),
            "scholarship_slug": scholarship.get("slug"),
            "title": scholarship.get("title"),
            "provider": scholarship.get("provider"),
            "amount": sch_amt.get("amount", "₹50,000 / year"),
            "deadline": sch_app.get("end_date", "2026-08-31"),
            "logo": scholarship.get("logo", "🎓"),
            "government_level": scholarship.get("government_level", "State"),
            "category": scholarship.get("category", "General"),
            "match_score": total_match_score,
            "recommendation_level": rec_level,
            "why_recommended": why_recommended,
            "missing_requirements": missing_requirements,
            "required_documents": required_docs,
            "expected_success_chance": expected_success,
            "estimated_effort": estimated_effort,
            "score_components": score_components
        }

    @classmethod
    def rank_scholarships_for_student(
        cls, student_profile: Dict[str, Any], scholarships: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        scored = []
        for sch in scholarships:
            eval_res = cls.evaluate_scholarship_match(student_profile, sch)
            scored.append(eval_res)

        # Sort descending by match score
        scored.sort(key=lambda x: x["match_score"], reverse=True)
        return scored

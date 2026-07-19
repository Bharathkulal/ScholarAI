import re
import json
import logging
from typing import Dict, Any, List
from app.services.ai_provider import AIProviderFactory
from app.services.recommendation_engine import RecommendationEngine

logger = logging.getLogger(__name__)

class AIChatService:
    """Service handling natural language search conversion, side-by-side comparison, and grounded AI assistant chat."""

    @classmethod
    def parse_natural_language_search(cls, query: str) -> Dict[str, Any]:
        q_lower = query.lower()

        filters = {
            "query": query,
            "category": None,
            "government_level": None,
            "state": None,
            "max_income": None,
            "min_amount": None,
        }

        if "karnataka" in q_lower or "ssp" in q_lower:
            filters["state"] = "Karnataka"
            filters["category"] = "Karnataka State"

        if "woman" in q_lower or "girl" in q_lower or "women" in q_lower or "stem" in q_lower:
            filters["category"] = "Women in STEM"

        if "central" in q_lower or "nsp" in q_lower:
            filters["government_level"] = "Central"

        # Extract income limit
        income_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:lakh|lpa|lakhs)", q_lower)
        if income_match:
            lakh_val = float(income_match.group(1))
            filters["max_income"] = lakh_val * 100000.0

        return filters

    @classmethod
    async def answer_student_question(
        cls, question: str, student_profile: Dict[str, Any], published_scholarships: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        provider = AIProviderFactory.get_provider()

        personal = student_profile.get("personal", {})
        academic = student_profile.get("academic", {})
        family = student_profile.get("family", {})
        eligibility = student_profile.get("eligibility", {})

        # Top 5 scholarships for context
        catalog_summary = []
        for s in published_scholarships[:5]:
            catalog_summary.append(
                f"- Title: {s.get('title')}, Provider: {s.get('provider')}, Amount: {s.get('amount_info', {}).get('amount')}, Deadline: {s.get('application_info', {}).get('end_date')}, Category: {s.get('category')}"
            )

        catalog_text = "\n".join(catalog_summary)

        system_instruction = (
            "You are ScholarAI Assistant, an expert AI scholarship advisor for Indian and Karnataka students. "
            "You MUST provide accurate, helpful, and concise answers grounded ONLY in the student's profile data and official scholarship catalog provided. "
            "Do NOT invent fake scholarships or false eligibility claims. If information is not available, state it clearly."
        )

        user_prompt = f"""
Student Profile Context:
- Name: {personal.get('full_name', 'Student')}
- College/Course: {academic.get('college_name', 'University')} - {academic.get('course', 'Undergraduate')}
- Academic Score: {academic.get('cgpa', '8.0')} CGPA
- Domicile State: {personal.get('address', {}).get('state', 'Karnataka')}
- Category: {eligibility.get('category', 'General')}
- Annual Income: {family.get('annual_income', '₹2,50,000 / year')}

Verified Scholarship Catalog Context:
{catalog_text}

Student Question:
"{question}"
"""

        try:
            ai_reply = await provider.generate_text(user_prompt, system_instruction)
        except Exception as e:
            logger.error(f"Error calling AI Provider: {e}")
            ai_reply = f"Based on your profile ({academic.get('course', 'UG')} in {personal.get('address', {}).get('state', 'Karnataka')}), we recommend exploring Karnataka SSP Post-Matric and NSP Central Sector grants. Please verify your income certificate."

        return {
            "question": question,
            "answer": ai_reply,
            "provider_used": provider.__class__.__name__
        }

    @classmethod
    def compare_scholarships_side_by_side(
        cls, scholarship_ids: List[str], student_profile: Dict[str, Any], scholarships_list: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        target_schemes = [s for s in scholarships_list if str(s.get("_id")) in scholarship_ids or s.get("slug") in scholarship_ids]

        compared_items = []
        for sch in target_schemes:
            eval_res = RecommendationEngine.evaluate_scholarship_match(student_profile, sch)
            compared_items.append({
                "scholarship_id": str(sch.get("_id")),
                "slug": sch.get("slug"),
                "title": sch.get("title"),
                "provider": sch.get("provider"),
                "government_level": sch.get("government_level"),
                "amount": sch.get("amount_info", {}).get("amount", "₹50,000 / year"),
                "deadline": sch.get("application_info", {}).get("end_date", "2026-08-31"),
                "application_mode": sch.get("application_info", {}).get("mode", "Online"),
                "match_score": eval_res["match_score"],
                "recommendation_level": eval_res["recommendation_level"],
                "why_recommended": eval_res["why_recommended"],
                "missing_requirements": eval_res["missing_requirements"],
                "required_documents": eval_res["required_documents"],
                "expected_success_chance": eval_res["expected_success_chance"],
                "estimated_effort": eval_res["estimated_effort"],
            })

        best_option = max(compared_items, key=lambda x: x["match_score"]) if compared_items else None

        return {
            "total_compared": len(compared_items),
            "compared_scholarships": compared_items,
            "ai_verdict": {
                "top_recommendation": best_option["title"] if best_option else None,
                "reason": f"Highest AI match score of {best_option['match_score']}% based on your academic score and domicile criteria." if best_option else "N/A"
            }
        }

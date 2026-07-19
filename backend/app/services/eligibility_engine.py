import re
from typing import Dict, Any, List

class EligibilityEngine:
    """Service for evaluating student eligibility against scholarship benchmarks."""

    @staticmethod
    def _parse_income(income_str: Any) -> float:
        """Parses numeric income from string (e.g., '₹2,40,000 / year' -> 240000.0)."""
        if not income_str:
            return 0.0
        cleaned = re.sub(r"[^\d.]", "", str(income_str))
        try:
            return float(cleaned) if cleaned else 0.0
        except ValueError:
            return 0.0

    @staticmethod
    def _parse_cgpa_percentage(cgpa_str: Any) -> float:
        """Parses CGPA or Percentage to a normalized percentage value (e.g., 9.2 -> 92.0 or 85.0% -> 85.0)."""
        if not cgpa_str:
            return 0.0
        cleaned = re.sub(r"[^\d.]", "", str(cgpa_str))
        try:
            val = float(cleaned) if cleaned else 0.0
            if val <= 10.0:
                return val * 10.0  # Convert CGPA out of 10 to percentage
            return val
        except ValueError:
            return 0.0

    @classmethod
    def evaluate_eligibility(cls, user_doc: Dict[str, Any]) -> Dict[str, Any]:
        personal = user_doc.get("personal", {})
        academic = user_doc.get("academic", {})
        family = user_doc.get("family", {})
        eligibility = user_doc.get("eligibility", {})
        documents = user_doc.get("documents", [])

        state = (
            eligibility.get("state")
            or personal.get("address", {}).get("state")
            or user_doc.get("state")
            or ""
        )
        category = eligibility.get("category") or user_doc.get("category") or "General"
        
        income_val = cls._parse_income(
            family.get("annual_income") or user_doc.get("income")
        )
        academic_score = cls._parse_cgpa_percentage(
            academic.get("cgpa") or user_doc.get("cgpa") or user_doc.get("gpa") or academic.get("percentage")
        )

        matched_schemes = []
        reasons = []
        missing_fields = []
        required_documents = []

        # Check key missing fields
        if not state:
            missing_fields.append("State of Domicile")
        if not category:
            missing_fields.append("Category / Caste Classification")
        if income_val == 0.0:
            missing_fields.append("Annual Family Income")
        if academic_score == 0.0:
            missing_fields.append("Academic CGPA / Percentage Score")

        # Required documents check
        uploaded_doc_types = {d.get("type", "").lower() for d in documents if isinstance(d, dict)}
        if "aadhaar" not in uploaded_doc_types:
            required_documents.append("Aadhaar Identity Card")
        if "income" not in uploaded_doc_types:
            required_documents.append("Annual Income Certificate")
        if category in ["OBC", "SC", "ST", "EWS", "OBC (Cat-3A)", "Minority"] and "caste" not in uploaded_doc_types:
            required_documents.append("Caste & Category Certificate")
        if "marks_card" not in uploaded_doc_types:
            required_documents.append("Previous Semester Marks Card")

        # Rule 1: Karnataka State Scholarship Portal (SSP Post-Matric)
        if "karnataka" in state.lower():
            if category in ["OBC", "SC", "ST", "OBC (Cat-3A)", "Minority"] and (income_val <= 250000 or income_val == 0.0):
                matched_schemes.append("Karnataka State SSP Post-Matric Scholarship")
                reasons.append("Matches Karnataka Domicile & Income threshold (<= ₹2,50,000/year).")

        # Rule 2: National Scholarship Portal (NSP Central Sector Scheme)
        if academic_score >= 80.0:
            matched_schemes.append("NSP Central Sector Scheme for University Students")
            reasons.append("Matches High Academic Merit (>= 80% / 8.0 CGPA).")

        # Rule 3: Merit-cum-Means Scholarship for Professional Courses
        if academic_score >= 60.0 and (income_val <= 800000 or income_val == 0.0):
            matched_schemes.append("Merit-cum-Means Financial Assistance Grant")
            reasons.append("Qualifies for Merit-cum-Means criteria (>= 6.0 CGPA & Income <= ₹8,00,000/year).")

        # Rule 4: Post-Matric Minority Financial Assistance
        if category in ["Minority", "EWS"] and (income_val <= 300000 or income_val == 0.0):
            matched_schemes.append("Post-Matric Minority Financial Assistance Program")
            reasons.append("Eligible under Minority/EWS welfare guidelines.")

        # Determine overall match score & status
        match_score = 0
        if academic_score >= 60.0:
            match_score += 40
        elif academic_score > 0.0:
            match_score += 20

        if income_val > 0.0 and income_val <= 800000:
            match_score += 30

        if state and category:
            match_score += 20

        if len(uploaded_doc_types) >= 2:
            match_score += 10

        if match_score >= 75 and len(matched_schemes) >= 2:
            status = "Eligible"
        elif match_score >= 40:
            status = "Possibly Eligible"
        else:
            status = "Not Eligible"

        if not matched_schemes:
            reasons.append("Complete missing academic CGPA or income fields to unlock specific grant matches.")

        return {
            "status": status,
            "match_score": min(100, match_score),
            "matched_schemes": matched_schemes,
            "reasons": reasons,
            "missing_fields": missing_fields,
            "required_documents": required_documents
        }

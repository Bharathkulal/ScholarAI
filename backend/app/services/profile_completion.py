from typing import Dict, Any

class ProfileCompletionEngine:
    """Service for computing percentage completion across student profile modules."""

    @staticmethod
    def calculate_completion(user_doc: Dict[str, Any]) -> Dict[str, int]:
        personal_data = user_doc.get("personal", {})
        academic_data = user_doc.get("academic", {})
        family_data = user_doc.get("family", {})
        eligibility_data = user_doc.get("eligibility", {})
        documents_data = user_doc.get("documents", [])
        timeline_data = user_doc.get("timeline", [])
        skills_data = user_doc.get("skills", {})

        # Fallback to root level user attributes if personal is not yet nested
        full_name = personal_data.get("full_name") or user_doc.get("full_name")
        email = personal_data.get("email") or user_doc.get("email")
        phone = personal_data.get("phone") or user_doc.get("phone")
        gender = personal_data.get("gender") or user_doc.get("gender")
        dob = personal_data.get("dob") or user_doc.get("dob")
        
        address = personal_data.get("address", {})
        state = address.get("state") or personal_data.get("state") or user_doc.get("state")
        district = address.get("district") or personal_data.get("district") or user_doc.get("district")
        pin_code = address.get("pin_code")

        # 1. Personal Section (8 indicators)
        personal_fields = [full_name, email, phone, gender, dob, state, district, pin_code]
        personal_filled = sum(1 for f in personal_fields if f and str(f).strip())
        personal_score = min(100, int((personal_filled / 8) * 100))

        # 2. Academic Section (8 indicators)
        college = academic_data.get("college_name") or user_doc.get("college")
        university = academic_data.get("university")
        course = academic_data.get("course") or user_doc.get("course")
        semester = academic_data.get("semester") or user_doc.get("semester")
        cgpa = academic_data.get("cgpa") or user_doc.get("cgpa") or user_doc.get("gpa")
        sslc = academic_data.get("sslc_percentage")
        puc = academic_data.get("puc_percentage")
        grad_year = academic_data.get("expected_graduation")

        academic_fields = [college, university, course, semester, cgpa, sslc, puc, grad_year]
        academic_filled = sum(1 for f in academic_fields if f and str(f).strip())
        academic_score = min(100, int((academic_filled / 8) * 100))

        # 3. Family Section (5 indicators)
        father = family_data.get("father_name")
        mother = family_data.get("mother_name")
        occ = family_data.get("occupation")
        income = family_data.get("annual_income") or user_doc.get("income")
        bpl = family_data.get("bpl_status")

        family_fields = [father, mother, occ, income, bpl]
        family_filled = sum(1 for f in family_fields if f and str(f).strip())
        family_score = min(100, int((family_filled / 5) * 100))

        # 4. Eligibility Section (5 indicators)
        cat = eligibility_data.get("category") or user_doc.get("category")
        religion = eligibility_data.get("religion")
        el_state = eligibility_data.get("state") or user_doc.get("state")
        domicile = eligibility_data.get("domicile") or user_doc.get("state")
        hostel = eligibility_data.get("hosteller_day_scholar")

        eligibility_fields = [cat, religion, el_state, domicile, hostel]
        eligibility_filled = sum(1 for f in eligibility_fields if f and str(f).strip())
        eligibility_score = min(100, int((eligibility_filled / 5) * 100))

        # 5. Documents Section (Target 4 core documents: Aadhaar, Income, Caste/Domicile, Marks Card)
        doc_count = len(documents_data) if isinstance(documents_data, list) else 0
        documents_score = min(100, int((doc_count / 4) * 100))

        # 6. Timeline Section (Target 2 history items: SSLC & PUC/UG)
        timeline_count = len(timeline_data) if isinstance(timeline_data, list) else 0
        timeline_score = min(100, int((timeline_count / 2) * 100))

        # 7. Skills Section (Count skills, languages, achievements)
        prog = skills_data.get("programming_skills", [])
        langs = skills_data.get("languages", [])
        ach = skills_data.get("achievements", [])
        skills_count = len(prog) + len(langs) + len(ach)
        skills_score = min(100, int((skills_count / 3) * 100))

        # Weighted Overall Score
        overall = int(
            (personal_score * 0.20) +
            (academic_score * 0.20) +
            (family_score * 0.15) +
            (eligibility_score * 0.20) +
            (documents_score * 0.15) +
            (timeline_score * 0.05) +
            (skills_score * 0.05)
        )

        return {
            "personal": personal_score,
            "academic": academic_score,
            "family": family_score,
            "eligibility": eligibility_score,
            "documents": documents_score,
            "timeline": timeline_score,
            "skills": skills_score,
            "overall": overall
        }

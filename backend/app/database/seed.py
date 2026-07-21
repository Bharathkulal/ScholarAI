import logging
from datetime import datetime, timezone
from typing import List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from app.core.security import get_password_hash
from app.repositories.user import UserRepository

logger = logging.getLogger(__name__)

DEMO_STUDENT_EMAIL = settings.DEFAULT_DEMO_STUDENT_EMAIL
DEMO_STUDENT_PASSWORD = settings.DEFAULT_DEMO_STUDENT_PASSWORD
DEMO_STUDENT_NAME = settings.DEFAULT_DEMO_STUDENT_NAME


SAMPLE_SCHOLARSHIPS: List[Dict[str, Any]] = [
    {
        "title": "National Merit Scholarship 2026",
        "slug": "national-merit-scholarship-2026",
        "provider": "Government of India",
        "organization": "Ministry of Education",
        "government_level": "Central",
        "category": "Merit Based",
        "description": "The National Merit Scholarship 2026 awards financial assistance to high-achieving students across India to pursue higher education in recognized institutions.",
        "short_description": "₹50,000 annual merit grant for top academic performers across India.",
        "banner_image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
        "official_website": "https://scholarships.gov.in",
        "official_apply_url": "https://scholarships.gov.in/apply",
        "contact_email": "helpdesk-nsp@gov.in",
        "contact_phone": "+91-11-24308000",
        "amount_info": {
            "amount": "₹50,000 / year",
            "numeric_amount": 50000.0,
            "currency": "INR",
            "frequency": "Yearly",
            "renewable": True,
            "benefits_description": "Covers tuition fees, academic books, and living allowance."
        },
        "eligibility_criteria": {
            "state": "All",
            "nationality": "Indian",
            "gender": "All",
            "education_level": "UG",
            "min_percentage": 85.0,
            "min_cgpa": 8.5,
            "max_income": 800000.0,
        },
        "required_documents": [
            "Class 12 / Degree Marks Sheet",
            "Annual Family Income Certificate",
            "Aadhaar Identity Card",
            "College Bonafide Certificate"
        ],
        "application_info": {
            "mode": "Online",
            "start_date": "2026-01-01",
            "end_date": "2027-03-31",
            "official_apply_url": "https://scholarships.gov.in",
            "steps": [
                "Register on National Scholarship Portal (NSP)",
                "Complete student verification",
                "Upload required marksheets & income proof",
                "Submit application before 31st March 2027"
            ]
        },
        "status": "published",
        "featured": True,
        "available_seats": 1000,
        "academic_year": "2026-2027"
    },
    {
        "title": "Karnataka Vidyasiri Scholarship",
        "slug": "karnataka-vidyasiri-scholarship-2027",
        "provider": "Government of Karnataka",
        "organization": "Department of Backward Classes Welfare",
        "government_level": "State",
        "category": "State Scholarship",
        "description": "Vidyasiri (Food & Accommodation Subsidy Scheme) offers financial relief to students from backward classes studying in post-matric courses in Karnataka.",
        "short_description": "₹25,000 yearly stipend for Karnataka post-matric backward class students.",
        "banner_image": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
        "official_website": "https://ssp.postmatric.karnataka.gov.in",
        "official_apply_url": "https://ssp.postmatric.karnataka.gov.in",
        "contact_email": "bcwd.helpdesk@karnataka.gov.in",
        "contact_phone": "+91-80-22373737",
        "amount_info": {
            "amount": "₹25,000 / year",
            "numeric_amount": 25000.0,
            "currency": "INR",
            "frequency": "Yearly",
            "renewable": True,
            "benefits_description": "₹1,500 monthly stipend for food and hostel accommodation."
        },
        "eligibility_criteria": {
            "state": "Karnataka",
            "domicile": "Karnataka",
            "nationality": "Indian",
            "category": "OBC",
            "gender": "All",
            "min_percentage": 60.0,
            "max_income": 250000.0,
        },
        "required_documents": [
            "SSLC / PUC Marks Card",
            "Caste & Income Certificate (Kutumba ID)",
            "Aadhaar Identity Card",
            "Bank Passbook linked with Aadhaar"
        ],
        "application_info": {
            "mode": "Online",
            "start_date": "2026-01-15",
            "end_date": "2027-02-15",
            "official_apply_url": "https://ssp.postmatric.karnataka.gov.in",
            "steps": [
                "Login to State Scholarship Portal (SSP Karnataka)",
                "E-verify Caste & Income certificates via Kutumba",
                "Submit fee receipt and hostel details"
            ]
        },
        "status": "published",
        "featured": True,
        "available_seats": 5000,
        "academic_year": "2026-2027"
    },
    {
        "title": "Post Matric Scholarship",
        "slug": "post-matric-scholarship-2027",
        "provider": "Government of India",
        "organization": "Ministry of Social Justice and Empowerment",
        "government_level": "Central",
        "category": "SC/ST/OBC",
        "description": "Comprehensive post-matric scholarship scheme to support students belonging to SC/ST/OBC categories pursuing post-secondary education.",
        "short_description": "₹40,000 assistance for post-secondary SC/ST/OBC scholars.",
        "banner_image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
        "official_website": "https://scholarships.gov.in",
        "official_apply_url": "https://scholarships.gov.in",
        "contact_email": "postmatric-support@gov.in",
        "contact_phone": "1800-11-2001",
        "amount_info": {
            "amount": "₹40,000 / year",
            "numeric_amount": 40000.0,
            "currency": "INR",
            "frequency": "Yearly",
            "renewable": True,
            "benefits_description": "Full compulsory non-refundable course fees reimbursement + maintenance allowance."
        },
        "eligibility_criteria": {
            "state": "All",
            "nationality": "Indian",
            "category": "SC/ST/OBC",
            "gender": "All",
            "max_income": 300000.0,
        },
        "required_documents": [
            "Caste Certificate issued by competent authority",
            "Income Certificate",
            "Previous Year Qualifying Marksheet",
            "Aadhaar Card"
        ],
        "application_info": {
            "mode": "Online",
            "start_date": "2026-02-01",
            "end_date": "2027-04-10",
            "official_apply_url": "https://scholarships.gov.in",
            "steps": [
                "Apply online via NSP portal",
                "Verification by Institute Nodal Officer",
                "Direct Benefit Transfer (DBT) into bank account"
            ]
        },
        "status": "published",
        "featured": True,
        "available_seats": 2500,
        "academic_year": "2026-2027"
    },
    {
        "title": "AICTE Pragati Scholarship",
        "slug": "aicte-pragati-scholarship-2026",
        "provider": "AICTE / Ministry of Education",
        "organization": "All India Council for Technical Education",
        "government_level": "Central",
        "category": "Female Empowerment",
        "description": "AICTE Pragati Scheme provides encouragement and financial assistance to young women pursuing technical degree or diploma programs in approved institutions.",
        "short_description": "₹50,000 per annum dedicated grant for female engineering & diploma students.",
        "banner_image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
        "official_website": "https://www.aicte-india.org",
        "official_apply_url": "https://scholarships.gov.in",
        "contact_email": "pragati@aicte-india.org",
        "contact_phone": "011-29581000",
        "amount_info": {
            "amount": "₹50,000 / year",
            "numeric_amount": 50000.0,
            "currency": "INR",
            "frequency": "Yearly",
            "renewable": True,
            "benefits_description": "₹50,000 per annum towards college fee, computer purchase, stationery, equipment, and books."
        },
        "eligibility_criteria": {
            "state": "All",
            "gender": "Female",
            "course": "B.Tech",
            "education_level": "UG",
            "max_income": 800000.0,
        },
        "required_documents": [
            "Class 10 & 12 Marksheet",
            "Family Income Certificate",
            "Admission Letter for Technical Degree/Diploma",
            "Bank Account Passbook (Single Account in Female Scholar Name)"
        ],
        "application_info": {
            "mode": "Online",
            "start_date": "2026-01-10",
            "end_date": "2027-01-31",
            "official_apply_url": "https://scholarships.gov.in",
            "steps": [
                "Submit application on National Scholarship Portal",
                "Institute e-verification of admission and gender status",
                "Selection based on merit in qualifying examination"
            ]
        },
        "status": "published",
        "featured": True,
        "available_seats": 5000,
        "academic_year": "2026-2027"
    },
    {
        "title": "AICTE Saksham Scholarship",
        "slug": "aicte-saksham-scholarship-2026",
        "provider": "AICTE / Ministry of Education",
        "organization": "All India Council for Technical Education",
        "government_level": "Central",
        "category": "Special Needs",
        "description": "Financial support for specially-abled students who wish to pursue technical degree or diploma courses in recognized technical institutions.",
        "short_description": "₹50,000 yearly grant for specially-abled technical scholars.",
        "banner_image": "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
        "official_website": "https://www.aicte-india.org",
        "official_apply_url": "https://scholarships.gov.in",
        "contact_email": "saksham@aicte-india.org",
        "contact_phone": "011-29581000",
        "amount_info": {
            "amount": "₹50,000 / year",
            "numeric_amount": 50000.0,
            "currency": "INR",
            "frequency": "Yearly",
            "renewable": True,
            "benefits_description": "₹50,000 per annum towards tuition fee, books, assistive devices, and software."
        },
        "eligibility_criteria": {
            "state": "All",
            "disability": "Yes",
            "gender": "All",
            "max_income": 800000.0,
        },
        "required_documents": [
            "Disability Certificate (minimum 40% disability)",
            "Class 10 & 12 Marksheet",
            "Annual Family Income Certificate",
            "Aadhaar Identity Card"
        ],
        "application_info": {
            "mode": "Online",
            "start_date": "2026-01-10",
            "end_date": "2027-02-28",
            "official_apply_url": "https://scholarships.gov.in",
            "steps": [
                "Register on National Scholarship Portal",
                "Upload UDID / Disability Certificate",
                "Institutional verification & approval"
            ]
        },
        "status": "published",
        "featured": False,
        "available_seats": 1000,
        "academic_year": "2026-2027"
    },
    {
        "title": "INSPIRE Scholarship",
        "slug": "inspire-scholarship-2026",
        "provider": "Department of Science & Technology (DST)",
        "organization": "Ministry of Science and Technology",
        "government_level": "Central",
        "category": "Science & Research",
        "description": "Innovation in Science Pursuit for Inspired Research (INSPIRE) offers scholarships for Higher Education (SHE) to talented young students pursuing basic & natural sciences.",
        "short_description": "₹80,000 per annum fellowship for top science & research students.",
        "banner_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
        "official_website": "https://online-inspire.gov.in",
        "official_apply_url": "https://online-inspire.gov.in",
        "contact_email": "inspire.prog-dst@nic.in",
        "contact_phone": "0124-6690020",
        "amount_info": {
            "amount": "₹80,000 / year",
            "numeric_amount": 80000.0,
            "currency": "INR",
            "frequency": "Yearly",
            "renewable": True,
            "benefits_description": "₹60,000 annual cash scholarship + ₹20,000 mentorship grant for research projects."
        },
        "eligibility_criteria": {
            "state": "All",
            "gender": "All",
            "min_percentage": 90.0,
            "min_cgpa": 9.0,
            "course": "B.Sc",
            "education_level": "UG",
        },
        "required_documents": [
            "Class 12 Board Marksheet (Top 1% Rank Proof)",
            "College Admission Offer Letter (B.Sc / M.Sc Natural Sciences)",
            "Endorsement Certificate signed by College Principal"
        ],
        "application_info": {
            "mode": "Online",
            "start_date": "2026-02-01",
            "end_date": "2027-03-15",
            "official_apply_url": "https://online-inspire.gov.in",
            "steps": [
                "Submit application on DST INSPIRE web portal",
                "Attach Class 12 rank certificate & college admission proof",
                "Selection by DST Expert Committee"
            ]
        },
        "status": "published",
        "featured": True,
        "available_seats": 10000,
        "academic_year": "2026-2027"
    },
    {
        "title": "Central Sector Scholarship",
        "slug": "central-sector-scholarship-2026",
        "provider": "Ministry of Education, Govt of India",
        "organization": "Department of Higher Education",
        "government_level": "Central",
        "category": "Academic Excellence",
        "description": "Central Sector Scheme of Scholarship for College and University Students to provide financial assistance to meritorious students from low income families.",
        "short_description": "₹20,000 annual support for top 80th percentile academic performers.",
        "banner_image": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop",
        "official_website": "https://scholarships.gov.in",
        "official_apply_url": "https://scholarships.gov.in",
        "contact_email": "csee-edu@gov.in",
        "contact_phone": "1800-11-8002",
        "amount_info": {
            "amount": "₹20,000 / year",
            "numeric_amount": 20000.0,
            "currency": "INR",
            "frequency": "Yearly",
            "renewable": True,
            "benefits_description": "₹12,000/year for first 3 years of graduation and ₹20,000/year at post-graduation level."
        },
        "eligibility_criteria": {
            "state": "All",
            "gender": "All",
            "min_percentage": 80.0,
            "max_income": 450000.0,
        },
        "required_documents": [
            "Class 12 Marksheet with percentile score",
            "Annual Family Income Certificate",
            "Aadhaar Seeded Bank Account Details"
        ],
        "application_info": {
            "mode": "Online",
            "start_date": "2026-01-20",
            "end_date": "2027-03-01",
            "official_apply_url": "https://scholarships.gov.in",
            "steps": [
                "Apply via NSP Portal under Central Sector Scheme",
                "Verification by State Education Board and College",
                "DBT payment directly to student bank account"
            ]
        },
        "status": "published",
        "featured": False,
        "available_seats": 82000,
        "academic_year": "2026-2027"
    },
    {
        "title": "Minority Scholarship",
        "slug": "minority-scholarship-2026",
        "provider": "Ministry of Minority Affairs",
        "organization": "Government of India",
        "government_level": "Central",
        "category": "Minority Communities",
        "description": "Post-Matric and Merit-cum-Means Scholarship for Students Belonging to Minority Communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).",
        "short_description": "₹30,000 per year grant for eligible minority community scholars.",
        "banner_image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
        "official_website": "https://minorityaffairs.gov.in",
        "official_apply_url": "https://scholarships.gov.in",
        "contact_email": "helpdesk-minority@gov.in",
        "contact_phone": "1800-11-2001",
        "amount_info": {
            "amount": "₹30,000 / year",
            "numeric_amount": 30000.0,
            "currency": "INR",
            "frequency": "Yearly",
            "renewable": True,
            "benefits_description": "Full course fee reimbursement up to ₹20,000 + maintenance allowance of ₹1,000/month."
        },
        "eligibility_criteria": {
            "state": "All",
            "minority": "Yes",
            "gender": "All",
            "min_percentage": 50.0,
            "max_income": 250000.0,
        },
        "required_documents": [
            "Self-declaration of Minority Community Status",
            "Income Certificate",
            "Previous Exam Marksheet (Minimum 50% Marks)",
            "Aadhaar Identity Card"
        ],
        "application_info": {
            "mode": "Online",
            "start_date": "2026-01-05",
            "end_date": "2027-02-20",
            "official_apply_url": "https://scholarships.gov.in",
            "steps": [
                "Fill online NSP application under Ministry of Minority Affairs",
                "Upload Minority Self Declaration & Marksheet",
                "Institute e-verification"
            ]
        },
        "status": "published",
        "featured": False,
        "available_seats": 3000,
        "academic_year": "2026-2027"
    },
    {
        "title": "Digital India Scholarship",
        "slug": "digital-india-scholarship-2026",
        "provider": "MeitY & Digital India Corporation",
        "organization": "Ministry of Electronics & IT",
        "government_level": "Central",
        "category": "Computer Science & IT",
        "description": "Fostering digital talent by supporting students enrolled in Computer Science, Artificial Intelligence, Data Science, and IT engineering degree programs.",
        "short_description": "₹60,000 tech fellowship for Computer Science & IT students.",
        "banner_image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
        "official_website": "https://digitalindia.gov.in",
        "official_apply_url": "https://digitalindia.gov.in/scholarships",
        "contact_email": "scholarships@digitalindia.gov.in",
        "contact_phone": "+91-11-24301000",
        "amount_info": {
            "amount": "₹60,000 / year",
            "numeric_amount": 60000.0,
            "currency": "INR",
            "frequency": "Yearly",
            "renewable": True,
            "benefits_description": "₹60,000 annual laptop & learning grant plus access to Digital India innovation workshops."
        },
        "eligibility_criteria": {
            "state": "All",
            "course": "B.Tech",
            "gender": "All",
            "min_cgpa": 7.5,
            "min_percentage": 75.0,
            "max_income": 600000.0,
        },
        "required_documents": [
            "College ID Card & Admission Receipt",
            "Current Semester Marksheet (Min 7.5 CGPA)",
            "Project Portfolio or GitHub Profile Summary",
            "Income Certificate"
        ],
        "application_info": {
            "mode": "Online",
            "start_date": "2026-02-15",
            "end_date": "2027-04-30",
            "official_apply_url": "https://digitalindia.gov.in/scholarships",
            "steps": [
                "Register on Digital India portal",
                "Submit project summary or coding portfolio",
                "Online technical assessment and document review"
            ]
        },
        "status": "published",
        "featured": True,
        "available_seats": 2000,
        "academic_year": "2026-2027"
    },
    {
        "title": "Future Innovators Scholarship",
        "slug": "future-innovators-scholarship-2026",
        "provider": "National Innovation Foundation & Industry Partners",
        "organization": "National Innovation Foundation (NIF)",
        "government_level": "Private",
        "category": "Engineering & Technology",
        "description": "Prestige scholarship rewarding engineering & technology students demonstrating high potential in hardware/software product innovation and research.",
        "short_description": "₹1,00,000 innovation grant for outstanding engineering scholars.",
        "banner_image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
        "official_website": "https://nif.org.in",
        "official_apply_url": "https://nif.org.in/future-innovators",
        "contact_email": "innovators@nif.org.in",
        "contact_phone": "+91-79-26732091",
        "amount_info": {
            "amount": "₹1,00,000 / year",
            "numeric_amount": 100000.0,
            "currency": "INR",
            "frequency": "Yearly",
            "renewable": True,
            "benefits_description": "₹1,00,000 cash grant + NIF Incubation Mentorship for prototype development."
        },
        "eligibility_criteria": {
            "state": "All",
            "course": "B.Tech",
            "gender": "All",
            "min_cgpa": 8.0,
            "min_percentage": 80.0,
        },
        "required_documents": [
            "Innovation Proposal / Technical Abstract",
            "Faculty Recommendation Letter",
            "Transcript of Grades",
            "Aadhaar Identity Proof"
        ],
        "application_info": {
            "mode": "Online",
            "start_date": "2026-03-01",
            "end_date": "2027-05-15",
            "official_apply_url": "https://nif.org.in/future-innovators",
            "steps": [
                "Submit project proposal & abstract online",
                "Technical review by NIF Jury panel",
                "Shortlisted presentation and award ceremony"
            ]
        },
        "status": "published",
        "featured": True,
        "available_seats": 500,
        "academic_year": "2026-2027"
    }
]


async def seed_initial_roles_and_users(db: AsyncIOMotorDatabase) -> None:
    """
    Idempotent database seeder routine.
    Seeds default Super Admin, Admin, Demo Student, 10 Scholarships, Saved Scholarships,
    Application Records, and Notifications into MongoDB.
    """
    if db is None:
        logger.warning("Database connection is None. Skipping seed initialization.")
        return

    user_repo = UserRepository(db)

    # 1. Seed Super Admin
    super_admin_count = await user_repo.count({"role": "super_admin"})
    if super_admin_count == 0:
        legacy_count = await user_repo.count({"role": "superadmin"})
        if legacy_count > 0:
            logger.info("Migrating legacy 'superadmin' role documents to 'super_admin'...")
            await user_repo.collection.update_many(
                {"role": "superadmin"},
                {"$set": {"role": "super_admin"}}
            )
        else:
            logger.info(f"Creating default Super Admin: '{settings.DEFAULT_SUPER_ADMIN_EMAIL}'...")
            super_admin_data = {
                "full_name": "System Super Admin",
                "email": settings.DEFAULT_SUPER_ADMIN_EMAIL.strip().lower(),
                "password_hash": get_password_hash(settings.DEFAULT_SUPER_ADMIN_PASSWORD),
                "role": "super_admin",
                "is_email_verified": True,
                "is_active": True,
                "provider": "email",
                "phone": "+10000000000",
            }
            await user_repo.create_user(super_admin_data)

    # 2. Seed Default Admin
    admin_count = await user_repo.count({"role": "admin"})
    if admin_count == 0:
        logger.info(f"Creating default Admin: '{settings.DEFAULT_ADMIN_EMAIL}'...")
        admin_data = {
            "full_name": "ScholarAI Portal Admin",
            "email": settings.DEFAULT_ADMIN_EMAIL.strip().lower(),
            "password_hash": get_password_hash(settings.DEFAULT_ADMIN_PASSWORD),
            "role": "admin",
            "is_email_verified": True,
            "is_active": True,
            "provider": "email",
            "phone": "+10000000001",
        }
        await user_repo.create_user(admin_data)

    # 3. Seed Demo Student Account (100% Profile Completed)
    demo_user = await user_repo.get_by_email(DEMO_STUDENT_EMAIL)
    demo_user_id = None

    demo_student_payload = {
        "full_name": "Demo Student",
        "email": DEMO_STUDENT_EMAIL,
        "password_hash": get_password_hash(DEMO_STUDENT_PASSWORD),
        "role": "student",
        "provider": "email",
        "is_email_verified": True,
        "is_active": True,
        "profile_completion": 100,
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        "phone": "+91 9876543210",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "college": "BMS College of Engineering",
        "course": "B.Tech",
        "semester": "6th Semester",
        "cgpa": "9.2 CGPA",
        "gpa": "9.2 CGPA",
        "category": "OBC",
        "income": "₹2,50,000 / year",
        "gender": "Female",
        "dob": "2003-05-15",
        "religion": "Hindu",
        "personal": {
            "full_name": "Demo Student",
            "email": DEMO_STUDENT_EMAIL,
            "phone": "+91 9876543210",
            "gender": "Female",
            "dob": "2003-05-15",
            "category": "OBC",
            "religion": "Hindu",
            "state": "Karnataka",
            "district": "Bengaluru Urban"
        },
        "academic": {
            "education_level": "UG",
            "college": "BMS College of Engineering",
            "course": "B.Tech",
            "branch": "Computer Science & Engineering",
            "semester": "6th Semester",
            "cgpa": "9.2 CGPA",
            "percentage": "92%"
        },
        "family": {
            "father_name": "Ramesh Kumar",
            "father_occupation": "Private Sector",
            "annual_income": "₹2,50,000 / year",
            "income_numeric": 250000.0
        },
        "eligibility": {
            "karnataka_domicile": True,
            "differently_abled": False,
            "minority": False,
            "single_girl_child": True
        },
        "documents": [
            {"name": "SSLC Marks Card.pdf", "status": "verified", "uploaded_at": "2026-01-10T10:00:00Z"},
            {"name": "PUC Marks Card.pdf", "status": "verified", "uploaded_at": "2026-01-10T10:05:00Z"},
            {"name": "Income Certificate 2026.pdf", "status": "verified", "uploaded_at": "2026-01-11T12:00:00Z"},
            {"name": "Aadhaar Card Verified.pdf", "status": "verified", "uploaded_at": "2026-01-12T09:30:00Z"}
        ]
    }

    if not demo_user:
        logger.info(f"Creating Demo Student account: '{DEMO_STUDENT_EMAIL}'...")
        created_demo = await user_repo.create_user(demo_student_payload)
        demo_user_id = str(created_demo["_id"])
        logger.info(f"Demo Student account created successfully (ID: {demo_user_id}).")
    else:
        demo_user_id = str(demo_user["_id"])
        await user_repo.update_user(demo_user_id, demo_student_payload)
        logger.info(f"Demo Student account updated successfully (ID: {demo_user_id}).")

    # 4. Seed 10 Sample Scholarships
    scholarships_col = db.get_collection("scholarships")
    seeded_scholarships_map = {}

    for sch in SAMPLE_SCHOLARSHIPS:
        slug = sch["slug"]
        existing = await scholarships_col.find_one({"slug": slug})
        now = datetime.now(timezone.utc)
        sch["updated_at"] = now

        if not existing:
            sch["created_at"] = now
            sch["view_count"] = 125
            sch["saved_count"] = 42
            sch["application_count"] = 18
            res = await scholarships_col.insert_one(sch)
            seeded_scholarships_map[slug] = str(res.inserted_id)
        else:
            seeded_scholarships_map[slug] = str(existing["_id"])
            await scholarships_col.update_one({"slug": slug}, {"$set": sch})

    logger.info(f"Seeded/Updated {len(SAMPLE_SCHOLARSHIPS)} sample scholarships in MongoDB.")

    # 5. Seed Saved Scholarships for Demo Student
    saved_col = db.get_collection("saved_scholarships")
    saved_slugs = ["national-merit-scholarship-2026", "aicte-pragati-scholarship-2026"]
    
    for slug in saved_slugs:
        sch_id = seeded_scholarships_map.get(slug)
        if sch_id and demo_user_id:
            existing_saved = await saved_col.find_one({"student_id": demo_user_id, "scholarship_id": sch_id})
            if not existing_saved:
                sch_doc = await scholarships_col.find_one({"slug": slug})
                await saved_col.insert_one({
                    "student_id": demo_user_id,
                    "scholarship_id": sch_id,
                    "scholarship_slug": slug,
                    "scholarship_title": sch_doc.get("title") if sch_doc else slug,
                    "saved_at": datetime.now(timezone.utc)
                })

    # 6. Seed Application History across diverse statuses
    apps_col = db.get_collection("applications")
    sample_applications = [
        {
            "application_number": "APP-2026-8801",
            "scholarship_slug": "aicte-pragati-scholarship-2026",
            "scholarship_title": "AICTE Pragati Scholarship",
            "scholarship_provider": "AICTE / Ministry of Education",
            "status": "approved",
            "verification_status": "approved",
            "admin_comments": "All document verifications passed. Grant approved for disbursement.",
            "remarks": "Eligibility score 95%. Approved by Nodal Officer.",
            "application_history": [
                {"step": "Submitted", "status": "submitted", "timestamp": "2026-01-15T10:00:00Z", "by": "Student"},
                {"step": "Documents Verified", "status": "documents_verified", "timestamp": "2026-01-18T14:30:00Z", "by": "Admin"},
                {"step": "Under Review", "status": "under_review", "timestamp": "2026-01-20T11:15:00Z", "by": "Committee"},
                {"step": "Approved", "status": "approved", "timestamp": "2026-01-25T09:00:00Z", "by": "Super Admin"}
            ]
        },
        {
            "application_number": "APP-2026-8802",
            "scholarship_slug": "karnataka-vidyasiri-scholarship-2027",
            "scholarship_title": "Karnataka Vidyasiri Scholarship",
            "scholarship_provider": "Government of Karnataka",
            "status": "under_review",
            "verification_status": "pending",
            "admin_comments": "Kutumba verification complete. Pending final district welfare audit.",
            "remarks": "Under final review.",
            "application_history": [
                {"step": "Submitted", "status": "submitted", "timestamp": "2026-01-20T11:00:00Z", "by": "Student"},
                {"step": "Documents Verified", "status": "documents_verified", "timestamp": "2026-01-22T16:00:00Z", "by": "Admin"},
                {"step": "Under Review", "status": "under_review", "timestamp": "2026-01-24T10:00:00Z", "by": "District Auditor"}
            ]
        },
        {
            "application_number": "APP-2026-8803",
            "scholarship_slug": "national-merit-scholarship-2026",
            "scholarship_title": "National Merit Scholarship 2026",
            "scholarship_provider": "Government of India",
            "status": "submitted",
            "verification_status": "pending",
            "admin_comments": "Application received. Pending initial nodal verification.",
            "remarks": "Awaiting document audit.",
            "application_history": [
                {"step": "Submitted", "status": "submitted", "timestamp": "2026-02-01T09:30:00Z", "by": "Student"}
            ]
        },
        {
            "application_number": "APP-2026-8804",
            "scholarship_slug": "post-matric-scholarship-2027",
            "scholarship_title": "Post Matric Scholarship",
            "scholarship_provider": "Government of India",
            "status": "documents_verified",
            "verification_status": "verified",
            "admin_comments": "Caste & Income certificates verified against state repository.",
            "remarks": "Documents verified successfully.",
            "application_history": [
                {"step": "Submitted", "status": "submitted", "timestamp": "2026-02-05T14:20:00Z", "by": "Student"},
                {"step": "Documents Verified", "status": "documents_verified", "timestamp": "2026-02-10T12:00:00Z", "by": "Admin"}
            ]
        },
        {
            "application_number": "APP-2026-8805",
            "scholarship_slug": "central-sector-scholarship-2026",
            "scholarship_title": "Central Sector Scholarship",
            "scholarship_provider": "Ministry of Education, Govt of India",
            "status": "rejected",
            "verification_status": "rejected",
            "admin_comments": "Income certificate exceeds maximum threshold for Central Sector Scheme.",
            "remarks": "Income limit exceeded.",
            "application_history": [
                {"step": "Submitted", "status": "submitted", "timestamp": "2026-01-05T10:00:00Z", "by": "Student"},
                {"step": "Rejected", "status": "rejected", "timestamp": "2026-01-12T15:00:00Z", "by": "Admin"}
            ]
        }
    ]

    for app_data in sample_applications:
        app_num = app_data["application_number"]
        sch_id = seeded_scholarships_map.get(app_data["scholarship_slug"])
        existing_app = await apps_col.find_one({"application_number": app_num})
        
        now = datetime.now(timezone.utc)
        app_data["student_id"] = demo_user_id
        app_data["scholarship_id"] = sch_id or ""
        app_data["updated_at"] = now

        if not existing_app:
            app_data["created_at"] = now
            app_data["submitted_at"] = now
            await apps_col.insert_one(app_data)
        else:
            await apps_col.update_one({"application_number": app_num}, {"$set": app_data})

    logger.info(f"Seeded {len(sample_applications)} sample applications for Demo Student.")

    # 7. Seed Notifications for Demo Student
    notif_col = db.get_collection("notifications")
    sample_notifications = [
        {
            "user_id": demo_user_id,
            "title": "New AICTE Pragati Scholarship Added",
            "category": "System Announcement",
            "message": "AICTE Pragati Scholarship for female engineering scholars is now accepting applications.",
            "read": False,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": demo_user_id,
            "title": "Your Post Matric Application is Under Review",
            "category": "Application Status",
            "message": "Your Post Matric Scholarship (APP-2026-8804) documents have been verified and passed to committee audit.",
            "read": False,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": demo_user_id,
            "title": "Document Vault Verification Complete",
            "category": "Verification Status",
            "message": "Your Income Certificate 2026.pdf and SSLC Marks Card have been audited and verified.",
            "read": True,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": demo_user_id,
            "title": "Application Deadline Approaching",
            "category": "Deadline Warning",
            "message": "Karnataka Vidyasiri Scholarship deadline closes on 15 February 2027. Ensure your application details are complete.",
            "read": False,
            "created_at": datetime.now(timezone.utc)
        }
    ]

    for notif in sample_notifications:
        existing_notif = await notif_col.find_one({"user_id": demo_user_id, "title": notif["title"]})
        if not existing_notif:
            await notif_col.insert_one(notif)

    logger.info(f"Seeded {len(sample_notifications)} notification alerts for Demo Student.")
    logger.info("Comprehensive database seeding routine completed successfully.")


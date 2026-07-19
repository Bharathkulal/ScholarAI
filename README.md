# ScholarAI — AI-Powered Scholarship Discovery & Eligibility Platform

ScholarAI is an enterprise-grade, AI-powered scholarship discovery, eligibility auditing, and application tracking platform designed for Indian and Karnataka students. It connects students with state (SSP Karnataka), central (NSP), and corporate grant opportunities through automated eligibility matching, document verification, and grounded AI assistance.

---

## 🌟 Key Features

### 🎓 Student Portal
- **Smart Student Onboarding Wizard**: 8-step profile wizard covering Personal, Academic, Family Income, Eligibility, Uploaded Verification Documents, Education Timeline, and Skills.
- **Automated Profile Completion Engine**: Calculates weighted completion scores across 7 modules.
- **Rule-Based Eligibility Evaluation Engine**: Audits student CGPA, annual family income, state of domicile, and category against scholarship benchmark criteria.
- **Scholarship Explorer**: Search, advanced multi-criteria filters (Category, Government Level, Domicile State, Sort by Deadline/Amount), and Grid/List view toggles.
- **Scholarship Details View**: Hero banner, deadline countdown timer, eligibility checklist, required docs list, application steps, FAQs, and Official Apply CTA.
- **Multi-Step Application Submission Wizard**: 6-step wizard generating unique `APP-YYYY-XXXXX` receipts and freezing immutable profile snapshots.
- **Application Tracker**: Real-time submission tracking with progress bars, status filter tabs, audit timeline history, and withdrawal support.
- **Bookmarks & Saved Schemes**: Quick save and toggle for scholarship schemes.
- **Grounded AI Assistant Chatbot**: Context-aware AI assistant providing grounded advice based on real student profile data and verified catalog records.
- **AI Recommendation Engine**: 12-Criteria Weighted Machine Learning match score (0-100) with explainability details and side-by-side scheme comparison.

### 🛡️ Enterprise Admin Control Center
- **Real-Time Telemetry & Metrics**: Real MongoDB counts for Students, Published Grants, Active Applications, Approval Rates, and Pending Document Audits.
- **Scholarship Catalog Manager**: Data table with search, status filters, publish toggles, archive, CRUD modals, and CSV bulk import/export.
- **Student Applications Audit**: Inspect student applications, view frozen profile snapshots, approve/reject applications with verification officer remarks.
- **MongoDB Aggregation Analytics**: Distribution charts for Category, State Domicile, Application Status, and Income Brackets.
- **Targeted Broadcast Announcements**: System broadcast notification modal with target audience filters.
- **Operational Audit Logs Stream**: Live audit feed tracking student logins, admin reviews, and status changes.
- **Customizable Report Exporter**: Downloadable CSV and JSON report exports for students, scholarships, and applications.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 19, Vite 5
- **Styling**: TailwindCSS 3
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: Async Motor (MongoDB AsyncIO Driver)
- **Security**: PyJWT, Passlib (bcrypt), SecurityHeadersMiddleware, RateLimiterMiddleware (120 req/min)
- **Validation**: Pydantic v2, Pydantic-Settings
- **LLM Abstraction**: Google Gemini 1.5 Flash (Primary), OpenRouter (Secondary), Groq (Tertiary) with automatic fallback

---

## 📁 Repository Structure

```
ScholarAI/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # FastAPI Router Endpoints (Auth, Students, Scholarships, Applications, AI, Admin)
│   │   ├── core/            # Config, Security, JWT, Rate Limiter, Security Headers
│   │   ├── database/        # MongoDB Connection Manager & Indexes
│   │   ├── middleware/      # Error Handler & Request Logging
│   │   ├── repositories/    # Base & Collection Repositories (User, Scholarship, Application, Saved, Audit, Announcement)
│   │   ├── schemas/         # Pydantic v2 Models (Auth, Student, Scholarship, Application, Admin)
│   │   └── services/        # Business Logic (Storage, Eligibility, Completion, Recommendation, Advisor, Chat, Analytics)
│   ├── tests/               # Pytest Automated Integration & Unit Tests
│   ├── Dockerfile           # Multi-stage Python Production Container
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Common, UI, Profile, Applications, AI Components
│   │   ├── layouts/         # Student, Admin, Public, Auth Layouts
│   │   ├── pages/           # Home, Dashboard, Profile, Scholarships, ScholarshipDetails, Applications, Recommendations, AdminDashboard
│   │   ├── services/        # Axios API Service Modules (Auth, Student, Scholarships, Applications, AI, Admin)
│   │   └── App.jsx          # App Routes
│   ├── Dockerfile           # Multi-stage Nginx React Container
│   └── package.json
├── docker-compose.yml       # Production Compose File
└── README.md
```

---

## ⚡ Quick Start — Local Development

### 1. Prerequisites
- Node.js >= 20.x
- Python >= 3.11
- MongoDB >= 7.0 (running locally or MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend server will run at: `http://localhost:8000`  
Swagger API Docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend application will run at: `http://localhost:5173`

---

## 🐳 Running with Docker Compose

```bash
# Build and run all services (MongoDB, FastAPI Backend, React Frontend)
docker compose up --build -d

# View running status
docker compose ps

# Stop services
docker compose down
```
- Frontend: `http://localhost`
- Backend API: `http://localhost:8000`
- MongoDB: `localhost:27017`

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
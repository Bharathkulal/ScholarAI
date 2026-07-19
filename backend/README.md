# ScholarAI - Backend API Foundation

Discover. Qualify. Apply.

This repository contains the backend architecture of **ScholarAI**, an AI-powered Scholarship Discovery & Eligibility Platform. The project is built using Python 3.13+ and FastAPI, leveraging MongoDB (via Motor) for data storage.

---

## 🏗️ Backend Folder Structure

The project follows a clean, modular design pattern to ensure scalability as features develop:

```text
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── auth/           # Authentication endpoints (login, register, refresh)
│   │       ├── students/       # Student Portal routes (profile, recommendations, settings)
│   │       ├── admin/          # Admin Portal routes (dashboard, management, analytics)
│   │       ├── scholarships/   # Scholarship Discovery & search
│   │       ├── applications/   # Scholarship application tracking
│   │       ├── documents/      # Student document management (transcripts, letters)
│   │       ├── notifications/  # Notification services
│   │       ├── analytics/      # Analytical endpoints
│   │       └── ai/             # AI engines (eligibility, recommendations, chatbot)
│   │
│   ├── core/
│   │   ├── config.py           # Application settings via Pydantic-Settings
│   │   ├── logging.py          # Structured/JSON logging configurations
│   │   ├── security.py         # Password hashing, JWT token operations, and RBAC
│   │   └── constants.py        # System-wide roles and statuses constants
│   │
│   ├── database/
│   │   ├── mongodb.py          # Reusable Database Connection Manager using Motor
│   │   └── indexes.py          # Startup collection index creation configurations
│   │
│   ├── middleware/
│   │   └── request_logging.py  # Request metadata tracking middleware
│   │
│   ├── models/
│   │   └── base.py             # Custom PyObjectId and BaseMongoModel definitions
│   │
│   ├── repositories/
│   │   ├── base.py             # Generic repository with async CRUD implementations
│   │   ├── student.py          # Student database interactions
│   │   ├── scholarship.py      # Scholarship database interactions
│   │   └── application.py      # Application database interactions
│   │
│   ├── services/
│   │   ├── auth.py             # Authentication business logic orchestrator
│   │   ├── student.py          # Profile management business logic
│   │   ├── scholarship.py      # Scholarship query business logic
│   │   ├── application.py      # Application operations business logic
│   │   └── ai.py               # AI Recommendation and Eligibility logic
│   │
│   ├── utils/                  # Helper utilities
│   ├── uploads/                # Local directory for temporary file processing
│   ├── tests/                  # Unit and integration test suites
│   └── main.py                 # FastAPI application entry point
│
├── requirements.txt            # Python dependencies
├── .env.example                # Shell environment variables template
└── README.md                   # Project documentation
```

---

## 🛠️ Architecture Highlights

### 1. Separation of Concerns (Clean Architecture)
- **API Layer (`app/api`)**: Translates HTTP requests to business layer actions. Validates schemas.
- **Service Layer (`app/services`)**: Implements business rules and coordinates resource layers.
- **Repository Layer (`app/repositories`)**: Encapsulates raw database queries and database mapping.
- **Model Layer (`app/models`)**: Defines structured schemas for database persistence.

### 2. Robust Security Foundation
- Password hashing powered by **passlib** using the strong **bcrypt** scheme.
- Security tokens created with encrypted **JWT** tokens.
- Flexible Role-Based Access Control (RBAC) via the **RoleChecker** dependency.

### 3. Asynchronous Database Access
- Built on top of **Motor**, the async driver for MongoDB.
- Includes a reusable `DatabaseManager` providing connection lifecycle handlers during server startup/shutdown lifespan events.

### 4. Structured Logging & Middleware
- Automatically prints readable, detailed logs during local development, and switches to structured outputs for production.
- Custom `RequestLoggingMiddleware` prints request paths, return statuses, and processing durations in milliseconds.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.13+ installed.
- Local or Atlas MongoDB instance running.

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (Powershell)
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy environment template to configure your credentials:
   ```bash
   cp .env.example .env
   ```

### Running Server
Start the development server with:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 🔍 API Endpoints

Once the server is running, verify the following endpoints:
- **Base Branding Status**: `GET http://localhost:8000/`
- **Health Indicators**: `GET http://localhost:8000/health`
- **API Documentation**:
  - Swagger UI: `http://localhost:8000/docs`
  - ReDoc: `http://localhost:8000/redoc`

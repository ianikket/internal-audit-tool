# Internal Audit and Compliance Management Tool (IACMT)

A comprehensive solution for streamlining internal audit processes, automating control extraction, and managing compliance.

## Features

- Document Upload and Management
- AI-Powered Control Extraction
- Internal Audit Tracker
- Gap and Risk Assessment
- Jira Integration
- Audit Report Generation
- User Management and Permissions
- Dashboard and Analytics

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- AI/NLP: Google Cloud NLP
- Authentication: OAuth 2.0/SSO

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```
3. Set up environment variables (see .env.example files)
4. Start the development servers:
   ```bash
   # Start frontend
   cd frontend
   npm run dev

   # Start backend
   cd backend
   npm run dev
   ```

## How to Get Started

1. **Create a `.env` file in the `backend` directory.**
   - You can copy from `.env.example` if available:
     ```bash
     cp .env.example .env
     ```
2. **Add your OpenAI API key to the `.env` file:**
   ```env
   OPENAI_API_KEY=sk-...your-openai-api-key-here...
   ```
   - This key is required for AI-powered document analysis features.
   - You can obtain an API key from https://platform.openai.com/.
3. **Restart your backend server after editing the `.env` file.**

## Project Structure 

## Project Architecture & Workflow Overview (Detailed)

Purpose of the Tool
The tool is designed to streamline internal audit processes, automate the extraction of controls from documents using AI, manage compliance, and provide features like audit tracking, risk assessment, Jira integration, report generation, user management, and analytics.
How the Tool Works
1. Document Upload & AI-Powered Control Extraction
Users upload documents (PDF or Word) via the frontend.
The backend (document.routes.ts) handles file uploads using multer, saves them to the uploads/ directory, and extracts text using libraries like pdf-parse, mammoth, or textract.
The extracted text is sent to an AI service (ai.service.ts), which uses OpenAI’s API to analyze the document and return a JSON with a summary, controls, and risks.
The results are stored in the database as an Assessment.
2. Internal Audit Tracker & Assessment Management
Assessments (results of document analysis) are managed via the /api/assessments endpoints (assessment.routes.ts).
Users can list, view, edit, and delete assessments.
3. User Management & Permissions
User registration and login are handled via /api/auth endpoints (auth.routes.ts and auth.controller.ts).
Users have roles (admin, auditor, manager, viewer) defined in the User model.
4. Database
Uses PostgreSQL, with entities defined in models/Assessment.ts and models/User.ts.
The database stores users, assessments, and related data.
5. Frontend
Built with React + TypeScript (in frontend/), providing the user interface for all features.
6. AI/NLP
Uses OpenAI’s GPT model for document analysis (API key required in backend .env).
Key Files and Their Roles
backend/src/routes/document.routes.ts: Handles document upload, text extraction, AI analysis, and saving results as assessments.
backend/src/services/ai.service.ts: Sends extracted text to OpenAI and formats the response.
backend/src/routes/assessment.routes.ts: CRUD operations for assessments (audit results).
backend/src/routes/auth.routes.ts & backend/src/controllers/auth.controller.ts: User registration and login.
backend/src/models/Assessment.ts: Defines the Assessment entity (summary, controls, risks, etc.).
backend/src/models/User.ts: Defines the User entity (email, password, role, etc.).
frontend/: Contains the React frontend for user interaction.
parse-pdf.js: A standalone script to extract and print text from a specific PDF (likely for development/testing, not part of main workflow).
docs/Internal Audit tool PRD.pdf: Example or reference document for parsing.
database/: Intended for migrations and seeds, but currently empty.
Summary Table
| Feature | How/Where Implemented | Key Files/Dirs |
|---------------------------------|-----------------------------------------------------------|------------------------------------------------|
| Document Upload & AI Extraction | Backend API, AI service, file storage | document.routes.ts, ai.service.ts, uploads/ |
| Assessment Management | Backend API, DB storage | assessment.routes.ts, Assessment.ts |
| User Management | Backend API, DB storage | auth.routes.ts, auth.controller.ts, User.ts |
| Database | PostgreSQL, TypeORM models | models/, config/database.ts |
| Frontend | React + TypeScript app | frontend/ |
| AI/NLP Integration | OpenAI API, environment config | ai.service.ts, .env |
| Standalone PDF Parsing | Node.js script for dev/testing | parse-pdf.js, docs/ |
In summary:
The tool is a full-stack web application for internal audit and compliance management, using AI to extract controls and risks from uploaded documents, storing results as assessments, and providing user management and analytics. The backend is Node.js/Express with PostgreSQL, the frontend is React, and OpenAI powers the AI features. Each file and directory is organized around these core features.
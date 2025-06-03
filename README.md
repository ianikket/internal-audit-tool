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
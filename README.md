# Tidal Power Fitness

A comprehensive fitness management platform for trainers and clients.

## 🚀 Live Site
- **Frontend**: https://tidal-power-frontend.onrender.com
- **Backend API**: https://tidal-power-backend.onrender.com

## ✨ Features
- **User Management**: User profiles and JWT authentication
- **Admin Dashboard**: Manage trainers, classes, and users
- **Workout Tracking**:
  - Create and manage workout templates
  - Real-time active workout tracking with rest timer
  - Workout history and analytics
- **Class Scheduling**: Trainer availability and class management with calendar view
- **Exercise Library**: Browse and search exercises with filtering

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Deployment**: Render (Frontend + Backend + Database)
- **Authentication**: JWT with HTTP-only cookies

## 📋 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Quick Start

1. **Clone and install dependencies**:
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend
   cd ../backend && npm install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env` in both `frontend` and `backend` directories
   - Update with your local database credentials

3. **Run development servers**:
   ```bash
   # Frontend (http://localhost:3000)
   cd frontend && npm run dev
   
   # Backend (http://localhost:5000)
   cd backend && npm run dev
   ```

## 🔄 Daily Workflow

### End of Day
When you're done working, use the `/eod` command to:
- Document what you accomplished
- Update TODO.md with completed items
- Log progress in PROGRESS.md
- Note any blockers

### Resume Work
When starting a new session, use the `/next` command to:
- See what was accomplished last session
- Review pending tasks
- Get recommendations on what to work on next

See [.agent/workflows/](.agent/workflows/) for detailed workflow documentation.

## 📚 Documentation & BMAD Framework

This project strictly adheres to the **BMAD (BMM Methodology Analysis, Planning, and Solutioning)** framework for management and development.

Comprehensive documentation is organized in the `docs/` directory:

- **[00 Project Foundation](docs/00_Project_Foundation/README.md)**: Rules, Memory, and Project Status.
- **[01 Architecture & Design](docs/01_Architecture_and_Design/architecture.md)**: System Logic, Database ERD, and UI/UX Maps.
- **[02 Product Strategy](docs/02_Product_Strategy/epics.md)**: Epics, Stories, and Site Review Remediations.
- **[03 Operations & Guides](docs/03_Operations_and_Guides/Operational_Workflows.md)**: Backups, Migrations, and Testing/Automation.
- **[04 Changelog & Logs](docs/04_Changelog_and_Logs/CURRENT.md)**: Session history and incident reports.

All legacy deployment guides have been moved to `docs/99_Archive/`.

## 🏗️ Project Structure

```
TidalPowerFitness/
├── _bmad/            # BMAD Framework Core Configuration
├── _bmad-output/     # Living Documentation (Sprint Status, UX Specs)
├── .agent/           # AI workflow definitions
├── frontend/         # Next.js 16 (React 19) Application
├── backend/          # Express 5 (TypeScript) API
├── docs/            # Structured Project Documentation
└── cypress/         # E2E Testing Suite
```

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

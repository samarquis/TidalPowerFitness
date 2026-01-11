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

## 📚 Documentation

- [TODO.md](TODO.md) - Current development roadmap and pending tasks
- [PROGRESS.md](PROGRESS.md) - Daily progress log
- [docs/](docs/) - Additional documentation and archived guides

All deployment guides have been archived to `docs/archive/`:
- `DEPLOYMENT.md` - Docker deployment guide
- `QUICK_DEPLOY.md` - Quick Render deployment steps
- `RENDER_DEPLOYMENT.md` - Detailed Render deployment guide
- `HOW_TO_BECOME_ADMIN.md` - Admin setup instructions

## 🔐 Making Yourself Admin

After registering on the deployed site:
1. Connect to the production database using a PostgreSQL client
2. Run: `UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';`
3. Logout and login again to see admin features

## 🏗️ Project Structure

```
TidalPowerFitness/
├── .agent/           # AI workflow definitions
│   └── workflows/    # Daily workflow commands (/eod, /next)
├── frontend/         # Next.js frontend application
├── backend/          # Express backend API
├── docs/            # Documentation
│   └── archive/     # Archived deployment guides
├── TODO.md          # Development roadmap
└── PROGRESS.md      # Daily progress log
```

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

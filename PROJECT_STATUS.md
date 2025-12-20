# Project Status & Roadmap

This file is the **single source of truth** for the current state of the Tidal Power Fitness project, including active tasks, known issues, and session history.

## 📌 Project Snapshot
- **Frontend**: Next.js 14 (App Router), Tailwind CSS v4, AuthContext (JWT/Cookies)
- **Backend**: Express (TypeScript), PostgreSQL, dedicated `apiClient`
- **Current Focus**: Cleaning up Planning Protocol & Infrastructure

---

## 🕒 Active Session (2025-12-20)
**Current Goal**: Implement the "Single Record of Truth" planning protocol.

- [x] Consolidate `TODO.md`, `PROGRESS.md`, and `task.md` into this file
- [x] Update `CLAUDE.md` instructions
- [x] Update `/eod` and `/next` workflows
- [x] Archive/Delete redundant files
- [x] Investigate and fix "Update Trainer" button bug (Backend logging added, logic verified, awaiting log check)
- [x] Improve Trainer Dashboard navigation (Added back button to Admin Trainer Management)
- [x] Address workout assignment UI restriction (Unlocked "Custom" mode with exercise selector)



---

## 🛠️ Master TODO & Roadmap

### 🔴 High Priority
- [ ] **Verify Production Migrations** - Ensure all recent migrations (Cart, Multi-day, etc.) are executed on Render production DB.
- [ ] **Login/Sign-up Redirect Loop Fix**: Verify and monitor the fix for the `useAuth` loading state check.

### 🟡 Medium Priority
- [x] **Real-time workout logging**
- [x] **Client progress dashboard** (Body metrics + PR detection)
- [ ] **Attendance reports**
- [ ] **Multi-attendee bookings**
- [x] **Real-time workout logging**
- [x] **Client progress dashboard** (Body metrics + PR detection)
- [ ] **Trainer Client Data Access**: Enhance trainers' ability to see client progress from their dashboard.
- [ ] **Refactor Role System**: Migrate from `role` column to strict `user_roles` table.

### 🟢 Low Priority
- [ ] Input validation hardening across all endpoints.
- [ ] Expand E2E test coverage with Cypress.

---

## 🐛 Known Issues & Bug Tracker
- [ ] **Trainer Update Button**: User reports "Update Trainer" button not working in edit profile.
- [ ] **Trainer Dashboard Navigation**: Needs easier ways to go back to the dashboard from specific manage pages.
- [ ] **Workout Assignment UI**: "Choose workout type" reportedly locked to "Use Template".

---

## 📜 Session History

### 2025-12-20
- **Session ID**: 535
- **Accomplishments**: Initiated the consolidation of project planning tools.
- **Notes**: Moving away from fragmented `.gemini/brain` artifacts to a unified `PROJECT_STATUS.md`.

### 2025-12-09
- **Accomplishments**: Fixed 401 Unauthorized errors by correcting CORS and Cookie settings.
- **Refactoring**: Aligned User Management with `apiClient`.

### 2025-12-06
- **Achievements System**: Implemented automated badge awards for bookings/purchases.
- **Real-Time Workout Logging**: Added UPSERT logic for logs and implemented session resume.
- **Progress Dashboard**: Added metrics tracking and automatic PR detection.
- **Admin CRUD**: Added Delete/Edit for classes.

### 2025-12-04
- **Cart Debugging**: Fixed controls and added error banners.
- **Git Cleanup**: Removed `backend/nul`.

### 2025-11-30
- **Demo Users**: Created admin interface for test user generation.
- **Landing Page**: Simplified design and added dynamic pricing.
- **Exercise Library**: Imported 800+ exercises and fixed retrieval bugs.
- **Security**: Added `express-validator` to all routes.

---

## 📂 Reference Links
- [CLAUDE.md](file:///c:/Programming/TidalPowerFitness/CLAUDE.md) - Project instructions & context.
- [README.md](file:///c:/Programming/TidalPowerFitness/README.md) - Main repo overview.

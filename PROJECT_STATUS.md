# Project Status & Roadmap

This file is the **single source of truth** for the current state of the Tidal Power Fitness project, including active tasks, known issues, and session history.

## 📌 Project Snapshot
- **Frontend**: Next.js 14 (App Router), Tailwind CSS v4, AuthContext (JWT/Cookies)
- **Backend**: Express (TypeScript), PostgreSQL, dedicated `apiClient`
- **Current Focus**: Cleaning up Planning Protocol & Infrastructure

---

## 🕒 Active Session (2025-12-21)
**Current Goal**: Fixed JWT_SECRET environment issue and preparing for production migrations.

### High Priority & Cleanup
- [x] Fix critical Turbopack build errors in `workouts/assign/page.tsx`
- [x] Fix backend runtime `PathError` (Express 5 compatibility)
- [x] Fix missing `Link` import build error in `admin/trainers/page.tsx`
- [x] Resolve `role` vs `roles` inconsistency across entire stack
- [x] Implement standardized `user_roles` table (Roadmap Item)
- [x] Fix registration redirect (Point to Client Dashboard instead of `/trainers`)
- [x] Implement **Industry-Style Admin Changelog**
- [x] Fix backend environment crash (Missing `JWT_SECRET`)

### Stability & Security
- [x] Implement local dev cookie workaround (HTTP vs HTTPS)
- [x] Enforce `trainer_id` ownership in workout assignments
- [x] Implement global API error interceptor for 401/403 handling

---

## 🛠️ Master TODO & Roadmap

### 🔴 High Priority (Code Review Findings - 2025-12-21)
- [ ] **Complete Square Payment Integration** - `backend/src/services/paymentService.ts` has TODO for Square checkout
- [ ] **Implement Admin User Impersonation** - `frontend/src/app/admin/users/page.tsx:163` has TODO for impersonation feature
- [ ] **Add TypeScript Types for Request Objects** - Replace `(req as any)` with proper `AuthenticatedRequest` interface across controllers
- [ ] **Resume Trainer Workflow Audit** - Once auth/roles are standardized
- [ ] **Verify Production Migrations** - Apply migrations 010 and 011 via admin UI

### 🟡 Medium Priority (Code Quality & Security)
- [ ] **Replace console.log with Proper Logger** - Implement winston logger for production
- [ ] **Add Input Validation to All Endpoints** - Use express-validator consistently
- [ ] **Implement Rate Limiting** - Protect against API abuse (100 req/15min general, 5 req/15min auth)
- [ ] **Configure Database Connection Pooling** - Add max connections, timeouts, error handling
- [ ] **Add CSRF Protection** - Implement csurf middleware for state-changing routes
- [ ] **Implement Error Boundaries** - Add React error boundary for graceful error handling
- [ ] **Add Loading Skeletons** - Replace generic "Loading..." with skeleton components
- [ ] **Implement Optimistic UI Updates** - For cart and booking operations
- [ ] **Add Pagination to List Endpoints** - `/api/classes`, `/api/trainers`, `/api/exercises`
- [ ] **Add Database Indexes** - For frequently queried columns (user email, booking IDs, session dates)
- [ ] **Implement Request Timeout Handling** - 30s timeout for API requests
- [ ] **Add Environment Variable Validation** - Validate required env vars on startup
- [x] **Real-time workout logging**
- [x] **Client progress dashboard** (Body metrics + PR detection)
- [ ] **Attendance reports**
- [ ] **Multi-attendee bookings**
- [ ] **Trainer Client Data Access**: Enhance trainers' ability to see client progress from their dashboard
- [x] **Refactor Role System**: Migrated from `role` column to strict `user_roles` table

### 🟢 Low Priority (Polish & Documentation)
- [ ] **Add JSDoc Comments** - Document all public APIs
- [ ] **Implement Unit Tests** - For critical business logic (ownership enforcement, etc.)
- [ ] **Implement Soft Deletes** - Add `deleted_at` column to critical tables
- [ ] **Improve Accessibility** - Add ARIA labels and roles
- [ ] **Optimize Images** - Use Next.js Image component
- [ ] **Add Breadcrumb Navigation** - For deep pages (template details, client details)
- [ ] **Document Backup Strategy** - Add to README or operations guide
- [ ] **Standardize Naming Conventions** - Ensure consistent camelCase/snake_case usage
- [ ] Input validation hardening across all endpoints
- [ ] Expand E2E test coverage with Cypress

**📄 Full Site Review**: See `SITE_REVIEW.md` for detailed analysis, code examples, and implementation roadmap

---

## 🐛 Known Issues & Bug Tracker
- [~] **Trainer Update Button**: User reports "Update Trainer" button not working in edit profile.
  - *Investigation*: Code in `admin/trainers/page.tsx` appears correct - calls `apiClient.updateTrainer()` properly. May be a backend issue or already resolved.
- [x] **Trainer Dashboard Navigation**: Added back navigation links to workout template creation page. Most pages already have proper back buttons.
- [~] **Workout Assignment UI**: "Choose workout type" reportedly locked to "Use Template".
  - *Investigation*: Could not locate this specific UI element in `workouts/assign/page.tsx`. May be resolved or on different page.

---

## 📜 Session History

### 2025-12-21
- **Session ID**: 536
- **Accomplishments**:
  - Fixed critical `JWT_SECRET` environment variable issue - backend now starts without crashes.
  - **Implemented comprehensive security enhancements**:
    - Fixed trainer impersonation vulnerability in `assignWorkout` (now uses JWT token ID).
    - Added ownership verification to `deleteTemplate` and `updateSession`.
    - Implemented global 401/403 error handling in frontend API client.
  - **Improved trainer dashboard navigation**:
    - Added back navigation link to workout template creation page.
    - Verified all trainer and workout pages have proper navigation.
  - Verified migrations 010 and 011 are ready for production deployment.
  - Confirmed local development environment is fully functional (backend on port 5000, frontend on port 3001).
  - Investigated known issues and added documentation notes.
  - Committed and pushed all changes to GitHub (5 commits total).
- **Notes**: All high-priority cleanup items, security enhancements, and navigation improvements are complete. Ready to apply migrations via production admin UI and resume trainer workflow audit.

### 2025-12-20
- **Session ID**: 535
- **Accomplishments**: 
  - Consolidated documentation into `PROJECT_STATUS.md`.
  - Fixed `Link` import error in `admin/trainers/page.tsx` preventing production build.
  - Implemented **Professional Admin Changelog** with timeline view and version tracking.
  - Pushed all pending fixes to GitHub `main` branch.
- **Notes**: Repository is now in sync with remote. Ready to resume Trainer Workflow Audit.
> [!IMPORTANT]
> Since the project is on the Free tier of Render, after the site redeploys, you **must go to the [Migration Page](file:///admin/migrations)** to apply the 010 and 011 SQL migrations.

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

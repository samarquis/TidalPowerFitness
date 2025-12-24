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
- [x] **Complete Square Payment Integration** - Verified & Configured with Sandbox.
- [x] **Implement Admin User Impersonation** - Implemented full stack (AuthContext refresh + cookie support)
- [x] **Add TypeScript Types for Request Objects** - `AuthenticatedRequest` type created. `workoutAssignmentController` refactored. Pending: `workoutTemplateController`, `workoutSessionController`.
- [x] **Resume Trainer Workflow Audit** - Once auth/roles are standardized
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

### 🔵 Feature Requests (User Feedback 2025-12-21)

#### Trainer Workflow Overhaul
- [x] **Classes UI**: Redesign to avoid excessive scrolling (Compact/Grid view).
- [x] **Dashboard Redirect**: Redirect trainers directly to Dashboard on login (Hide 'Classes' menu).
- [x] **Shared Templates**: Allow trainers to view others' templates (Checkbox: "Show All / Admin Templates").
- [ ] **Assignment UI**:
    - [ ] Improve Start Time picker (Clock UI).
    - [ ] Fix "Use Template" picker (currently empty/hidden).
- [ ] **Exercise Library**: Add "Push/Pull/Legs" filters.
- [ ] **Today's Session**: Redesign large/confusing control.

#### Admin Dashboard Improvements
- [ ] **Classes Calendar View**: Add visual calendar view for class scheduling.
- [ ] **Class Management**:
    - [ ] Improve Time Picker (Clock control).
    - [ ] Remove Acuity Appointment ID field.
- [ ] **User Management**: Fix DataGridView scaling, replace text actions with Icon Buttons.
- [ ] **Reference Data**: Polish UI, add instructions, use Icon Buttons.
- [ ] **Packages**:
    - [ ] Add full CRUD (Edit/Add/Delete).
    - [ ] Add Manual Credit Adjustment (Credit back sick clients).

#### Reporting System
- [ ] **Trainer Reports**: Clients trained list + Date Range filter.
- [ ] **Client Reports**: Class attendance history + Date Range filter.
- [ ] **Admin Reports**: Site visits, error logs, business stats.

#### Demo / Simulation
- [ ] **Simulation Engine**: Generate 10 random attendees with full workout data (Sets/Reps/Weight) for all classes when in Demo Mode.

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

### 2025-12-24
- **Session ID**: 537
- **Accomplishments**:
  - **TypeScript Refactoring**:
      - Refactored `workoutTemplateController.ts` and `workoutSessionController.ts` to use `AuthenticatedRequest`.
  - **Trainer Workflow Audit**:
      - Completed a comprehensive audit of the trainer workflow.
      - Fixed authentication checks and standardized `apiClient` usage across trainer-related pages.
      - Added edit functionality for workout templates.
- **Notes**: The trainer workflow is now more robust and consistent with the project's standards. The next step is to verify production migrations.

### 2025-12-21
- **Session ID**: 536
- **Accomplishments**:
  - **Square Payment Integration**:
      - Verified & configured Sandbox credentials with `backend/.env`.
      - Refactored `paymentService.ts` to use correct `SquareClient` SDK syntax.
      - Confirmed connectivity with verification script.
  - **Trainer Workflow Improvements**:
      - **Dashboard Redirect**: Trainers now redirect to `/dashboard` on login.
      - **Shared Templates**: Implemented "Show Shared/Admin Templates" filter with Copy functionality.
      - **Classes UI**: Redesigned to use Day Tabs, eliminating excessive scrolling.
  - **Security & Fixes**:
      - Fixed critical `JWT_SECRET` environment variable issue - backend now starts without crashes.
      - Fixed trainer impersonation vulnerability in `assignWorkout` (now uses JWT token ID).
      - Added ownership verification to `deleteTemplate` and `updateSession`.
      - Implemented global 401/403 error handling in frontend API client.
      - Verified migrations 010 and 011 are ready for production deployment.
  - Committed and pushed all changes to GitHub.
- **Notes**: Square integration is verified and ready for use. Trainer workflow received significant UI/UX upgrades. Ready to proceed with Assignment UI refinements.

> [!IMPORTANT]
> Since the project is on the Free tier of Render, after the site redeploys, you **must go to the [Migration Page](file:///admin/migrations)** to apply the 010 and 011 SQL migrations to enable the `user_roles` table changes.

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

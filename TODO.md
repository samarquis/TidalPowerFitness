# Tidal Power Fitness - TODO

## 🚨 High Priority - In Progress

### Membership & Credit System (Replace Acuity) - **IN PROGRESS**
- [x] Database Schema: Packages, UserCredits tables
- [x] Backend Models: Package, UserCredit
- [x] Backend API: Package CRUD endpoints
- [x] Admin Interface: Package Management page (`/admin/packages`)
- [x] **NEXT:** User Interface: Browse & Buy Packages page
- [x] Payment Integration: Square Checkout & Webhooks (needs testing & fixes)
- [x] Booking Logic: Deduct credits on class booking
- [x] Booking Logic: Validate credit expiration
- [x] Cancellation Logic: Refund credits to user balance

## ✅ Recently Completed

### Membership & Credit System (Replace Acuity) - **COMPLETE**
- [x] Database Schema: Packages, UserCredits tables
- [x] Backend Models: Package, UserCredit
- [x] Backend API: Package CRUD endpoints
- [x] Admin Interface: Package Management page (`/admin/packages`)
- [x] User Interface: Browse & Buy Packages page
- [x] Payment Integration: Square Checkout & Webhooks
- [x] Booking Logic: Deduct credits on class booking
- [x] Booking Logic: Validate credit expiration
- [x] Cancellation Logic: Refund credits to user balance

### Exercise Library (User View) - **COMPLETE**
- [x] Design: Muscle group grid layout
- [x] Feature: Filter by Body Part -> Muscle
- [x] Feature: Exercise Detail View (Video, Instructions)
- [x] Public access for all users

### Home Page Redesign
- [x] Logged-out landing page
- [x] Logged-in User Dashboard (Calendar, Stats, Badges)
- [x] Navigation refactor (Management dropdown)

### Admin Enhancements
- [x] Admin Calendar: Monthly view with class management
- [x] User Management: Password reset feature
- [x] Exercise Database: Body Part > Muscle > Exercise hierarchy
- [x] Package Management: Admin interface for packages
- [x] **Database Migrations**: Web-based migration system for Render free tier

### Workout Assignment Feature
- [x] Backend: Assignment endpoints
- [x] Frontend: Assignment wizard UI
- [x] Calendar integration

## 🔧 Backlog / Technical Debt

- [x] **ACTION REQUIRED:** Run Database Migrations on Production (via `/admin/migrations`) - **COMPLETE**
- [ ] Test multi-day class scheduling functionality
- [ ] Verify all migrations applied successfully on deployed environment

---

## 📌 Next Steps Summary

**Recent Completion (Dec 1, 2025):**
- [x] **Database Schema Fix** - Migration 002 adds multi-role support and demo mode
  - Added `roles TEXT[]` column for multi-role system
  - Added `is_demo_mode_enabled BOOLEAN` for demo user management
  - Backfilled existing users' roles from role column
  - Created GIN index for efficient array queries
  - Updated init.sql and seed.sql for fresh deployments
- [x] **Trainers Page Bug Fixes** - Fixed blank trainers page (3 separate fixes)
  - Fix 1: Wrapped API response in `{ trainers: [...] }` object
  - Fix 2: Added NULL check for roles column in SQL query
  - Fix 3: Added ENUM to TEXT cast (`role::TEXT = $1`) to fix type mismatch
- [x] **Demo Users Feature Complete** - Create/delete demo users working perfectly
  - Demo users properly created with both `role` and `roles` columns
  - Delete functionality removes all users with @demo.com emails
  - Verified trainers page shows demo trainers correctly
- [x] **Trainers API Frontend Fix** - Refactored `/admin/trainers` to use `apiClient`
  - Removed direct `fetch()` calls
  - Added `createTrainer()` method to apiClient
  - Consistent API routing to backend domain
- [x] **Dependency Cleanup**
  - Removed `node-fetch` (using native Node.js fetch)
  - Fixed TypeScript config to exclude scripts folder
  - Archived orphaned migration file

**Previous Completion (Nov 30):**
- [x] **Exercise Library Populated** - 873 exercises imported from open-source database
- [x] **Input Validation** - All critical endpoints protected
- [x] **Integration Tests** - Complete booking flow tested
- [x] **Bug Fix** - Exercise display bug resolved
- [x] **Documentation** - CLAUDE.md created for future AI instances
- [x] **Mobile UI Fixes** - Calendar, trainers list, and assign workout page responsive
- [x] **Trainers List Bug** - All trainers with role now appear, even without complete profiles
- [x] **Design Consistency** - Assign workout page matches dark theme
- [x] **Landing Page Enhancements** - Added statistics, testimonials, pricing teaser, and FAQ sections
- [x] **Landing Page Cleanup** - Removed process steps and testimonials sections
- [x] **Dynamic Pricing** - Pricing section now fetches and displays real packages from database
- [x] **Cart Investigation** - Code structure verified correct, may need runtime debugging
- [x] **Demo Users Feature** - Web interface to create/manage demo users at `/admin/demo-users`

**Immediate Next Tasks:**
1. [ ] Test cart functionality in production (check browser console if issues)
2. [ ] Test HttpOnly cookie migration for JWT storage (security improvement)
3. [ ] Verify multi-day class scheduling functionality
4. [ ] Consider adding blog/content section for SEO and engagement

---

## 📋 Comprehensive Review Action Plan (Generated on 2025-11-28)

The following tasks are based on a comprehensive review of the codebase.

### 🛡️ Security Vulnerabilities (High Priority)

- [x] **CRITICAL:** Remove hardcoded default JWT secret. - **VERIFIED COMPLETE**
    - ✅ Application now fails to start if JWT_SECRET is not provided
    - ✅ No fallback secrets in codebase
- [x] **HIGH:** Add input validation to all critical endpoints - **COMPLETE**
    - ✅ Installed express-validator
    - ✅ Added validation to auth, booking, cart, package, and profile endpoints
    - ✅ Email, password, UUID, and numeric range validation implemented
    - ✅ Protection against injection attacks
- [ ] **MEDIUM:** Secure JWT storage on the frontend.
    - The current `localStorage` implementation is vulnerable to XSS.
    - Plan and migrate to using `HttpOnly` cookies for storing JWTs.

### ⚙️ Backend Improvements

- [x] **Input Validation:** Add robust validation and sanitization to all controller endpoints - **COMPLETE**
    - ✅ Implemented using express-validator
    - ✅ Auth, booking, cart, package, and profile routes validated
    - ✅ Comprehensive error messages returned to clients
- [x] **Dependency Cleanup:** - **COMPLETE (Dec 1, 2025)**
    - ✅ `bcryptjs` was already removed (using `bcrypt`)
    - ✅ Removed `node-fetch` dependency (using native fetch in Node.js 24+)
    - ✅ Fixed TypeScript configuration issues
- [ ] **Code Consistency:** Refactor controllers to use a consistent pattern (either all classes or all function-based exports).

### 🎨 Frontend Improvements

- [ ] **Standardize API Calls:** Refactor all components (e.g., `classes/page.tsx`) to use the central `apiClient`. Remove direct `fetch` calls to eliminate code duplication.
    - [x] Refactored `/admin/migrations` page.
- [ ] **Refactor Token Management:** Remove redundant token handling logic from `AuthContext.tsx`. Let `apiClient` be the single source of truth for storing the token in `localStorage`.

### 🗄️ Database & Technical Debt

- [ ] **Remove Legacy Column:** Create a migration to safely remove the unused `day_of_week` column from the `classes` table.
- [ ] **Refactor Role System:**
    - Plan the migration from a single `role` column to a proper multi-role system.
    - This will likely involve creating a `roles` table and a `user_roles` junction table to align the database with the application's data model.

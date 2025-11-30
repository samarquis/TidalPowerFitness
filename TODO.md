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

**Recent Completion (Nov 30):**
- [x] **Exercise Library Populated** - 873 exercises imported from open-source database
- [x] **Input Validation** - All critical endpoints protected
- [x] **Integration Tests** - Complete booking flow tested
- [x] **Bug Fix** - Exercise display bug resolved
- [x] **Documentation** - CLAUDE.md created for future AI instances

**Immediate Next Tasks:**
1. [ ] Test HttpOnly cookie migration for JWT storage (security improvement)
2. [ ] Clean up redundant dependencies (bcryptjs, node-fetch)
3. [ ] Verify multi-day class scheduling functionality

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
- [ ] **Dependency Cleanup:**
    - Remove the redundant `bcryptjs` dependency and standardize on `bcrypt`.
    - Investigate removing the `node-fetch` dependency and using the native `fetch` available in modern Node.js.
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

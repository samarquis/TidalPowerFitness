# Tidal Power Fitness - Master TODO

This file is the single source of truth for all project tasks.

## 🚀 High Priority / Next Up

## 🚀 High Priority / Next Up

### 1. Bug Fixes & Stability
- [x] **INVESTIGATE:** `/workouts/assign` page extension errors - **VERIFIED CLEAN**
    - Error: "A listener indicated an asynchronous response..." (Confirmed likely browser extension conflict).
- [x] **BUG:** Trainers API response format mismatch - **FIXED**
    - Patched `trainers/page`, `admin/trainers/page`, `TrainerBiosSection`, and `ClassScheduleSection` to handle both formats.

### 2. Technical Debt & Maintenance
- [ ] **Verify Production Migrations**
    - Ensure all recent migrations (Cart, Multi-day, etc.) are executed on Render production DB.
- [ ] **Refactor Role System (Long Term)**
    - Migrate from `role` column to strict `user_roles` table if needed for complex permissions.

---

## ✅ Recently Completed

### December 2025
- [x] **Achievements System / Badges**
    - Full backend logic (awards on booking/purchase).
    - Profile page UI with Badge cards.
- [x] **Multi-Day Class Scheduling**
    - Fixed public schedule to show classes on all `days_of_week`.
    - Verified Admin creation of multi-day classes.
- [x] **Editable Trainer Cards**
    - Admin feature to edit trainer profiles and user details.
    - Unified update endpoint.
- [x] **Security Hardening**
    - Migrated to `HttpOnly` cookies for JWT storage.
    - Removed `localStorage` token usage.
- [x] **Instructor Attendance View**
    - Trainers can see list of attendees for their classes.
- [x] **Cart & Checkout**
    - Fixed cart controls (+/- quantity).
    - Integrated Mock Payment flow for testing credits.

### November 2025
- [x] **Exercise Library** (Imported 800+ exercises).
- [x] **Authentication** (JWT Secret fixed, Input Validation added).
- [x] **Admin Class Management** (Create/Delete classes).

---

## 📂 Reference
- **Daily Progress**: See `PROGRESS.md` for detailed daily logs.
- **Workflow**: Use `/eod` to track end-of-day progress.

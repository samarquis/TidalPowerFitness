# Tidal Power Fitness - Master TODO

This file is the single source of truth for all project tasks.

Workouts
  create a template is taking me to welcome back page to sign in
 after signin it is taking me to the trainers tab
Choose workout type is locket to the Use Template.
A template should be able to be used many times
curently not seeing any templates for workouts

History page is not loading
  Currently it is taking me to the sign in then to the trainers page

Trainer Dashboard
 My classes should show just the classes they are a trainer for?
I like the layout just need an easy way to go back to dashboard if clincking the Manage availablity, workout template, assign workouts pages
I would also like for the trainers to be able to see the clients data from this screen
Example if Lisa is training Scott she should be able to see his data

My availability Slot
when trying to add an availablity and I get No token provided


Trainer edit profile
I can edit stuff but the Update Trainer button is not working

User management
The controls do not fit on the view very well

Still have no way to test the purchasing process as well as using token to sign up or if it is I dont see any where that I have tokens. With out tokens I cant test signing up for a class then walk through the attending a class and see how the interface is working for the trainer and I would like to see the record shown in my dashboard.

## 🚀 High Priority / Next Up

### 1. Bug Fixes & Stability
- [x] **BUG:** Resolved widespread 401 Unauthorized errors - **FIXED**
- [x] **INVESTIGATE:** `/workouts/assign` page extension errors - **VERIFIED CLEAN**
    - Error: "A listener indicated an asynchronous response..." (Confirmed likely browser extension conflict).
- [x] **BUG:** Trainers API response format mismatch - **FIXED**
    - Patched `trainers/page`, `admin/trainers/page`, `TrainerBiosSection`, and `ClassScheduleSection` to handle both formats.

### 2. Technical Debt & Maintenance
- [ ] **Real-time workout logging** (Medium Priority)
- [ ] **Client progress dashboard** (Medium Priority)
- [ ] **Attendance reports** (Low Priority)
- [ ] **Multi-attendee bookings** (Low Priority)
- [ ] **Verify Production Migrations**
    - Ensure all recent migrations (Cart, Multi-day, etc.) are executed on Render production DB.
- [ ] **Refactor Role System (Long Term)**
    - Migrate from `role` column to strict `user_roles` table if needed for complex permissions.

---

## ✅ Recently Completed

### December 2025
- [x] **Authentication & Authorization Fixes**
    - Corrected CORS policy for dynamic origins.
    - Made cookie settings environment-dependent (local dev vs. production).
    - Refactored User Management page to use centralized `apiClient`.
- [x] **Achievements/Badges system**
    - Full backend logic (awards on booking/purchase).
    - Profile page UI with Badge cards.
- [x] **Multi-Day Class Scheduling**
    - Fixed public schedule to show classes on all `days_of_week`.
    - Verified Admin creation of multi-day classes.
- [x] **Trainer class attendee view**
    - Trainers can see list of attendees for their classes.
- [x] **Client class sign-up flow**
    - "Sign Up" button on class cards.
    - Credit deduction logic and confirmation modal.
- [x] **Editable Trainer Cards**
    - Admin feature to edit trainer profiles and user details.
    - Unified update endpoint.
- [x] **Security Hardening** (`HttpOnly` cookies, cleaned `localStorage`).
- [x] **Cart & Checkout** (Mock Payment flow).

### November 2025
- [x] **Exercise Library** (Imported 800+ exercises).
- [x] **Authentication** (JWT Secret fixed, Input Validation added).
- [x] **Admin Class Management** (Create/Delete classes).

---

## 📂 Reference
- **Daily Progress**: See `PROGRESS.md` for detailed daily logs.
- **Workflow**: Use `/eod` to track end-of-day progress.

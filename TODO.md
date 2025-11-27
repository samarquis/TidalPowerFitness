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

- [ ] **ACTION REQUIRED:** Run Database Migrations on Production (via `/admin/migrations`)
- [ ] Test multi-day class scheduling functionality
- [ ] Verify all migrations applied successfully on deployed environment

---

## 📌 Next Steps Summary

**Immediate Next Task:** Execute Production Migrations
1. Log in to production site as admin
2. Go to `/admin/migrations`
3. Run pending migrations

**Immediate Next Task:** Complete Membership & Credit System
1. Build User-facing Packages page (`/packages`)
2. Integrate Square payment flow
3. Update class booking to consume credits

**After Membership System:** Build Exercise Library (User View)

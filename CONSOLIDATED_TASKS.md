# Consolidated Tasks and TODOs for Tidal Power Fitness

This document consolidates all tasks, TODOs, and actionable items found across the project's Markdown files.

---

## 📅 Recent Progress and In-Progress Items (from `PROGRESS.md`)

### ✅ Completed (2025-11-27)
- Built Web-Based Database Migration System (Backend, Frontend, Security)
- Deployed to Production
- Documentation (implementation plan and walkthrough for migration system, updated project tracking documents)

### 🚧 In Progress (2025-11-27)
- Waiting for production deployment to finish
- Pending execution of migrations on production database

### ✅ Completed (2025-11-25)
- Added 4 new TODO items: Fix workout template creation page loading issue, Fix workout history page loading issue, Add calendar view for classes, Create user dashboard with motivational metrics
- Cleaned up markdown documentation: Moved 4 deployment guides to `docs/archive/`, Updated main README.md with comprehensive project info, Removed boilerplate frontend README, Created docs/README.md for documentation index
- Created daily workflow system: `/eod` workflow, `/next` workflow
- Fixed Workout History Page Loading Issue
- Fixed Workout Template Creation Page Loading Issue
- Deployed Bug Fixes to Production

### 🚧 In Progress (2025-11-25)
- Working through TODO items (prioritized easiest to hardest)
- Next: Add calendar view for classes

---

## 🎯 High Priority & Backlog (from `TODO.md`)

### 🚨 High Priority - In Progress: Membership & Credit System (Replace Acuity)
- [x] Database Schema: Packages, UserCredits tables
- [x] Backend Models: Package, UserCredit
- [x] Backend API: Package CRUD endpoints
- [x] Admin Interface: Package Management page (`/admin/packages`)
- [x] **NEXT:** User Interface: Browse & Buy Packages page
- [x] Payment Integration: Square Checkout & Webhooks (needs testing & fixes)
- [x] Booking Logic: Deduct credits on class booking
- [x] Booking Logic: Validate credit expiration
- [x] Cancellation Logic: Refund credits to user balance

### ✅ Recently Completed (from `TODO.md`)
- **Membership & Credit System (Replace Acuity) - COMPLETE**
- **Exercise Library (User View) - COMPLETE**
- **Home Page Redesign**
- **Admin Enhancements** (including Web-based migration system for Render free tier)
- **Workout Assignment Feature**

### 🔧 Backlog / Technical Debt
- [ ] **ACTION REQUIRED:** Run Database Migrations on Production (via `/admin/migrations`)
- [ ] Test multi-day class scheduling functionality
- [ ] Verify all migrations applied successfully on deployed environment

### 📌 Next Steps Summary (from `TODO.md`)
- **Immediate Next Task:** Execute Production Migrations
  1. Log in to production site as admin
  2. Go to `/admin/migrations`
  3. Run pending migrations
- **Immediate Next Task:** Complete Membership & Credit System
  1. Build User-facing Packages page (`/packages`)
  2. Integrate Square payment flow
  3. Update class booking to consume credits
- **After Membership System:** Build Exercise Library (User View)

---

## 🗄️ From Backend Migrations (`backend\database\migrations\README.md`)

### ⚠️ Pending Migration
- Migration 001: Add days_of_week Column - Pending execution on production

---

## 🔒 Security & Deployment Related Tasks (from `docs/archive/DEPLOYMENT.md`)

### 🚧 Security Checklist (from `docs/archive/DEPLOYMENT.md`)
- [ ] Change default database password
- [ ] Generate secure JWT secret
- [ ] Enable HTTPS/SSL in production
- [ ] Set up firewall rules
- [ ] Regular database backups
- [ ] Update dependencies regularly
- [ ] Monitor application logs
- [ ] Use secrets management (AWS Secrets Manager, etc.)

---

## 🚀 Quick Deployment Next Steps (from `docs/archive/QUICK_DEPLOY.md`)

### 📌 Next Steps After Deployment
- Add Acuity Scheduling credentials when ready
- Add Square Payment credentials when ready
- Continue development locally
- Push changes to GitHub (Render auto-deploys)
- Upgrade to paid plan when ready for production traffic

---

## ☁️ Render Deployment Prerequisites & Next Steps (from `docs/archive/RENDER_DEPLOYMENT.md`)

### 📝 Prerequisites
- [ ] Render account (we'll create this)
- [ ] GoDaddy domain (optional - can add later)

### ✅ Next Steps After Deployment (Completed)
- Test all features thoroughly
- Add Acuity Scheduling credentials when ready
- Add Square Payment credentials when ready
- Set up monitoring (Render has built-in logs)
- Configure backups for database
- Add custom domain when purchased

---

## ⚙️ Development Setup & Admin Tasks (from `README.md`)

### 📝 Development Setup
- Configure environment variables: Copy `.env.example` to `.env` in both `frontend` and `backend` directories and update with local database credentials.

### 🔑 Making Yourself Admin
- Run: `UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';`
- Logout and login again to see admin features.

# Consolidated TODO List


## ✅ Completed
- User Profile Page (`frontend/src/app/profile/page.tsx`)
- Navigation mobile‑menu auto‑collapse (`frontend/src/components/Navigation.tsx`)
- Admin Trainer Management UI & API (`frontend/src/app/admin/trainers/page.tsx`, `backend/src/routes/trainers.ts`, `backend/src/controllers/trainerController.ts`)
- Admin Class Management UI & API (`frontend/src/app/admin/classes/page.tsx`, `backend/src/routes/classes.ts`)
- AuthContext token exposure fix (`frontend/src/contexts/AuthContext.tsx`)
- **Home Page Redesign**
  - Class schedule/calendar display with color-coding (`frontend/src/components/ClassScheduleSection.tsx`)
  - Trainer bios section (`frontend/src/components/TrainerBiosSection.tsx`)
  - Admin quick-access buttons (`frontend/src/app/page.tsx`)
- **Trainer pick-list for class setup** - Already implemented in `frontend/src/app/admin/classes/page.tsx`
- **Trainer Availability Scheduling** - Trainers can set weekly availability slots (`frontend/src/app/trainer/availability/page.tsx`, `backend/src/models/TrainerAvailability.ts`)
- **Class Publishing Workflow** - Admins can publish/unpublish classes with color legend (`frontend/src/app/admin/classes/page.tsx`, `frontend/src/components/ClassScheduleSection.tsx`)
- **Workout Templates** - Create, view, and manage workout templates (`frontend/src/app/workouts/templates/`)
- **Active Workout Session** - Real-time workout tracking with rest timer (`frontend/src/app/workouts/active/`)
- **Workout History** - View past sessions and details (`frontend/src/app/workouts/history/`)
- **Workout History Page Fix** - Fixed loading issues with authentication guard and error handling (`frontend/src/app/workouts/history/page.tsx`)
- **Workout Template Creation Page Fix** - Fixed loading issues with authentication guard and improved error handling (`frontend/src/app/workouts/templates/new/page.tsx`)
- **Class Creation Form Time Format** - Updated to use 12-hour format (Hour:Minutes am/pm) with dropdowns and AM/PM toggle (`frontend/src/app/admin/classes/page.tsx`)
- **Exercise Database Admin UI** - Created admin interface for managing exercises with CRUD operations, filtering, and search (`frontend/src/app/admin/exercises/page.tsx`)
- **Workout Programming Wizard** - Enhanced workout template creation with body part filtering, workout type selection, and drag-and-drop exercise reordering (`frontend/src/app/workouts/templates/new/page.tsx`)
- **Reference Data Management UIs** - Created admin interface for managing body focus areas and workout types with CRUD operations (`frontend/src/app/admin/reference-data/page.tsx`)
- **Class Management Enhancements** - Implemented multi-day class scheduling and visual calendar view (`frontend/src/app/admin/calendar/page.tsx`)

## ⏳ Pending

### � Todo 11/26 (New Requirements)
- **Home Page & Navigation**
    - [ ] **Simplify Navigation** - Fix "crunched up" items, ensure responsive design.
    - [ ] **Logged-Out View** - Show landing page with:
        - Tidal Power Fitness branding
        - Log In option
        - Class offerings
    - [ ] **Logged-In View (User Dashboard)**
        - [ ] **Calendar** - Monthly view (Sun-Sat), navigation for current/next month.
        - [ ] **Dashboard Layout**
            - Past workouts (Class type info)
            - Weight Lifted Stats (Muscle groups + weight lifted, e.g., "Legs: 1000 lbs")
            - Badges/Achievements
        - [ ] **Log Out Button** - Ensure visibility/accessibility.

- **Admin Page Enhancements**
    - [ ] **Admin Calendar**
        - Monthly view (Sun-Sat)
        - Show classes on days
        - Interface for trainers to add classes to specific days
    - [ ] **User Management**
        - Promote user to Trainer
        - Admin password reset for users
    - [ ] **Workout Planner** - Assist trainers in programming workouts.
    - [ ] **History** - Show past classes and attendee lists.
    - [ ] **Exercises Management**
        - Sub-page for entry
        - Target Body Part (Chest, Legs, Back)
        - Target Muscle (Bicep, Glutes, Calf)
        - Exercise Listing (Leg Curls, Squats, etc.)

### �🚨 High Priority (Fixes & Broken Items)
- [x] **Fix "Create Workout" Error** - Resolved
- [x] **Run Database Migration** - Configured automatic migration on deployment

### ⚡ Quick Wins (Enhancements & Setup)
- All quick wins completed!

### 🚀 Major Features (Longer Term)
- [x] **Workout Assignment**
    - Trainer can assign workouts to classes or individual clients
    - Multi-step wizard UI for easy assignment
    - Backend API endpoints for assignment workflow

### Future Integrations & Deferred
- [ ] Acuity Scheduling webhooks integration
- [ ] Square payment webhooks integration
- [ ] **Fix Acuity Loading** - Ensure classes populate correctly from Acuity.

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

## ⏳ Pending

### 🚨 High Priority (Fixes & Broken Items)
- [x] **Fix "Create Workout" Error** - Investigate and resolve the error preventing workout creation.

### ⚡ Quick Wins (Enhancements & Setup)
- All quick wins completed!

### 🚀 Major Features (Longer Term)
- [ ] **Class Management: Multi-day & Calendar**
    - Allow Multi-day selection (e.g., Mon, Wed, Fri) - *Requires DB change*.
    - **Calendar View**: Real calendar display, recurring logic, color coding.
    - Click to add to cart/checkout.
- [ ] **Workout Assignment**
    - Trainer picks Class -> Workout -> User(s).

### Future Integrations & Deferred
- [ ] Acuity Scheduling webhooks integration
- [ ] Square payment webhooks integration
- [ ] **Fix Acuity Loading** - Ensure classes populate correctly from Acuity.

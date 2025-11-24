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

## ⏳ Pending

### Workout Tracking System
#### Workout Templates
- [ ] List Templates page (`/workouts/templates`)
- [ ] Create / Edit Template page (`/workouts/templates/new`)
- [ ] View Template Details page

#### Active Workout Session
- [ ] Start Workout Interface (`/workouts/active`)
- [ ] Log sets / reps / weight during a session
- [ ] Timer / rest‑period functionality
- [ ] Completion summary screen

#### Workout History
- [ ] History List page (`/workouts/history`)
- [ ] Session Details view

### Future Integrations
- [ ] Acuity Scheduling webhooks integration
- [ ] Square payment webhooks integration

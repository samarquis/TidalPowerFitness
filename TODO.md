# Consolidated TODO List

## ✅ Completed
- User Profile Page (`frontend/src/app/profile/page.tsx`)
- Navigation mobile‑menu auto‑collapse (`frontend/src/components/Navigation.tsx`)
- Admin Trainer Management UI & API (`frontend/src/app/admin/trainers/page.tsx`, `backend/src/routes/trainers.ts`, `backend/src/controllers/trainerController.ts`)
- Admin Class Management UI & API (`frontend/src/app/admin/classes/page.tsx`, `backend/src/routes/classes.ts`)
- AuthContext token exposure fix (`frontend/src/contexts/AuthContext.tsx`)

## ⏳ Pending

### Home Page Redesign (High Priority)
- [ ] Public home page features
  - [ ] Display class schedule/calendar
  - [ ] Show class descriptions
  - [ ] Display trainer bios
  - [ ] Login button/link
- [ ] Admin-specific home page features
  - [ ] Quick access to "Add Class"
  - [ ] Quick access to "Users List"

### Class Scheduling & Calendar (High Priority)
- [ ] Trainer pick-list for class setup (verify trainer exists before assignment)
- [ ] Trainer availability scheduling interface
  - [ ] Allow trainers to set days/times when their classes are available
  - [ ] Backend API for trainer availability management
- [ ] Public class calendar view
  - [ ] Display published classes on a calendar
  - [ ] Assign consistent colors to each class type
  - [ ] Filter/legend for class types
- [ ] Class publishing workflow
  - [ ] Mark classes as "published" to show on calendar
  - [ ] Admin controls for publishing/unpublishing

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

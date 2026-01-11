# Release Notes - 2026-01-06
## Site Review 004 & Trainer Workflow Audit

### Overview
This release addresses critical feedback from Site Review 004 (SR-004) regarding UX inconsistencies and implements "Quality of Life" features for trainers identified during a deep-dive workflow audit.

### 🐛 Bug Fixes & UX Improvements (SR-004)

#### 1. "Upcoming Classes" Filtering
*   **Issue:** The User Dashboard displayed past classes in the "Upcoming" section, confusing users.
*   **Fix:** Updated `UserDashboard.tsx` to filter `bookings` where `booking_date >= Today`.
*   **Impact:** Users now only see relevant future commitments.

#### 2. Role Simulator for Dev/Admin
*   **Issue:** The role switching tool was "off the page" and difficult to access for the primary tester (`samarquis4`).
*   **Fix:** Enhanced `Navigation.tsx` to include a dedicated, visible "Dev Tools" section with one-click role toggles (Admin/Trainer/Client) specifically for authorized users.
*   **Impact:** Streamlined QA and testing workflow for the admin team.

#### 3. Workout Assignment Styling & Filters
*   **Issue:** The Exercise Picklist on `/workouts/assign` had white-on-white text (unreadable) and inefficient filters.
*   **Fix:** 
    *   Applied correct text colors (`text-foreground`) to select inputs.
    *   Refactored filters to prioritize **Movement Pattern** (Push/Pull) over Body Part, aligning with the training methodology.
*   **Impact:** Trainers can now quickly build workouts without UI friction.

#### 4. Exercise Standardization (Push/Pull)
*   **Issue:** Exercises were inconsistently categorized or missing "Movement Pattern" flags entirely.
*   **Fix:** 
    *   Created **Migration 027** (`027_update_exercise_movement_patterns.sql`) to reclassify key compound lifts (Squat, Leg Press, Lunge -> **Push**; Deadlift -> **Pull**).
    *   Updated database constraints to enforce these patterns.
*   **Impact:** Enables powerful, methodology-aligned filtering for workout creation.

### ✨ New Features (Trainer Workflow Audit)

#### 5. Active Logger - Historical Context
*   **Gap Identified:** During the "Deep Dive" audit, it was noted that trainers had no visibility into a client's *previous* performance while logging a current set.
*   **Solution:**
    *   **Backend:** Added new endpoint `GET /api/workout-sessions/client/:clientId/history/:exerciseId`.
    *   **Frontend:** Updated `WorkoutLogPage` to automatically fetch and display the **Last Session's Stats** (Date, Weight, Reps, Notes) when an exercise is selected.
*   **Impact:** Trainers can now apply progressive overload principles effectively without needing to leave the logging screen to check history.

### 🔍 Audit Summary
A full audit of the Client and Trainer workflows confirmed:
- **Client Flow:** Purchase -> Book -> Attend -> History works as expected.
- **Data Integrity:** Credit deduction and Achievement triggering are verified.
- **Trainer Flow:** Now fully functional with the addition of the history lookup.

### Technical Details
- **New Migration:** `027_update_exercise_movement_patterns.sql`
- **New API Endpoint:** `workoutSessionController.getExerciseHistory`

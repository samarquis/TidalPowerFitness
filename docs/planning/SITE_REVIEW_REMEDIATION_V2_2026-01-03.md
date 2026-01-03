# Site Review Remediation Plan V2 - 2026-01-03

**Source:** Site review 1-3-26 ver 2.md (and original V1)
**Status:** Planned
**Owner:** BMAD Team

## Executive Summary
This plan addresses the UI/UX issues, functional bugs, and workflow enhancements identified in the site reviews dated January 3, 2026 (Versions 1 and 2). The primary focus is on stabilizing the UI (Epic 1) and significantly upgrading the "Assign Workout" workflow to meet the trainer's need for a comprehensive, intuitive wizard (Epic 3).

---

## Epic 1: UI/UX Consistency & Polish (From V1)
**Primary Agent:** `bmm-ux-designer`

### Story 1.1: Fix Navigation Bar Layout
**Problem:** "Nav bar is compressed and is not fitting. It looks terrible. Do not like the glass feel of the drop down menu."
**File:** `frontend/src/components/Navigation.tsx`
**Task:**
- Fix responsive layout (prevent overlapping).
- Remove "glassmorphism" (blur) from dropdowns; use solid/opaque theme colors.
- Ensure high contrast and readability.

### Story 1.2: Standardize Action Items
**Problem:** "Action items need to be buttons" (Admin pages).
**Task:** Replace text links with standard `<Button>` components in Admin tables (Exercises, Classes, Ref Data).

### Story 1.3: Classes Card Design
**Problem:** "Hard to see the classes in the cards."
**Task:** Redesign `classes/page.tsx` list view for better readability (distinct day indicators, clear structure).

### Story 1.4: Token Sync & Visibility
**Problem:** "Tokens for logged in user is not showing the correct tokens... Is this just a little indicator or is this something to click?"
**Task:**
- Ensure Nav bar token count syncs with `AuthContext` immediately.
- Make the Token indicator clickable -> Link to "My Packages/Credits".

### Story 1.5: Home Page Empty States
**Problem:** "Calendar looks good but it is empty."
**Task:** Add a clear "No classes booked. [Book Now]" empty state to the User Dashboard calendar.

---

## Epic 2: Exercise Library Enhancements
**Primary Agent:** `bmm-dev`

### Story 2.1: Global Filters
**Problem:** "I need a filter by push or pull... I need to then pick from the exercises that were filtered."
**Context:** Filters exist but are hidden inside "Muscle Group" selection.
**Task:**
- Move "Push/Pull/Legs" and "Body Part" filters to the top level of `frontend/src/app/exercises/page.tsx`.
- Allow filtering by Movement Pattern *without* selecting a Muscle Group first.

---

## Epic 3: Trainer Workflow & Workout Wizard (From V2)
**Primary Agent:** `bmm-architect` / `bmm-dev`
**Goal:** "I really need a better workout class flow. I want the trainer to walk through a wizard... Create or Select class -> Program or assign workout."

### Story 3.1: Enhanced Exercise Selector (In Wizard)
**Problem:** "Just don't know that you click something to add to workout."
**File:** `frontend/src/app/workouts/assign/page.tsx`
**Task:**
- Upgrade the "Custom Workout" step.
- Replace simple checkboxes with a rich list including:
    - **Search Bar**
    - **Filters:** Body Part, Movement Pattern (Push/Pull).
    - **"Add" Button:** Clear call-to-action to add to the session.

### Story 3.2: Comprehensive Session Builder
**Problem:** "She programs that we are doing Squats 3 set of 10 and logs the weight... Picks ab work... 5 min warm up."
**File:** `frontend/src/app/workouts/assign/page.tsx`
**Task:**
- After adding an exercise, show input fields for:
    - **Sets**
    - **Reps**
    - **Weight (Target)**
    - **Rest Time**
- Add ability to reorder exercises.
- **Warmup/Cooldown:** Add specific sections or flags for "Warmup" and "Cooldown" exercises/activities.

### Story 3.3: "Assign" Redirect Fix
**Problem:** "This is going to the home dashboard. That is not intended."
**Task:** Ensure the "Assign Workout" flow redirects to the *Admin Calendar* or the *Class Details* page (showing the newly assigned workout) upon completion, not the User Dashboard.

---

## Epic 4: Data Integrity (From V1)
**Primary Agent:** `bmm-dev`

### Story 4.1: Weight Formatting
**Problem:** "Thousands, millions with commas as it should be."
**Task:** Apply `toLocaleString()` to weight values in `leaderboard/page.tsx`.

### Story 4.2: Verify Packages
**Problem:** "Make sure we have everything listed."
**Task:** Audit `packages` table vs frontend display.

---

## Execution Order
1.  **Epic 1 (UX Polish):** Quick wins, high visibility.
2.  **Epic 3 (Wizard):** High value for Trainers (critical workflow).
3.  **Epic 2 & 4:** Follow up.

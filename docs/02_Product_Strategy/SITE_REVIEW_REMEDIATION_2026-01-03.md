# Site Review Remediation Plan - 2026-01-03

**Source:** Site review 1-3-26.md
**Status:** Planned
**Owner:** BMAD Team

## Executive Summary
This plan addresses the UI/UX issues, functional bugs, and inconsistencies identified in the site review dated January 3, 2026. The work is categorized by BMAD Agent roles to ensure specialized attention to design vs. logic.

---

## Epic 1: UI/UX Consistency & Polish
**Primary Agent:** `bmm-ux-designer`
**Secondary Agent:** `bmm-dev`

### Story 1.1: Fix Navigation Bar Layout
**Problem:** "Nav bar is compressed and is not fitting. It looks terrible."
**File:** `frontend/src/components/Navigation.tsx`
**Task:**
- Review the `Navigation` component's responsive design (Tailwind classes).
- Ensure items do not overlap or wrap awkwardly on desktop screens.
- Adjust padding/margins or font sizes if necessary.

### Story 1.2: Improve Management Dropdown Styling
**Problem:** "Do not like the glass feel of the drop down menu."
**File:** `frontend/src/components/Navigation.tsx`
**Task:**
- Remove the backdrop-blur or high-transparency "glassmorphism" effect.
- Switch to a solid or slightly opaque background that matches the site's primary theme (e.g., solid dark grey/black or white, depending on theme).

### Story 1.3: Standardize Action Items as Buttons
**Problem:** "Action items need to be buttons that are consistent on site" (Manage Exercises, Classes, Reference Data).
**Files:**
- `frontend/src/app/admin/exercises/page.tsx` (Manage Exercises)
- `frontend/src/app/admin/classes/page.tsx`
- `frontend/src/app/admin/reference/page.tsx`
**Task:**
- Identify text links or icon-only actions that should be buttons.
- Replace with the standard `<Button>` component (e.g., primary or secondary variants) for clear call-to-action.

### Story 1.4: Format Weights in Leaderboard
**Problem:** "I want the weight listed with proper format. Thousands, millions with commas as it should be."
**File:** `frontend/src/app/leaderboard/page.tsx`
**Task:**
- Apply number formatting (e.g., `toLocaleString()`) to weight values in the leaderboard table.

### Story 1.5: Classes Card Design
**Problem:** "Hard to see the classes in the cards... would rather see the classes with a little indicator or something on the days of week available."
**File:** `frontend/src/app/classes/page.tsx`
**Task:**
- Redesign the class list view.
- Experiment with a weekly calendar view or a list with distinct "Day" indicators rather than a card grid.
- **Note:** This requires a quick mockup/confirmation before full implementation.

---

## Epic 2: Data Integrity & Functional Bugs
**Primary Agent:** `bmm-dev`

### Story 2.1: Fix Token/Credit Synchronization
**Problem:** "Tokens for logged in user is not showing the correct tokens as the site... site shows I have 8 but the dashboard only has 0."
**Files:**
- `frontend/src/components/dashboard/UserDashboard.tsx`
- `frontend/src/contexts/AuthContext.tsx`
**Root Cause:** Dashboard likely fetches stale data or doesn't re-fetch after login/updates, while Nav bar uses AuthContext (or vice-versa).
**Task:**
- Ensure `UserDashboard` uses the `user` object from `AuthContext` or triggers a context refresh.
- Verify `AuthContext` correctly updates the user's credit balance from the backend on load.

### Story 2.2: Fix "Assign Workout" Redirect
**Problem:** "This is going to the home dashboard. That is not intended. This should show available classes to assign a workout."
**File:** `frontend/src/app/workouts/assign/page.tsx` (or the link leading to it)
**Task:**
- Check the routing logic for the "Assign Workout" page.
- Ensure it renders the assignment form/class list instead of redirecting.

### Story 2.3: Add Filters to Exercise Library
**Problem:** "Need a way to filter by Push or Pull action."
**File:** `frontend/src/app/exercises/page.tsx`
**Task:**
- Add a "Filter" dropdown or toggle for Movement Pattern (Push/Pull/Legs/etc.) if that data exists in the `Exercise` model.
- If data is missing, add a migration to `backend` to support this classification.

### Story 2.4: Verify Packages List
**Problem:** "I know somewhere in the database is more classes. Please review and make sure we have everything listed."
**Task:**
- specific SQL query to check `packages` table vs. what is returned by the API.
- Ensure the frontend loop is not artificially limiting results.

---

## Epic 3: User Guidance & Feedback
**Primary Agent:** `bmm-ux-designer` / `bmm-pm`

### Story 3.1: Home Page Calendar Empty State
**Problem:** "Calendar looks good but it is empty. Is this because I have not signed up for a class?"
**File:** `frontend/src/components/dashboard/UserDashboard.tsx`
**Task:**
- Add a clear "Empty State" message to the calendar component.
- Example: "No classes booked. [Book a Class]" button.

### Story 3.2: Changelog Process
**Problem:** "Not sure if this page is intended to track these kind of issues... I would think we would add a tracking number."
**Task:**
- Establish a convention for the Change Log.
- (Self-Correction): The Change Log page might be for *user-facing* new features, not internal bug tracking. We should clarify this in the UI or actually implement the tracking numbers if desired.

### Story 3.3: Tokens Interaction
**Problem:** "Is this just a little indicator or is this something to click and see?"
**Task:**
- Make the Token indicator in the Nav bar clickable.
- Link it to a "My Credits" or "Purchase History" page.

---

## Next Steps
1. **Approve Plan:** Confirm this breakdown covers the review.
2. **Prioritize:** Suggested start is **Story 2.1 (Token Sync)** and **Story 1.1 (Nav Bar)** as they are high visibility.

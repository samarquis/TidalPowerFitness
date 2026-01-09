# Story 3.1: "Black Glass" Batch Entry Matrix

Status: ready-for-dev

## Story

As a user,
I want to log my sets and reps in a high-speed grid,
so that I can focus on my workout without fighting the UI.

## Acceptance Criteria

1. **Touch-Optimized Matrix**: Given I am in an active workout session, when I enter the logging view for an exercise, then I should see a matrix for Sets, Reps, and Weight optimized for touch interactions (44px+ targets).
2. **Predictive Pre-filling**: The UI must automatically pre-fill Reps and Weight values based on the trainer's plan or the user's last successful set.
3. **Visual Consistency**: The logging matrix must follow the 'Black Glass' visual standard (backdrop-blur, Pacific Cyan accents).
4. **Efficiency Flow**: Tapping 'Complete Set' should automatically advance focus or prepare the next row for entry with minimal clicks.

## Tasks / Subtasks

- [ ] **Frontend: Create BatchEntryMatrix Component** (AC: 1, 3)
  - [ ] Implement a reusable BatchEntryMatrix.tsx component in rontend/src/components/workouts/.
  - [ ] Apply BlackGlassCard and high-contrast typography baseline.
- [ ] **Frontend: Implement Predictive Logic** (AC: 2)
  - [ ] Connect the matrix to the session data to fetch planned_reps and planned_weight_lbs.
  - [ ] Default the input values to these targets on mount.
- [ ] **Frontend: Optimize Interaction Loop** (AC: 1, 4)
  - [ ] Add auto-focus logic or large 'Next' triggers to move between sets.
  - [ ] Ensure the numerical keypad is triggered by default on mobile devices.
- [ ] **Testing: Mobile UX Audit** (AC: 1, 4)
  - [ ] Perform manual testing on a mobile device to verify touch accuracy and entry speed.

## Dev Notes

- **Architecture Pattern**: State-driven grid where each row represents a session_exercise_log entry.
- **Source Tree**:
  - rontend/src/app/workouts/active/page.tsx: Parent container.
  - rontend/src/components/workouts/BatchEntryMatrix.tsx: New component.
- **Testing Standards**:
  - Ensure zero layout shift when adding new rows to the matrix.

### Project Structure Notes

- **Framer Motion**: Use subtle entrance animations for new rows to maintain the "Elite" feel.
- **Numerical Inputs**: Use inputMode="numeric" or 	ype="number" to ensure the correct mobile keyboard.

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#User Journey Flows]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (Managed by BMad create-story workflow)

### Debug Log References

### Completion Notes List

### File List

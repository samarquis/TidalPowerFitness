# Story 2.3: Multi-Day Class Recurrence

Status: ready-for-dev

## Story

As a trainer,
I want to schedule a class for multiple days at once,
so that I don't have to create repetitive entries for recurring sessions.

## Acceptance Criteria

1. **Multi-Day Selection**: Given I am creating or editing a class, when I select multiple days of the week, then the system should save these as a single class entity recurring on all selected days.
2. **Calendar Visibility**: The scheduled class must appear on the correct time slot for every selected day in the master and user calendars.
3. **Attendee Consistency**: Each instance of the recurring class (per day) must have its own independent attendee list based on the specific date.

## Tasks / Subtasks

- [ ] **Backend: Update Class Model** (AC: 1)
  - [ ] Ensure the classes table days_of_week column (integer array) is correctly handled in ackend/src/models/Class.ts.
  - [ ] Update the createClass and updateClass methods to accept and persist the array of day indices.
- [ ] **Frontend: Enhance Class Form** (AC: 1)
  - [ ] Modify rontend/src/app/admin/classes/page.tsx to replace the single day dropdown with a multi-select toggle for days of the week.
  - [ ] Update the form state and submission payload to send the array of selected days.
- [ ] **Frontend: Update Calendar Logic** (AC: 2)
  - [ ] Verify that UserDashboard and other calendar views correctly render classes based on the days_of_week array.
- [ ] **Testing: Recurrence Validation** (AC: 1, 2, 3)
  - [ ] Create a "MWF Strength" class and verify it appears on Monday, Wednesday, and Friday.
  - [ ] Confirm that booking a spot on Monday does not automatically book the user for Wednesday.

## Dev Notes

- **Architecture Pattern**: The days_of_week column is already an INTEGER[] in the schema (from previous migrations).
- **Source Tree**:
  - ackend/src/models/Class.ts: Core data logic.
  - rontend/src/app/admin/classes/page.tsx: Management UI.
- **Testing Standards**:
  - Verify that 	arget_date in the ookings table correctly links to specific instances of the multi-day class.

### Project Structure Notes

- **UX Consistency**: Use the Pacific Cyan toggle style established in the style guide for day selection.
- **Constraint**: Maintain backward compatibility for classes that still have the legacy single day_of_week integer value.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3]
- [Source: backend/src/models/Class.ts#Multi-day support]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (Managed by BMad create-story workflow)

### Debug Log References

### Completion Notes List

### File List

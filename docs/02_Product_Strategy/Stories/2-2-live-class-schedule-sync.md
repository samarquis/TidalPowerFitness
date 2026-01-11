# Story 2.2: Live Class Schedule Sync

Status: done

## Story

As a trainer,
I want to see my assigned classes on my dashboard,
so that I can prepare for my upcoming sessions.

## Acceptance Criteria

1. **Dashboard Visibility**: Given I have classes assigned to me in the database, when I view my Trainer Dashboard, then I should see a chronological list of my classes for the current week.
2. **Real-Time Attendee Count**: Each class must show the current number of registered attendees, updated live via the API.
3. **Role-Based Filtering**: The dashboard must only show classes where the logged-in user is the designated instructor.

## Tasks / Subtasks

- [x] **Backend: Enhance Class Queries** (AC: 3)
  - [ ] Verify ackend/src/controllers/trainerController.ts correctly filters getMyClasses by the authenticated user's ID.
  - [x] Ensure the query includes a JOIN or subquery to count active bookings for each class.
- [x] **Frontend: Update Dashboard UI** (AC: 1, 2)
  - [ ] Modify rontend/src/app/trainer/page.tsx to display the attendee count for each class in the weekly schedule.
  - [x] Implement a 'Refresh' mechanism or ensure the data re-fetches upon dashboard mount.
- [x] **Testing: Verify Data Accuracy** (AC: 1, 2, 3)
  - [x] Create a test class and book a client into it; verify the count increments on the Trainer Dashboard.
  - [x] Confirm that other trainers cannot see these classes on their dashboards.

## Dev Notes

- **Architecture Pattern**: Use the piClient.getMyClasses() method.
- **Source Tree**:
  - rontend/src/app/trainer/page.tsx: Main dashboard component.
  - ackend/src/controllers/trainerController.ts: Logic for class retrieval.
- **Testing Standards**:
  - Verify that the ttendee_count matches the actual rows in the class_participants or ookings table.

### Project Structure Notes

- **UX Consistency**: Ensure the attendee count follows the Pacific Cyan badge style established in the style guide.
- **Constraint**: getMyClasses should handle the current date logic to show only upcoming or 'Today's' sessions prominently.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2]
- [Source: backend/src/routes/trainers.ts#GET /my-classes]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (Managed by BMad create-story workflow)

### Debug Log References

### Completion Notes List

### File List


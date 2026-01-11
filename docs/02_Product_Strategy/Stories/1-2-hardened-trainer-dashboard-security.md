# Story 1.2: Hardened Trainer Dashboard Security

Status: done

## Story

As a trainer,
I want my dashboard data to be fetched using secure HttpOnly cookies,
so that my session is protected from client-side token theft.

## Acceptance Criteria

1. **HttpOnly Authentication**: Given I am logged in as a trainer, when I access the Trainer Dashboard, then all API requests (e.g., GET /api/trainer/classes) must include the 'credentials: include' flag.
2. **Backend Verification**: The backend must verify the identity via HttpOnly JWT cookie rather than an Authorization header.
3. **Persisted Session**: Ensure the session persists across navigation within the dashboard without requiring re-authentication.

## Tasks / Subtasks

- [x] **Frontend: Update Fetch Calls** (AC: 1)
  - [ ] Modify rontend/src/app/trainer/page.tsx to ensure all piClient calls correctly use HttpOnly cookies.
  - [ ] Verify that no Authorization headers are being manually set for these calls.
- [x] **Backend: Verify Cookie Logic** (AC: 2)
  - [ ] Confirm that ackend/src/middleware/auth.ts (or equivalent) correctly extracts the JWT from cookies.
  - [x] Ensure the Trainer Dashboard endpoints are protected by this updated middleware.
- [x] **Testing: Verify Security & Persistence** (AC: 1, 2, 3)
  - [x] Add a unit test or manual verification check to confirm cookies are sent with requests.
  - [x] Verify session persistence after page refreshes.

## Dev Notes

- **Architecture Pattern**: The project has already moved towards HttpOnly cookies. This story standardizes the Trainer Dashboard to this pattern.
- **Source Tree**:
  - rontend/src/app/trainer/page.tsx: Main dashboard component.
  - ackend/src/middleware/auth.ts: Authentication middleware.
  - rontend/src/lib/api.ts: Global API client (already updated to use 'credentials: include').
- **Testing Standards**:
  - Use jest for frontend component tests if applicable.
  - Verify network requests in browser dev tools to ensure no Bearer tokens are present in headers.

### Project Structure Notes

- **Consistency**: All dashboards (Admin, Trainer, User) must follow the same HttpOnly pattern.
- **Constraint**: The piClient in rontend/src/lib/api.ts is already configured with credentials: 'include'. This story focuses on ensuring the specific component logic and backend enforcement are aligned.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- [Source: _bmad-output/project-context.md#Security Rules]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (Managed by BMad create-story workflow)

### Debug Log References

### Completion Notes List

### File List


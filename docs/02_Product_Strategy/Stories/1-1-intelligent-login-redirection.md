# Story 1.1: Intelligent Login Redirection

Status: done

## Story

As a user,
I want to be redirected to my intended page after successful login,
so that I can maintain my workflow without extra navigation.

## Acceptance Criteria

1. **Intelligent Redirect**: Given I am an unauthenticated user attempting to access a protected route (e.g., /workouts/templates/new), when I am redirected to the login page and successfully authenticate, then I should be redirected back to the original requested route instead of the default landing page.
2. **Default Dashboard**: If I access the login page directly without a redirect parameter, I should be sent to my role-specific dashboard (Admin -> /admin, Trainer -> /trainer, Client -> /).
3. **Loop Prevention**: Ensure the redirection logic does not create infinite loops if the target page itself triggers a 401.

## Tasks / Subtasks

- [x] **Frontend: Update Login Logic** (AC: 1, 2)
  - [ ] Modify rontend/src/app/login/page.tsx to extract the edirect query parameter from the URL using useSearchParams.
  - [ ] Update the handleSubmit function to use the edirect parameter as the target path upon successful login.
- [x] **Frontend: Enhance Auth Middleware/Guard** (AC: 1)
  - [x] Review how protected routes redirect to /login (e.g., via piClient interceptors or component-level checks).
  - [x] Ensure the current path is appended as a edirect parameter (e.g., /login?redirect=/current/path).
- [x] **Frontend: Refine Role-Based Defaulting** (AC: 2)
  - [x] Update the default redirect logic in AuthContext or login/page.tsx to respect the existing role-based routing established in rontend/src/app/page.tsx.
- [x] **Testing: Verify Flows** (AC: 1, 2, 3)
  - [x] Add a Jest unit test for LoginPage to verify it correctly reads the edirect param.
  - [x] Perform manual verification of unauthenticated access to /workouts/templates.

## Dev Notes

- **Architecture Pattern**: Use the piClient global 401 interceptor if applicable to centralize redirect logic.
- **Source Tree**:
  - rontend/src/app/login/page.tsx: Primary UI and submission logic.
  - rontend/src/lib/api.ts: Global API client handles auth errors.
  - rontend/src/app/page.tsx: Role-based routing baseline.
- **Testing Standards**:
  - Use jest and @testing-library/react.
  - Ensure useSearchParams is wrapped in Suspense (verified project constraint).

### Project Structure Notes

- **Naming**: Maintain kebab-case for all new routes/files.
- **Redirection**: Use outer.push() or outer.replace() from 
ext/navigation.
- **Constraint**: useSearchParams() MUST be wrapped in a <Suspense> boundary in the parent or same file to prevent build bailout (recently fixed in page.tsx).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]
- [Source: _bmad-output/project-context/project-context.md#Login Loop Prevention]
- [Source: frontend/src/app/page.tsx#Role-Based Redirect Logic]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (Managed by BMad create-story workflow)

### Debug Log References

### Completion Notes List

### File List


---
project_name: 'Tidal Power Fitness'
user_name: 'Scott'
date: 'December 28, 2025'
sections_completed:
  ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 53
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**Frontend:**
*   **Next.js:** 16.0.3
*   **React:** 19.2.0
*   **TypeScript:** 5
*   **Tailwind CSS:** 4
*   **Jest:** 30.2.0

**Backend:**
*   **Express:** 5.1.0
*   **TypeScript:** 5.9.3
*   **PostgreSQL:** (via `pg` driver 8.16.3)
*   **Jest:** 30.2.0
*   **Square:** 43.2.1
*   **jsonwebtoken:** 9.0.2

**E2E Testing:**
*   **Cypress**

**Considerations for User-Friendly System:**
*   Prioritize clear visual hierarchies, intuitive navigation, and minimizing cognitive load for non-tech-savvy users.
*   Implement guided, "wizard-like" steps for complex processes.
*   Define specific user personas and their frequent tasks and pain points.
*   Ensure efficient data fetching, robust error handling, and well-defined API contracts to support smooth frontend experiences.
*   Align development practices with UX principles.

## Phase 2 Strategic Goals (Engagement & Scaling)

*   **Structured Programming:** Move beyond individual workouts to multi-week scheduled programs (Routines).
*   **Media-Rich Library:** Integrated video demonstrations and anatomical mapping for exercises.
*   **Subscription Ecosystem:** Recurring monthly memberships via Square Subscriptions API.
*   **Proactive Engagement:** Centralized notification system for bookings and reminders.
*   **Community & Competition:** Leaderboards and social achievement sharing to drive retention.
*   **Business Intelligence:** Advanced analytics for revenue, retention, and operational capacity.

## Critical Implementation Rules

### Language-Specific Rules (TypeScript/JavaScript)

*   **TypeScript Strict Mode:** Adherence to strict TypeScript configurations to ensure type safety.
*   **Path Aliases:** Utilize path aliases (e.g., `@/`) for cleaner and more maintainable imports, especially in the frontend.
*   **ES Modules:** Consistent use of `import` and `export` for module management. Avoid mixing `require`/`module.exports` with ES `import`/`export` in the same file.
*   **Missing Imports:** Ensure `express` is explicitly imported in all route files where `express.Router()` is used.
*   **Async/Await:** Prefer `async/await` for asynchronous operations, always wrapped in `try/catch` blocks for robust error handling.
*   **Backend Error Handling:** Controllers should return JSON error responses with appropriate HTTP status codes, and log errors for debugging.

### Framework-Specific Rules

**Frontend (React/Next.js):**
*   **Hooks Usage:** Prefer React hooks (`useState`, `useEffect`, custom hooks) for managing component state and side effects.
*   **Component Structure:** Organize components into logical, reusable units. Adhere to Next.js App Router conventions for page components (e.g., `page.tsx`, `layout.tsx`).
*   **Global State Management:** Utilize React Context API, often wrapped in custom hooks (e.g., `useAuth`, `useCart`), for managing global application state.
*   **Styling:** Consistently apply styling using Tailwind CSS classes.

**Backend (Express):**
*   **API Structure:** Design RESTful API endpoints, ensuring clear resource identification and standard HTTP methods.
*   **Middleware Usage:** Employ Express middleware for cross-cutting concerns such as authentication, authorization, logging, and error handling.
*   **Routing:** Define API routes explicitly within the `backend/src/routes` directory, linking them to appropriate controller functions.

### Testing Rules

*   **Unit Testing (Jest):**
    *   Organize unit tests in `__tests__` directories alongside the code they test (e.g., `frontend/src/components/__tests__`, `backend/__tests__`).
    *   Utilize Jest's mocking capabilities to isolate components and functions during unit tests.
    *   Focus on testing individual units of code (functions, components, modules) in isolation.
*   **End-to-End Testing (Cypress):**
    *   Organize E2E tests in the `cypress/e2e` directory.
    *   Focus on simulating full user flows and interactions across the application.
    *   Ensure critical user journeys are covered by E2E tests.
*   **Test Coverage:** Aim for high test coverage for critical business logic and components, ensuring reliability and maintainability.
*   **Integration Testing:** (Implicitly covered by Jest and Cypress, but can be a separate focus if needed)

### Development Workflow Rules

*   **Version Control (GitHub):** All code changes are managed through GitHub, which serves as the primary repository for the project.
*   **Deployment (Render):** The application is hosted on Render, which is configured to monitor the GitHub repository for new pushes to trigger deployments automatically.
*   **Local Development Environment:**
    *   **Database Setup:** A local PostgreSQL 15 instance should be installed and configured.
    *   **Database Tools:** Use full paths to PostgreSQL binaries if not in PATH (e.g., `C:\Program Files\PostgreSQL\15\bin\psql.exe`).
    *   **Schema Application:** Prefer manual application of the initial schema (`001_initial_schema.sql`) if automatic migrations encounter duplicate type errors.
    *   The goal is to enable running the entire application locally for development and testing purposes, reducing reliance on the deployed Render site for immediate feedback on changes.
*   **Branching Strategy (Git Flow Lite):**
    *   `main`: Represents the production-ready code. Only stable, tested releases are merged here.
    *   `develop`: Integration branch for ongoing development. All new features and bug fixes are merged into `develop` first.
    *   `feature/<feature-name>`: Branches for new features, branched off `develop` and merged back into `develop` upon completion.
    *   `bugfix/<bug-description>`: Branches for bug fixes, branched off `develop` (or `main` for critical hotfixes) and merged back into `develop` (or `main`) upon completion.
*   **Commit Message Format (Conventional Commits):** Follow the Conventional Commits specification for clear and automated changelog generation.
    *   `type(scope): <description>`
    *   Examples: `feat(auth): add user registration`, `fix(login): resolve redirect issue`, `docs(readme): update setup instructions`.
*   **Pull Request Requirements:** (To be defined, including code reviews, passing tests, etc.).

### Critical Don't-Miss Rules

*   **Anti-Patterns to Avoid:**
    *   **Direct DOM Manipulation (Frontend):** Avoid direct manipulation of the DOM in React components; instead, leverage React's state and props for UI updates.
    *   **Unparameterized SQL Queries (Backend):** NEVER concatenate user input directly into SQL queries; always use parameterized queries to prevent SQL injection.
    *   **Hardcoding Sensitive Information:** Do not hardcode API keys, secrets, or other sensitive credentials directly in the codebase. Use environment variables.
*   **Edge Cases:**
    *   **Empty States:** Design and implement clear empty states for lists, data displays, and search results to guide users.
    *   **Network Errors:** Provide user-friendly feedback for network connectivity issues or API failures.
    *   **Invalid User Input:** Implement robust frontend validation and clear error messages, backed by backend validation, to guide users in correcting their input.
*   **Security Rules:**
    *   **JWT Best Practices:** Store JWTs securely (e.g., HttpOnly cookies), ensure proper expiration, and validate them on the backend for every protected route.
    *   **Access Control:** Implement granular role-based access control (RBAC) on the backend for all sensitive operations and data access.
    *   **Input Validation:** Perform server-side validation for all incoming data, in addition to frontend validation, to protect against malicious input.
*   **Authentication & Rate Limiting Rules:**
    *   **Local Rate Limits:** Relax backend rate limits in `backend/src/middleware/rateLimit.ts` when `NODE_ENV === 'development'` to allow up to 1,000 authentication attempts per hour.
    *   **Environment Loading:** Always call `dotenv.config()` as the first line of the application entry point (`backend/src/index.ts`) or early in `app.ts` to ensure configuration is available to all middleware during initialization.
    *   **Login Loop Prevention:** In the frontend `apiClient` (global 401 interceptor), skip automatic redirects to `/login` if the user is already on the login page to prevent infinite refresh cycles.
*   **Performance Gotchas:**
    *   **Frontend Bundle Size:** Monitor and optimize frontend bundle sizes to ensure fast loading times, especially for mobile users.
    *   **Inefficient Database Queries:** Profile and optimize complex database queries to prevent performance bottlenecks.
    *   **Excessive Re-renders (Frontend):** Optimize React components to prevent unnecessary re-renders, using `React.memo` or `useCallback`/`useMemo` where appropriate.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: December 28, 2025

*   **Database Operations (Critical Anti-Pattern):**
    *   **Shell Variable Expansion in SQL:** When running SQL commands via command line (e.g., `psql -c "UPDATE..."`), **NEVER** include strings with `$` characters (like bcrypt hashes) directly in the command. Shells (PowerShell/Bash) will interpret `$var` as a variable and replace it (often with an empty string), causing silent data corruption (e.g., truncated password hashes).
    *   **Resolution:** Always use a separate SQL file (`.sql`) for updates involving special characters and execute it using `-f filename.sql`.

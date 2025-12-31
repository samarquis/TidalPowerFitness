---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-phase-2-planning"]
inputDocuments: []
---

# Tidal Power Fitness - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Tidal Power Fitness, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: As a user, I want to be redirected to my intended destination after successful login, rather than always to `/trainers`.
FR2: As a trainer/admin, I want the Trainer Dashboard to use secure HttpOnly cookies for authentication, replacing deprecated Bearer tokens.
FR3: As a trainer, I want the Availability Page to load correctly without compilation errors due to missing imports.
FR4: As a trainer, I want the Availability Page's fetch calls to use consistent HttpOnly cookie authentication.
FR5: As an admin, I want the User Management UI table to be responsive and usable on smaller screens without overflow issues.
FR6: As an admin, I want the Trainer Edit Profile button to function correctly.
FR7: As a user, I want to be able to create a workout template, log in, and be redirected back to template creation.
FR8: As a user, I want to be able to view my workout history, log in, and be redirected back to my workout history.
FR9: As a trainer, I want to view my assigned classes correctly on the Trainer Dashboard.
FR10: As a trainer, I want to be able to create, edit, and delete availability slots.
FR11: As an admin, I want the user management table to be fully functional on mobile devices.
FR12: As a trainer, I want to be able to view workout data for my assigned clients.
FR13: As a user, I want to be able to purchase a package, receive credits, sign up for a class, attend the class, and view the records of my attendance and workout.

### NonFunctional Requirements

NFR1: The system must maintain consistent authentication across all pages using HttpOnly cookie patterns.
NFR2: The User Management UI must be responsive and usable on all screen sizes, including mobile.
NFR3: The system must enforce authorization such that trainers can only view data for their own assigned clients.
NFR4: The system must adhere to TypeScript strict mode for enhanced type safety.
NFR5: The backend must provide robust error handling, returning JSON error responses with appropriate HTTP status codes and logging errors.
NFR6: The system must prevent SQL injection vulnerabilities through the use of parameterized SQL queries.
NFR7: JSON Web Tokens (JWTs) must be stored securely (e.g., HttpOnly cookies) and validated on the backend for every protected route.
NFR8: The system must implement granular role-based access control (RBAC) for all sensitive operations and data access.
NFR9: The frontend application must have an optimized bundle size to ensure fast loading times.
NFR10: Database queries must be efficient to prevent performance bottlenecks.
NFR11: React components must be optimized to prevent excessive re-renders, ensuring a smooth user experience.

### Additional Requirements

AR1: Frontend: Update `frontend/src/app/login/page.tsx` to change default redirect to `/`.
AR2: Frontend: Update Trainer Dashboard (`frontend/src/app/trainer/page.tsx`) to replace `Authorization` headers with `credentials: 'include'` for fetch calls.
AR3: Frontend: Add `import Link from 'next/link';` to `frontend/src/app/trainer/availability/page.tsx`.
AR4: Frontend: Update Availability Page (`frontend/src/app/trainer/availability/page.tsx`) fetch calls to use `credentials: 'include'`.
AR5: Frontend: Refactor `frontend/src/app/admin/users/page.tsx` for responsive table layout on smaller screens.
AR6: Investigation: Locate trainer edit profile page (likely `/app/trainer/profile` or `/app/admin/trainers`), verify API endpoint, form submission handler, check for console errors, and ensure proper authentication.
AR7: Backend: Create `trainer_clients` table in the database to establish trainer-client relationships.
AR8: Backend API: Implement `GET /api/trainers/:trainerId/clients` to list a trainer's assigned clients.
AR9: Backend API: Implement `GET /api/clients/:clientId/workouts` to retrieve a client's workout history.
AR10: Frontend: Add a "My Clients" section to the trainer dashboard.
AR11: Frontend: Develop a client detail page displaying workout history.
AR12: Frontend: Implement workout session details view with exercises, sets, reps, and weights.
AR13: Testing: Create a comprehensive test script or checklist to verify the complete purchasing process flow.
AR14: Backend API: Verify `POST /api/payments/checkout-cart` for package purchase processing.
AR15: Backend API: Verify `POST /api/bookings` for class booking.
AR16: Backend API: Verify `GET /api/bookings/user/:userId` for fetching user bookings.
AR17: Backend API: Verify `GET /api/workout-sessions` for fetching workout history.
AR18: Backend API: Verify/Implement `POST /api/workout-sessions/:id/log` for logging workout sessions.
AR19: Local Environment: Set up a local PostgreSQL instance.
AR20: Local Environment: Create and seed local database tables.
AR21: Local Environment: Ensure the frontend and backend applications can run entirely locally.

### FR Coverage Map

FR1: Epic 1 - User Authentication & Onboarding Experience (User redirection after login)
FR2: Epic 2 - Trainer Dashboard & Class Management (Trainer Dashboard authentication)
FR3: Epic 2 - Trainer Dashboard & Class Management (Availability Page compilation error)
FR4: Epic 2 - Trainer Dashboard & Class Management (Availability Page consistent authentication)
FR5: Epic 4 - User Management & Administrative Tools (User Management UI responsiveness)
FR6: Epic 4 - User Management & Administrative Tools (Trainer Edit Profile button functionality)
FR7: Epic 1 - User Authentication & Onboarding Experience (Redirect after workout template creation)
FR8: Epic 1 - User Authentication & Onboarding Experience (Redirect after workout history view)
FR9: Epic 2 - Trainer Dashboard & Class Management (View assigned classes)
FR10: Epic 2 - Trainer Dashboard & Class Management (Create, edit, delete availability slots)
FR11: Epic 4 - User Management & Administrative Tools (User management table on mobile)
FR12: Epic 3 - Client Data Management for Trainers (View client workout data)
FR13: Epic 5 - Purchasing & Credit System (Full purchasing process)

### Phase 2 Functional Requirements

FR14: As a trainer, I want to create multi-week workout programs (Routines) that I can assign to clients.
FR15: As a user, I want to follow a structured program assigned by my trainer and see my progress throughout the program.
FR16: As a user, I want to see exercise demonstration videos and detailed instructions within the exercise library.
FR17: As a user, I want to receive email notifications for class bookings, cancellations, and workout reminders.
FR18: As a user, I want to subscribe to a monthly membership that provides recurring credits or unlimited access.
FR19: As a user, I want to see how I rank on class leaderboards for specific metrics (e.g., volume, attendance).
FR20: As an admin, I want to see detailed business analytics, including revenue reports and client retention data.

### FR Coverage Map

FR1: Epic 1 - User Authentication & Onboarding Experience (User redirection after login)
FR2: Epic 2 - Trainer Dashboard & Class Management (Trainer Dashboard authentication)
FR3: Epic 2 - Trainer Dashboard & Class Management (Availability Page compilation error)
FR4: Epic 2 - Trainer Dashboard & Class Management (Availability Page consistent authentication)
FR5: Epic 4 - User Management & Administrative Tools (User Management UI responsiveness)
FR6: Epic 4 - User Management & Administrative Tools (Trainer Edit Profile button functionality)
FR7: Epic 1 - User Authentication & Onboarding Experience (Redirect after workout template creation)
FR8: Epic 1 - User Authentication & Onboarding Experience (Redirect after workout history view)
FR9: Epic 2 - Trainer Dashboard & Class Management (View assigned classes)
FR10: Epic 2 - Trainer Dashboard & Class Management (Create, edit, delete availability slots)
FR11: Epic 4 - User Management & Administrative Tools (User management table on mobile)
FR12: Epic 3 - Client Data Management for Trainers (View client workout data)
FR13: Epic 5 - Purchasing & Credit System (Full purchasing process)
FR14: Epic 13 - Structured Training Programs (Create program templates)
FR15: Epic 13 - Structured Training Programs (Follow assigned programs)
FR16: Epic 14 - Enhanced Exercise Library & Media (Video and instructions)
FR17: Epic 15 - Communications & Notifications (Email notifications)
FR18: Epic 16 - Subscription Membership Models (Monthly memberships)
FR19: Epic 17 - Community & Gamification v2 (Leaderboards)
FR20: Epic 18 - Advanced Business Analytics (Revenue and retention)


## Epic List

### Epic 1: User Authentication & Onboarding Experience
**Goal:** Enable users to seamlessly register, log in, and be redirected to their intended destinations, ensuring a smooth initial interaction with the platform.
**FRs covered:** FR1, FR7, FR8

### Epic 2: Trainer Dashboard & Class Management
**Goal:** Provide trainers with a fully functional and secure dashboard for managing their classes and availability, allowing them to efficiently run their operations.
**FRs covered:** FR2, FR3, FR4, FR9, FR10

### Epic 3: Client Data Management for Trainers
**Goal:** Enable trainers to securely view and manage their assigned clients' workout data, fostering better client-trainer relationships and progress tracking.
**FRs covered:** FR12

### Epic 4: User Management & Administrative Tools
**Goal:** Provide administrators with effective tools to manage users and ensure the platform's stability and maintainability, including responsive user interfaces.
**FRs covered:** FR5, FR6, FR11

### Epic 5: Purchasing & Credit System
**Goal:** Implement a robust purchasing process that allows users to acquire packages and credits, enroll in classes, and track their transactional history.
**FRs covered:** FR13

### Epic 6: Local Development Environment Setup
**Goal:** Establish a fully functional local development environment that allows developers to run and test the application locally, reducing reliance on the deployed site.
**FRs covered:** (None directly, but enables development for all FRs)

### Epic 7: Deployment and Operations
**Goal:** Ensure the application can be reliably deployed, maintained, and operated in production environments, addressing critical migration and error handling needs.
**FRs covered:** (None directly, but addresses critical infrastructure and operational needs)

### Epic 8: Security and Data Integrity
**Goal:** Enhance the application's security posture and data reliability through robust input validation, access controls, and protection against common vulnerabilities.
**FRs covered:** (None directly, but addresses critical security and data integrity NFRs)

### Epic 9: Frontend Enhancements and Robustness
**Goal:** Improve the user experience and application stability by implementing UI/UX enhancements and robust error handling mechanisms in the frontend.
**FRs covered:** (None directly, but addresses critical UX and stability NFRs)

### Epic 10: Reporting and Analytics
**Goal:** Provide trainers and administrators with comprehensive reports and analytics to track class attendance, client progress, and overall business metrics.
**FRs covered:** (None directly, but addresses reporting needs)

### Epic 11: Comprehensive Testing
**Goal:** Establish a robust testing strategy and implement various levels of automated tests to ensure the quality, reliability, and functionality of the application.
**FRs covered:** (None directly, but crucial for software quality)

### Epic 12: Luxury Polish & Future Growth
**Goal:** Elevate the platform from functional to world-class by adding micro-interactions, personalization, and advanced web capabilities.
**FRs covered:** Growth & Retention

### Epic 13: Structured Training Programs
**Goal:** Enable trainers to create and assign multi-week workout programs to clients, providing a long-term structured approach to fitness.
**FRs covered:** FR14, FR15

### Epic 14: Enhanced Exercise Library & Media
**Goal:** Enrich the exercise library with instructional videos, detailed descriptions, and muscle group mapping to improve user guidance and safety.
**FRs covered:** FR16

### Epic 15: Communications & Notifications
**Goal:** Implement a robust communication and notification system to keep users engaged and informed about their schedule and progress.
**FRs covered:** FR17

### Epic 16: Subscription Membership Models
**Goal:** Transition to a recurring revenue model by supporting monthly memberships with automatic billing and tiered access.
**FRs covered:** FR18

### Epic 17: Community & Gamification v2
**Goal:** Foster a sense of community and healthy competition through leaderboards, social sharing, and collective challenges.
**FRs covered:** FR19

### Epic 18: Advanced Business Analytics
**Goal:** Provide administrators and trainers with deep insights into business performance, client engagement, and operational efficiency.
**FRs covered:** FR20

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

<h2>Epic 1: User Authentication & Onboarding Experience</h2>
**Goal:** Enable users to seamlessly register, log in, and be redirected to their intended destinations, ensuring a smooth initial interaction with the platform.
**FRs covered:** FR1, FR7, FR8

<h3>[COMPLETED] Story 1.1: User Login & Redirect to Intended Page</h3>

As a user,
I want to log in and be automatically redirected to the page I was trying to access,
So that I can continue my intended workflow seamlessly.

**Acceptance Criteria:**
*   **Given** I am on the login page with a `redirect` query parameter (e.g., `/login?redirect=/workouts/templates/new`).
*   **When** I successfully log in.
*   **Then** I should be redirected to the URL specified in the `redirect` parameter.
*   **And** if no `redirect` parameter is present, I should be redirected to the home page (`/`).

<h3>[COMPLETED] Story 1.2: User Registration</h3>

As a new user,
I want to register for an account with my email, password, and personal details,
So that I can access the platform's features.

**Acceptance Criteria:**
*   **Given** I am on the registration page.
*   **When** I provide valid email, password (meeting strength requirements), first name, and last name.
*   **Then** my account should be created successfully with a default 'client' role.
*   **And** I should be automatically logged in and redirected to the home page.
*   **And** my password should be securely hashed in the database.

<h2>Epic 2: Trainer Dashboard & Class Management</h2>
**Goal:** Provide trainers with a fully functional and secure dashboard for managing their classes and availability, allowing them to efficiently run their operations.
**FRs covered:** FR2, FR3, FR4, FR9, FR10

<h3>[COMPLETED] Story 2.1: Trainer Dashboard Secure Authentication</h3>

As a trainer,
I want my dashboard to use secure HttpOnly cookies for authentication,
So that my session is protected and I can access my features reliably.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer.
*   **When** I access the Trainer Dashboard (`/trainer`).
*   **Then** the dashboard should load successfully.
*   **And** all API calls from the dashboard (e.g., to fetch assigned classes) should use HttpOnly cookies for authentication, not `Authorization` headers.
*   **And** my session should persist across navigation within the dashboard without requiring re-authentication.

<h3>[COMPLETED] Story 2.2: Availability Page Functional & Secure</h3>

As a trainer,
I want the Availability Page to load correctly and handle authentication securely,
So that I can manage my availability without errors or security vulnerabilities.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer.
*   **When** I navigate to the Availability Page (`/trainer/availability`).
*   **Then** the page should load without any compilation errors.
*   **And** any necessary `Link` imports should be correctly added to `frontend/src/app/trainer/availability/page.tsx`.
*   **And** all fetch calls originating from the Availability Page should use HttpOnly cookies for authentication (by setting `credentials: 'include'`).
*   **And** I should be able to view my current availability slots.

<h3>[COMPLETED] Story 2.3: View Assigned Classes on Trainer Dashboard</h3>

As a trainer,
I want to view a clear and accurate list of my assigned classes on the Trainer Dashboard,
So that I can keep track of my schedule and upcoming sessions.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer.
*   **When** I access the Trainer Dashboard (`/trainer`).
*   **Then** I should see a section displaying my assigned classes.
*   **And** each class entry should show relevant details such as class name, date, time, and client count.
*   **And** the list should accurately reflect all classes assigned to me.
*   **And** if I have no assigned classes, a message indicating this should be displayed.

<h3>[COMPLETED] Story 2.4: Manage Availability Slots</h3>

As a trainer,
I want to be able to create, edit, and delete my availability slots on the Availability Page,
So that I can effectively manage my schedule and open myself up for class bookings.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer on the Availability Page (`/trainer/availability`).
*   **When** I interact with the interface to create a new availability slot (e.g., select date, time, duration).
*   **Then** the new availability slot should be successfully created and displayed on my calendar.
*   **And** when I interact with an existing availability slot to edit its details.
*   **Then** the changes should be successfully updated and reflected on my calendar.
*   **And** when I choose to delete an existing availability slot.
*   **Then** the slot should be removed from my calendar.
*   **And** appropriate error messages should be displayed if any operation fails (e.g., trying to create a slot that overlaps with an existing one).

<h3>[COMPLETED] Story 2.5: Implement Calendar View for Classes</h3>

As a trainer,
I want to view my assigned classes in a calendar format,
So that I can easily visualize my schedule and manage my time.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer.
*   **When** I access the Trainer Dashboard or a dedicated "Calendar" view.
*   **Then** I should see a calendar displaying my assigned classes.
*   **And** each class should show its name, time, and client count on the calendar.
*   **And** I should be able to navigate through different days/weeks/months in the calendar.

<h2>Epic 3: Client Data Management for Trainers</h2>
**Goal:** Enable trainers to securely view and manage their assigned clients' workout data, fostering better client-trainer relationships and progress tracking.
**FRs covered:** FR12

<h3>[COMPLETED] Story 3.1: View Assigned Clients on Trainer Dashboard</h3>

As a trainer,
I want to view a list of all clients assigned to me on the Trainer Dashboard,
So that I can easily access their profiles and manage their data.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer.
*   **When** I access the Trainer Dashboard (`/trainer`).
*   **Then** I should see a dedicated "My Clients" section.
*   **And** this section should display a list of all clients specifically assigned to me.
*   **And** for each client, their name and basic identifying information should be visible.
*   **And** I should only be able to see clients assigned to me, not other trainers' clients (NFR3).
*   **And** clicking on a client's name or a dedicated link should lead to their client detail page.

<h3>[COMPLETED] Story 3.2: Client Detail Page with Workout History</h3>

As a trainer,
I want to view a dedicated client detail page that displays their workout history,
So that I can effectively track their progress and plan future training sessions.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer.
*   **When** I navigate to a client's detail page (e.g., by clicking on a client from the "My Clients" list).
*   **Then** I should see the client's profile information.
*   **And** I should see a chronological list of their past workout sessions.
*   **And** each workout session entry should display key information such as date, workout type, and a summary.
*   **And** clicking on a specific workout session should allow me to view its detailed breakdown (exercises, sets, reps, weights).
*   **And** I should only be able to view workout data for clients assigned to me (NFR3).

<h3>[COMPLETED] Story 3.3: Implement Client Progress Dashboard with Motivational Metrics</h3>

As a user,
I want to view a personalized dashboard with motivational metrics and progress tracking,
So that I can stay motivated and understand my fitness journey.

**Acceptance Criteria:**
*   **Given** I am a logged-in user.
*   **When** I access my client dashboard.
*   **Then** I should see an overview of my progress (e.g., total workouts, personal records).
*   **And** motivational messages or visualizations should be present.
*   **And** trainers should be able to view these metrics for their assigned clients (linking to Epic 3 goal).

<h2>Epic 4: User Management & Administrative Tools</h2>
**Goal:** Provide administrators with effective tools to manage users and ensure the platform's stability and maintainability, including responsive user interfaces.
**FRs covered:** FR5, FR6, FR11

<h3>[COMPLETED] Story 4.1: Responsive User Management Table</h3>

As an admin,
I want the user management table to be fully responsive and usable on all screen sizes,
So that I can effectively manage users from any device without layout issues.

**Acceptance Criteria:**
*   **Given** I am a logged-in administrator.
*   **When** I access the User Management page (`/admin/users`).
*   **Then** the user table should adapt its layout and display of information to fit various screen sizes (e.g., desktop, tablet, mobile).
*   **And** horizontal scrolling should be avoided where possible on smaller screens, perhaps by collapsing columns or providing a detail view.
*   **And** all user management actions (e.g., edit, delete) should be accessible and functional regardless of screen size.
*   **And** the `frontend/src/app/admin/users/page.tsx` component should be refactored to implement a responsive table design.

<h3>[COMPLETED] Story 4.2: Admin Trainer Profile Editing</h3>

As an admin,
I want to be able to correctly edit a trainer's profile information,
So that I can maintain accurate trainer data and resolve any issues.

**Acceptance Criteria:**
*   **Given** I am a logged-in administrator on the User Management page.
*   **When** I select a trainer from the list and attempt to edit their profile.
*   **Then** the trainer's profile editing form should load correctly.
*   **And** after making changes and submitting the form, the trainer's profile information should be successfully updated in the system.
*   **And** appropriate feedback should be provided (e.g., success message or error message if update fails).
*   **And** any underlying issues preventing the "Trainer Edit Profile" button from functioning (FR6) should be resolved.
*   **And** the editing process should enforce proper authentication and authorization.

<h2>Epic 5: Purchasing & Credit System</h2>
**Goal:** Implement a robust purchasing process that allows users to acquire packages and credits, enroll in classes, and track their transactional history.
**FRs covered:** FR13

<h3>[COMPLETED] Story 5.1: Purchase Package and Receive Credits</h3>

As a user,
I want to be able to purchase a package and receive the corresponding credits,
So that I can pay for classes and access premium features.

**Acceptance Criteria:**
*   **Given** I am a logged-in user on the package purchase page.
*   **When** I select a package and complete the payment process.
*   **Then** my account should be debited for the package cost.
*   **And** my account should be credited with the number of credits associated with the purchased package.
*   **And** a confirmation of the successful purchase should be displayed.
*   **And** the backend API endpoint `POST /api/payments/checkout-cart` should successfully process the package purchase.

<h3>[COMPLETED] Story 5.2: Sign Up for Class Using Credits</h3>

As a user,
I want to be able to sign up for an available class using my accumulated credits,
So that I can schedule my training and utilize my purchased packages.

**Acceptance Criteria:**
*   **Given** I am a logged-in user with sufficient credits.
*   **When** I browse available classes and select one to sign up for.
*   **Then** my account should be debited by the required number of credits for the class.
*   **And** I should receive a confirmation of my class enrollment.
*   **And** the class should appear in my schedule or booked classes list.
*   **And** the backend API endpoint `POST /api/bookings` should successfully process the class booking.
*   **And** if I do not have enough credits, I should be informed and prevented from booking.

<h3>[COMPLETED] Story 5.3: View Class Bookings and Attendance Records</h3>

As a user,
I want to view a history of my class bookings and attendance records,
So that I can keep track of my training progress and past activities.

**Acceptance Criteria:**
*   **Given** I am a logged-in user.
*   **When** I navigate to my personal dashboard or a "My Classes" section.
*   **Then** I should see a list of all classes I have booked, both past and upcoming.
*   **And** for past classes, an indicator of my attendance (e.g., attended, no-show) should be displayed.
*   **And** I should be able to view details for each class, including date, time, and trainer.
*   **And** the backend API endpoint `GET /api/bookings/user/:userId` should successfully retrieve my booking history.

<h3>[COMPLETED] Story 5.4: Log and View Personal Workout Records</h3>

As a user,
I want to view my personal workout records, and have a mechanism (potentially through a trainer) to log my workouts,
So that I can track my fitness journey and see my progress over time.

**Acceptance Criteria:**
*   **Given** I am a logged-in user.
*   **When** I access my personal workout history section.
*   **Then** I should see a chronological list of my recorded workouts.
*   **And** for each workout, I should be able to view details such as exercises, sets, reps, and weights.
*   **And** there should be a mechanism for workouts to be logged (e.g., by a trainer after a session or self-logged if applicable).
*   **And** the backend API endpoints `GET /api/workout-sessions` and `POST /api/workout-sessions/:id/log` should support this functionality.

<h3>[COMPLETED] Story 5.5: Support Multi-Attendee Class Bookings</h3>

As a user,
I want to be able to book a class for multiple attendees (e.g., myself and a friend),
So that I can easily arrange group sessions.

**Acceptance Criteria:**
*   **Given** I am a logged-in user with sufficient credits.
*   **When** I select a class to book.
*   **Then** I should have an option to specify the number of attendees.
*   **And** if I book for multiple attendees, my account should be debited by the corresponding number of credits.
*   **And** each attendee should be correctly registered for the class.
*   **And** the system should ensure there are enough available slots for all attendees.

<h3>[COMPLETED] Story 5.6: Display User Credits Across Application</h3>

As a user,
I want to see my current credit balance on my profile, dashboard, and class schedule pages,
So that I am always aware of my available purchasing power.

**Acceptance Criteria:**
*   **Given** I am a logged-in user.
*   **When** I view my profile, dashboard, or the class schedule.
*   **Then** my current credit balance should be clearly displayed.
*   **And** the credit balance should update in real-time after purchases or bookings.
*   **And** a standardized API endpoint should provide the user's credit information.

<h2>Epic 6: Local Development Environment Setup</h2>
**Goal:** Establish a fully functional local development environment that allows developers to run and test the application locally, reducing reliance on the deployed site.
**FRs covered:** (None directly, but enables development for all FRs)

<h3>[COMPLETED] Story 6.1: Local Database Setup and Seeding</h3>

As a developer,
I want to easily set up a local PostgreSQL 15 instance and seed it with initial data,
So that I can develop and test the application without relying on a remote database.

**Acceptance Criteria:**
*   **Given** I am a developer with local PostgreSQL 15 installed.
*   **When** I follow the setup instructions (using full paths to `psql.exe` if not in PATH).
*   **Then** a local PostgreSQL database instance (`tidal_power_fitness`) should be running and accessible.
*   **And** the database should be populated with necessary schema (`001_initial_schema.sql`) and seed data (`seed.sql`).
*   **And** any redundant or conflicting migration files (like `006_add_is_demo_mode_enabled_to_users.sql`) should be removed or ignored.
*   **And** I should be able to connect to this database from both the backend and frontend applications.
*   **And** functional credentials should be provided for seeded users (e.g., placeholder "Z" hashes replaced with valid bcrypt hash for 'admin123').
*   **And** the `init-database.html`, `run-migration.html`, `seed-database.html` (if exists) or similar scripts should be functional for this setup.

<h3>[COMPLETED] Story 6.2: Local Backend Application Setup</h3>

As a developer,
I want to be able to run the backend application locally,
So that I can develop and test API endpoints and server-side logic.

**Acceptance Criteria:**
*   **Given** I have completed Story 6.1 (local database is set up).
*   **When** I follow the instructions to start the backend application locally.
*   **Then** the backend server should start successfully.
*   **And** it should connect to the local PostgreSQL database.
*   **And** it should expose its API endpoints for the frontend to consume.
*   **And** there should be clear instructions on how to start and stop the backend.

<h3>[COMPLETED] Story 6.3: Local Frontend Application Setup</h3>

As a developer,
I want to be able to run the frontend application locally,
So that I can develop and test the user interface and client-side logic.

**Acceptance Criteria:**
*   **Given** I have completed Story 6.1 (local database is set up) and Story 6.2 (local backend is running).
*   **When** I follow the instructions to start the frontend application locally.
*   **Then** the frontend application should start successfully.
*   **And** it should connect to the local backend API endpoints.
*   **And** I should be able to navigate through the application and interact with its features.
*   **And** there should be clear instructions on how to start and stop the frontend.

<h3>[COMPLETED] Story 6.4: Validate Required Environment Variables</h3>

As a developer,
I want required environment variables to be validated on application startup,
So that missing or incorrectly configured variables are caught early, preventing runtime errors.

**Acceptance Criteria:**
*   **Given** The application starts up.
*   **When** Environment variables are loaded.
*   **Then** all critical environment variables (e.g., `DATABASE_URL`, `JWT_SECRET`) should be checked for presence and correct format.
*   **And** if any required environment variable is missing or invalid, the application should fail to start with a clear error message.
*   **And** this validation should apply to both local development and deployment environments.

<h3>[COMPLETED] Story 6.5: Resolve Backend Stability and Mixed Module Issues</h3>

As a developer,
I want the backend application to compile and run without errors related to missing imports or mixed CommonJS/ESM syntax,
So that development is stable and the server remains operational.

**Acceptance Criteria:**
*   **Given** The backend application is using ES modules.
*   **When** The server starts using `ts-node` or `nodemon`.
*   **Then** all route and controller files must have correct `import` statements (e.g., `import express from 'express'`).
*   **And** mixed syntax (using `require` and `module.exports` alongside `import`/`export`) must be eliminated from core route files (`bookings`, `availability`, `workoutSessions`).
*   **And** the application should start without TypeScript compiler crashes (e.g., bypassing misleading Square API type errors by fixing root source errors).
*   **And** backend rate limits should be significantly relaxed in development mode to prevent blocking during legitimate testing.
*   **And** the frontend should not enter an infinite refresh cycle on the login page when encountering 401 Unauthorized errors.

<h2>Epic 7: Deployment and Operations</h2>
**Goal:** Ensure the application can be reliably deployed, maintained, and operated in production environments, addressing critical migration and error handling needs.
**FRs covered:** (None directly, but addresses critical infrastructure and operational needs)

<h3>[COMPLETED] Story 7.1: Verify Production Database Migrations</h3>

As an administrator,
I want to apply and verify production database migrations (010 and 011) via the admin UI,
So that `user_roles` table changes are correctly implemented and the application functions as expected in production.

**Acceptance Criteria:**
*   **Given** The application is deployed to a production environment.
*   **When** I access the Migration Page (`/admin/migrations`) in the admin UI.
*   **Then** I should see an option to apply pending migrations, specifically 010 and 011.
*   **And** when I apply migrations 010 and 011.
*   **Then** the database schema should be updated successfully to include the `user_roles` table and related changes.
*   **And** the application should remain functional after applying the migrations.
   **And** appropriate success or error messages should be displayed after the migration attempt.

<h3>[COMPLETED] Story 7.2: Global API Error Interceptor (401/403)</h3>

As a developer,
I want a global API error interceptor to automatically handle 401 (Unauthorized) and 403 (Forbidden) responses,
So that user authentication issues are managed gracefully and consistently across the application.

**Acceptance Criteria:**
*   **Given** A user performs an action that results in a 401 (Unauthorized) API response.
*   **When** The API call returns a 401 status code.
*   **Then** the global error interceptor should detect this and automatically log out the user or redirect them to the login page.
*   **And** appropriate notification (e.g., a toast message) should inform the user about the session expiration or unauthorized access.
*   **Given** A user performs an action that results in a 403 (Forbidden) API response.
*   **When** The API call returns a 403 status code.
*   **Then** the global error interceptor should detect this and display an appropriate message to the user, indicating they do not have permission.
*   **And** the interceptor should be implemented in both the frontend `apiClient` and potentially the backend for consistent error handling.

<h3>[COMPLETED] Story 7.3: Implement Centralized Logging</h3>

As a developer,
I want to replace `console.log` with a proper logging solution,
So that application events and errors can be consistently captured, monitored, and debugged in all environments.

**Acceptance Criteria:**
*   **Given** I am developing the application.
*   **When** I need to log information, warnings, or errors.
*   **Then** I should use the configured centralized logging utility instead of `console.log`.
*   **And** the logging solution should support different log levels (e.g., debug, info, warn, error).
*   **And** logs from both frontend and backend should be captured in a consistent manner.
*   **And** sensitive information should not be logged.

<h3>[COMPLETED] Story 7.4: Configure Database Connection Pooling</h3>

As a developer,
I want to configure database connection pooling for the backend,
So that database resource usage is optimized, performance is improved, and the application's stability is enhanced under load.

**Acceptance Criteria:**
*   **Given** The backend application connects to the PostgreSQL database.
*   **When** Multiple concurrent requests access the database.
*   **Then** a connection pool should manage database connections efficiently.
*   **And** the connection pool should have configurable parameters (e.g., `max` connections, `min` connections, `idleTimeoutMillis`).
*   **And** connection errors should be handled gracefully, preventing application crashes.

<h3>[COMPLETED] Story 7.5: Implement Database Indexes for Performance</h3>

As a database administrator,
I want to add appropriate database indexes to frequently queried columns,
So that database query performance is significantly improved and bottlenecks are reduced.

**Acceptance Criteria:**
*   **Given** There are frequently queried columns (e.g., user email, booking IDs, session dates).
*   **When** Database queries are executed against these columns.
*   **Then** an index should be present to optimize query speed.
*   **And** the impact of new indexes on write operations should be considered.
*   **And** indexes should be added for columns like user email, booking IDs, and session dates where appropriate.

<h3>[COMPLETED] Story 7.6: Implement API Request Timeout Handling</h3>

As a developer,
I want to implement request timeout handling for all API requests,
So that the application remains responsive and avoids hanging indefinitely due to slow or unresponsive external services.

**Acceptance Criteria:**
*   **Given** The application makes an API request to a backend or external service.
*   **When** The response is not received within a predefined timeout period (e.g., 30 seconds).
*   **Then** the request should be automatically aborted.
*   **And** the user should receive appropriate feedback (e.g., a timeout error message).
*   **And** the timeout duration should be configurable.

<h3>[COMPLETED] Story 7.7: Implement Automated Database Backups</h3>

As an administrator,
I want automated daily database backups to be performed,
So that data loss is prevented and recovery is possible in case of a system failure.

**Acceptance Criteria:**
*   **Given** The production database is running.
*   **When** A scheduled backup process runs daily.
*   **Then** a full backup of the database should be created and stored securely.
*   **And** historical backups should be retained for a configured period.
*   **And** a mechanism for restoring from backups should be documented.

<h3>[COMPLETED] Story 7.8: Implement Custom Domain Support</h3>

As an administrator,
I want to be able to configure a custom domain for the deployed application,
So that users can access the platform via a branded and memorable URL.

**Acceptance Criteria:**
*   **Given** The application is deployed.
*   **When** I configure a custom domain.
*   **Then** the application should be accessible via the custom domain.
*   **And** SSL/TLS certificates should be automatically provisioned and renewed for the custom domain.
*   **And** documentation for setting up the custom domain should be available.

<h2>Epic 8: Security and Data Integrity</h2>
**Goal:** Enhance the application's security posture and data reliability through robust input validation, access controls, and protection against common vulnerabilities.
**FRs covered:** (None directly, but addresses critical security and data integrity NFRs)

<h3>[COMPLETED] Story 8.1: Implement Comprehensive Input Validation for API Endpoints</h3>

As a developer,
I want to implement robust input validation for all API endpoints,
So that the application is protected from malicious or malformed data and data integrity is maintained.

**Acceptance Criteria:**
*   **Given** An API endpoint receives user input.
*   **When** The input is processed.
*   **Then** all input fields should be validated against predefined rules (e.g., type, length, format, range).
*   **And** validation errors should return clear, descriptive error messages with appropriate HTTP status codes (e.g., 400 Bad Request).
*   **And** the validation should cover all necessary endpoints in both the frontend and backend.
*   **And** common validation libraries (e.g., `express-validator` for Node.js) should be used consistently.

<h3>[COMPLETED] Story 8.2: Implement API Rate Limiting</h3>

As a developer,
I want to implement rate limiting on API endpoints,
So that the application is protected against brute-force attacks and abuse.

**Acceptance Criteria:**
*   **Given** An API endpoint is accessed repeatedly from a single source.
*   **When** The request frequency exceeds predefined limits (e.g., 100 requests/15min general, 5 requests/15min auth).
*   **Then** subsequent requests from that source should be temporarily blocked.
*   **And** the API should respond with an appropriate status code (e.g., 429 Too Many Requests).
*   **And** rate limits should be configurable.

<h3>[COMPLETED] Story 8.3: Implement CSRF Protection</h3>

As a developer,
I want to implement Cross-Site Request Forgery (CSRF) protection for state-changing routes,
So that the application is secured against malicious requests originating from other websites.

**Acceptance Criteria:**
*   **Given** A state-changing API route (e.g., POST, PUT, DELETE).
*   **When** A request is made to this route.
*   **Then** a valid CSRF token should be required.
*   **And** requests without a valid CSRF token should be rejected.
*   **And** the CSRF token should be securely generated and managed (e.g., using `csurf` middleware).

<h3>[COMPLETED] Story 8.4: Implement Secure Secrets Management</h3>

As a developer,
I want to securely manage application secrets (e.g., API keys, database credentials),
So that sensitive information is protected and not exposed in code or insecure configurations.

**Acceptance Criteria:**
*   **Given** The application requires access to sensitive credentials.
*   **When** Secrets are used in any environment (local, dev, prod).
*   **Then** they should be loaded from a secure secrets management system (e.g., environment variables, Vault, KMS).
*   **And** hardcoding of secrets should be strictly forbidden.
*   **And** local development should support a secure way to manage secrets (e.g., `.env` files not committed to Git).

<h2>Epic 9: Frontend Enhancements and Robustness</h2>
**Goal:** Improve the user experience and application stability by implementing UI/UX enhancements and robust error handling mechanisms in the frontend.
**FRs covered:** (None directly, but addresses critical UX and stability NFRs)

<h3>[COMPLETED] Story 9.1: Implement React Error Boundaries</h3>

As a frontend developer,
I want to implement React Error Boundaries,
So that UI crashes in components are gracefully handled and the rest of the application remains functional.

**Acceptance Criteria:**
*   **Given** An unhandled JavaScript error occurs within a UI component.
*   **When** The error boundary catches the error.
*   **Then** a fallback UI should be displayed to the user.
*   **And** the error should be logged for debugging purposes (integrating with centralized logging from Story 7.3).
*   **And** critical application sections should be wrapped in appropriate error boundaries.

<h3>[COMPLETED] Story 9.2: Implement Loading Skeletons for Improved UX</h3>

As a frontend developer,
I want to replace generic "Loading..." indicators with loading skeletons,
So that users have a smoother and more visually appealing experience during data fetching.

**Acceptance Criteria:**
*   **Given** A page or component is loading data.
*   **When** Data is being fetched asynchronously.
*   **Then** a content-appropriate loading skeleton should be displayed instead of a generic loading message.
*   **And** the skeleton should closely resemble the final loaded content structure.
*   **And** loading skeletons should be implemented for key data-intensive areas (e.g., dashboards, lists).

<h3>[COMPLETED] Story 9.3: Implement Optimistic UI Updates</h3>

As a frontend developer,
I want to implement optimistic UI updates for interactive actions (e.g., adding to cart, booking),
So that user interactions feel instant and more responsive.

**Acceptance Criteria:**
*   **Given** A user performs an action (e.g., adds an item to cart, books a class).
*   **When** The action is initiated.
*   **Then** the UI should immediately reflect the expected outcome (e.g., item appears in cart, class slot marked as booked).
*   **And** if the backend operation succeeds, the optimistic update should be confirmed.
*   **And** if the backend operation fails, the UI should revert to its previous state and display an appropriate error message.
*   **And** optimistic updates should be applied to critical interactive flows like cart and booking operations.

<h3>[COMPLETED] Story 9.4: Implement Pagination for List Endpoints</h3>

As a user,
I want to view paginated results for large lists (e.g., classes, trainers, exercises),
So that the application loads faster and is easier to navigate.

**Acceptance Criteria:**
*   **Given** I am viewing a list endpoint (e.g., `/api/classes`, `/api/trainers`, `/api/exercises`) with many items.
*   **When** I request the list.
*   **Then** the API should return a subset of items per page.
*   **And** the API response should include pagination metadata (e.g., total count, current page, items per page).
*   **And** the frontend UI should display controls to navigate between pages.
*   **And** pagination should be implemented for `/api/classes`, `/api/trainers`, and `/api/exercises`.

<h3>[COMPLETED] Story 9.5: Improve Overall Mobile UI and Responsiveness</h3>

As a user,
I want the entire application to be visually appealing and fully functional on mobile devices,
So that I can use the platform conveniently from my smartphone or tablet.

**Acceptance Criteria:**
*   **Given** I am accessing the application on a mobile device.
*   **When** I navigate through various pages and features.
*   **Then** the UI elements should adapt appropriately to smaller screen sizes.
*   **And** all interactive components (buttons, forms, navigation) should be easily usable with touch input.
*   **And** there should be no horizontal scrolling or truncated content on common mobile screen resolutions.

<h3>[COMPLETED] Story 9.6: Improve Navigation Visibility (Add Classes Link)</h3>

As a user,
I want to easily find a "Classes" link in the main navigation,
So that I can quickly access the class schedule.

**Acceptance Criteria:**
*   **Given** I am a logged-in user.
*   **When** I view the main application navigation.
*   **Then** a clear and visible "Classes" link should be present.
*   **And** clicking this link should take me to the class schedule page.

<h2>Epic 10: Reporting and Analytics</h2>
**Goal:** Provide trainers and administrators with comprehensive reports and analytics to track class attendance, client progress, and overall business metrics.
**FRs covered:** (None directly, but addresses reporting needs)

<h3>[COMPLETED] Story 10.1: Generate Trainer Attendance Reports</h3>

As a trainer,
I want to generate reports showing attendance for my classes,
So that I can track client participation and manage my records.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer.
*   **When** I access the reporting section and select to generate an attendance report for my classes.
*   **Then** the report should list all my classes within a selected date range.
*   **And** for each class, it should show the list of booked clients and their attendance status (attended/no-show).
*   **And** I should be able to filter reports by date range.

<h3>[COMPLETED] Story 10.2: Detailed Workout and Class Analytics</h3>

As a trainer/admin,
I want to view detailed analytics for workouts and classes,
So that I can gain insights into performance, popularity, and areas for improvement.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer or administrator.
*   **When** I access the analytics section.
*   **Then** I should see aggregated data for workouts (e.g., most common exercises, average intensity) and classes (e.g., average attendance, peak times).
*   **And** the analytics should be filterable by various parameters (e.g., date range, trainer).
*   **And** data should be presented in an easily digestible format (e.g., charts, graphs).

<h2>Epic 11: Comprehensive Testing</h2>
**Goal:** Establish a robust testing strategy and implement various levels of automated tests to ensure the quality, reliability, and functionality of the application.
**FRs covered:** (None directly, but crucial for software quality)

<h3>[COMPLETED] Story 11.1: Implement End-to-End Tests for Major User Flows</h3>



As a QA engineer,

I want to have end-to-end tests covering all major user flows,

So that critical application functionality is continuously validated and regressions are prevented.



**Acceptance Criteria:**

*   **Given** The application is deployed in a test environment.

*   **When** The E2E test suite is executed.

*   **Then** all defined major user flows (e.g., user registration, login, class booking, package purchase) should be tested successfully.

*   **And** the tests should simulate real user interactions using a tool like Cypress.

*   **And** the test suite should be integrated into the CI/CD pipeline.



<h2>Epic 12: Luxury Polish & Future Growth</h2>

**Goal:** Elevate the platform from functional to world-class by adding micro-interactions, personalization, and advanced web capabilities.

**FRs covered:** Growth & Retention



<h3>[COMPLETED] Story 12.1: Modern UI Transitions and Micro-animations</h3>

As a user,
I want to experience smooth transitions and micro-animations throughout the application,
So that the interface feels modern, responsive, and high-quality.

**Acceptance Criteria:**
*   **Given** I am navigating between pages or interacting with UI elements (buttons, cards).
*   **When** I trigger an action or transition.
*   **Then** smooth animations (e.g., using Framer Motion) should guide the transition.
*   **And** hover and active states should have subtle, polished micro-animations.
*   **And** loading states should be visually integrated with the transition logic.

<h3>[COMPLETED] Story 12.2: Comprehensive Dark Mode Support</h3>

As a user,
I want the application to support dark mode,
So that I can use it comfortably in low-light environments and according to my preference.

**Acceptance Criteria:**
*   **Given** I am on any page of the application.
*   **When** I toggle the theme or my system preference is set to dark.
*   **Then** the entire UI should adapt to a polished dark theme using Tailwind CSS dark mode.
*   **And** the theme preference should be persisted in local storage or user profile.
*   **And** all components (charts, tables, forms) must be legible and visually appealing in dark mode.



<h3>[COMPLETED] Story 12.3: Progressive Web App (PWA) Integration</h3>

As a user,
I want to be able to install the application on my home screen and use it with offline capabilities,
So that I can access my schedule and workout logs quickly and reliably.

**Acceptance Criteria:**
*   **Given** I am accessing the application on a compatible browser/device.
*   **When** I am prompted or choose to install the app.
*   **Then** the application should be installable as a PWA.
*   **And** it should provide a "native-like" experience with a dedicated splash screen and icon.
*   **And** basic offline functionality (e.g., viewing cached schedule/logs) should be available via service workers.



<h3>Story 12.4: User Achievement & Gamification System</h3>



As a user,

I want to earn badges and track my workout streaks,

So that I stay motivated and engaged with my fitness journey.



**Acceptance Criteria:**

*   **Given** I am performing actions (e.g., attending classes, completing workouts).

*   **When** I hit specific milestones (e.g., "10th Class Attended", "5 Day Streak").

*   **Then** I should be awarded a visual badge or achievement.

*   *And* my current streaks and unlocked achievements should be visible on my dashboard.

*   **And** the backend should track these metrics and trigger achievement events.



<h3>Story 12.5: Interactive Progress Charts</h3>



As a user,

I want to view my progress through interactive and dynamic charts,

So that I can better understand my fitness trends and performance over time.



**Acceptance Criteria:**

*   **Given** I am on my progress dashboard.

*   **When** I view my workout or weight data.

*   **Then** I should see interactive charts (e.g., using Recharts or Chart.js).

*   **And** I should be able to hover over data points for details and filter the data by date range.

*   **And** the charts should be responsive and performant on both desktop and mobile.

<h2>Epic 13: Structured Training Programs</h2>
**Goal:** Enable trainers to create and assign multi-week workout programs to clients, providing a long-term structured approach to fitness.
**FRs covered:** FR14, FR15

<h3>Story 13.1: Create Program Templates</h3>

As a trainer,
I want to create multi-week workout programs by grouping existing workout templates into a schedule,
So that I can offer structured long-term training to my clients.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer.
*   **When** I create a new "Program".
*   **Then** I should be able to define the number of weeks.
*   **And** for each week, I should be able to assign workout templates to specific days (e.g., Week 1, Day 1: "Upper Body Power").
*   **And** I should be able to save this program as a reusable template.

<h3>Story 13.2: Assign Program to Client</h3>

As a trainer,
I want to assign a workout program to a specific client,
So that they can follow the structured plan I've designed for them.

**Acceptance Criteria:**
*   **Given** I am a logged-in trainer.
*   **When** I view a client's profile.
*   **Then** I should see an option to "Assign Program".
*   **And** I should be able to select from my saved programs.
*   **And** I should be able to set a start date for the program.

<h3>Story 13.3: View and Follow Assigned Program</h3>

As a client,
I want to view my current assigned program and see which workout I need to perform today,
So that I can follow my trainer's plan effectively.

**Acceptance Criteria:**
*   **Given** I am a logged-in client with an assigned program.
*   **When** I access my dashboard.
*   **Then** I should see my current program's progress (e.g., "Week 2, Day 3").
*   **And** I should be able to start the scheduled workout for today with one click.
*   **And** I should be able to view the upcoming schedule for the entire program.

<h2>Epic 14: Enhanced Exercise Library & Media</h2>
**Goal:** Enrich the exercise library with instructional videos, detailed descriptions, and muscle group mapping to improve user guidance and safety.
**FRs covered:** FR16

<h3>Story 14.1: Exercise Video & Image Support</h3>

As a user,
I want to see video demonstrations or images for each exercise,
So that I can ensure I am performing the movements with correct form.

**Acceptance Criteria:**
*   **Given** I am viewing an exercise detail page or a workout log.
*   **When** an exercise has a video URL or image associated with it.
*   **Then** the media should be displayed clearly within the interface.
*   **And** video players should be embedded (e.g., YouTube/Vimeo) or use standard HTML5 video.

<h3>Story 14.2: Muscle Group Mapping & Visuals</h3>

As a user,
I want to see which muscle groups are targeted by an exercise,
So that I can understand the impact of my workout.

**Acceptance Criteria:**
*   **Given** I am viewing an exercise.
*   **Then** I should see a list of primary and secondary muscle groups.
*   **And** ideally, a visual diagram (e.g., anatomical map) should highlight the targeted areas.

<h2>Epic 15: Communications & Notifications</h2>
**Goal:** Implement a robust communication and notification system to keep users engaged and informed about their schedule and progress.
**FRs covered:** FR17

<h3>Story 15.1: Backend Notification Infrastructure</h3>

As a developer,
I want a centralized notification service on the backend,
So that the system can reliably send emails, push notifications, or in-app alerts.

**Acceptance Criteria:**
*   **Given** a system event occurs (e.g., booking confirmed).
*   **Then** the notification service should trigger the appropriate delivery mechanism.
*   **And** notification templates should be used for consistent messaging.
*   **And** user notification preferences should be respected.

<h3>Story 15.2: Email Notifications for Bookings</h3>

As a user,
I want to receive an email confirmation when I book or cancel a class,
So that I have a record of my schedule outside of the application.

**Acceptance Criteria:**
*   **Given** I successfully book a class.
*   **Then** I should receive an email with the class details, time, and location/link.
*   **And** when a class is cancelled (by me or the trainer), I should receive a cancellation notice.

<h2>Epic 16: Subscription Membership Models</h2>
**Goal:** Transition to a recurring revenue model by supporting monthly memberships with automatic billing and tiered access.
**FRs covered:** FR18

<h3>Story 16.1: Recurring Membership Integration (Square)</h3>

As an admin,
I want to offer monthly subscription plans that bill users automatically,
So that the business has predictable recurring revenue.

**Acceptance Criteria:**
*   **Given** a user chooses a "Monthly Membership".
*   **When** they complete the checkout.
*   **Then** a recurring subscription should be created in Square.
*   **And** the user's account should be updated with the membership status.
*   **And** credits should be automatically replenished or "unlimited" access granted based on the tier.

<h2>Epic 17: Community & Gamification v2</h2>
**Goal:** Foster a sense of community and healthy competition through leaderboards, social sharing, and collective challenges.
**FRs covered:** FR19

<h3>Story 17.1: Class & Global Leaderboards</h3>

As a user,
I want to see how I rank against others in my classes or globally,
So that I am motivated by friendly competition.

**Acceptance Criteria:**
*   **Given** I am on a class page or dashboard.
*   **Then** I should see a leaderboard for metrics like "Total Workouts this Month" or "Volume Leader".
*   **And** users should have the option to opt-out of public leaderboards for privacy.

<h2>Epic 18: Advanced Business Analytics</h2>
**Goal:** Provide administrators and trainers with deep insights into business performance, client engagement, and operational efficiency.
**FRs covered:** FR20

<h3>Story 18.1: Admin Revenue Dashboard</h3>

As an admin,
I want to view a dashboard showing revenue trends, package popularity, and projected earnings,
So that I can make informed business decisions.

**Acceptance Criteria:**
*   **Given** I am a logged-in admin.
*   **Then** I should see charts showing revenue over time.
*   **And** I should see a breakdown of sales by package type and membership.
*   **And** the data should be filterable by date range.

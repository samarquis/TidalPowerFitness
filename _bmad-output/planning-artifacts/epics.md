---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments: [
  "_bmad-output/project-context/project-context.md",
  "_bmad-output/planning-artifacts/architecture.md",
  "_bmad-output/planning-artifacts/ux-design-specification.md"
]
---

# Tidal Power Fitness - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Tidal Power Fitness, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: As a user, I want to be redirected to my intended destination after successful login, rather than always to /trainers.
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
FR14: As a trainer, I want to create multi-week workout programs (Routines) that I can assign to clients.
FR15: As a user, I want to follow a structured program assigned by my trainer and see my progress throughout the program.
FR16: As a user, I want to see exercise demonstration videos and detailed instructions within the exercise library.
FR17: As a user, I want to receive email notifications for class bookings, cancellations, and workout reminders.
FR18: As a user, I want to subscribe to a monthly membership that provides recurring credits or unlimited access via Square Subscriptions.
FR19: As a user, I want to see how I rank on class leaderboards for specific metrics (e.g., volume, attendance).
FR20: As an admin, I want to see detailed business analytics, including revenue reports and client retention data.

### NonFunctional Requirements

NFR1: The system must maintain consistent authentication across all pages using HttpOnly cookie patterns.
NFR2: The UI must be responsive and usable on all screen sizes, including mobile.
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

- **Architecture**: New schema entities for programs, program_templates, program_assignments, and 
otifications. 
- **Architecture**: Integration with Square Subscriptions API for recurring revenue.
- **UX**: Premium UI overhaul ("Black Glass" inputs, "Tsunami" Pacific Cyan color scheme).
- **UX**: Implementation of "The Pulse of Progress" (instant feedback pulses during logging).
- **UX**: High-fidelity "Mission Accomplished" states with animations and summary charts.
- **UX**: Progressive Web App (PWA) optimization for gym-floor reliability and offline capabilities.

### FR Coverage Map

### FR Coverage Map

FR1: Epic 1 - Intelligent redirect after login
FR2: Epic 1 - Secure HttpOnly cookies for Trainer Dashboard
FR3: Epic 2 - Availability Page loading/compilation
FR4: Epic 2 - Availability Page consistent authentication
FR5: Epic 8 - Responsive User Management table
FR6: Epic 8 - Trainer Edit Profile button fix
FR7: Epic 1 - Redirect after template creation
FR8: Epic 1 - Redirect after workout history view
FR9: Epic 2 - View assigned classes correctly
FR10: Epic 2 - Create/edit/delete availability slots
FR11: Epic 1 - User management table mobile functionality
FR12: Epic 3 - View workout data for assigned clients
FR13: Epic 5 (Purchasing) & Epic 3 (Logging) - Full purchase -> attend -> record flow
FR14: Epic 4 - Create multi-week workout programs
FR15: Epic 4 - Follow structured program assigned by trainer
FR16: Epic 7 - Exercise demonstration videos and instructions
FR17: Epic 6 - Email notifications for bookings/cancellations
FR18: Epic 5 - Monthly membership via Square Subscriptions
FR19: Epic 6 - Class leaderboards and rankings
FR20: Epic 7 - Detailed business analytics for admins

## Epic List

## Epic List

### Epic 1: Professional Infrastructure & Authentication
**Goal**: Establish the "Professional Grade" foundation with secure HttpOnly auth, intelligent intent-based redirects, and the premium "Black Glass" baseline.
**FRs covered**: FR1, FR2, FR7, FR8, FR11

### Epic 2: Core Trainer Operations & Availability
**Goal**: Enable trainers to manage their business through functional availability slots, secure dashboard access, and correct class assignments.
**FRs covered**: FR3, FR4, FR9, FR10

### Epic 3: Interactive Workout Logging ("The Pulse of Progress")
**Goal**: Implement the core "Pulse of Progress" experience with high-density Batch Entry, instant feedback pulses, and "Mission Accomplished" celebration states.
**FRs covered**: FR12, FR13 (Logging)

### Epic 4: Structured Training Programs & Progression
**Goal**: Transition from one-off workouts to multi-week Routines with automated program assignments and client progress tracking.
**FRs covered**: FR14, FR15

### Epic 5: Purchasing, Credits & Subscription Ecosystem
**Goal**: Implement the full Square-integrated purchasing flow, token management, and recurring monthly memberships via the Subscriptions API.
**FRs covered**: FR13 (Purchasing), FR18

### Epic 6: Community Engagement & Motivation
**Goal**: Foster a sense of belonging and competition through class/global leaderboards, achievements, and a centralized notification system.
**FRs covered**: FR17, FR19

### Epic 7: Advanced Business Intelligence & Media
**Goal**: Provide trainers and admins with deep analytics suite and a media-rich exercise library with video demonstrations.
**FRs covered**: FR16, FR20

### Epic 8: Administrative Control & Remediation
**Goal**: Resolve administrative bottlenecks including profile editing functionality and fully responsive management tables.
**FRs covered**: FR5, FR6

## Epic 9: Platform Refinement & Maintenance
**Goal**: Address feedback from Site Review 008, focusing on data hygiene and workout assignment workflow improvements.

### Story 9.1: Database Hygiene & User Cleanup
As an admin,
I want to remove all test users except for the core stakeholders (Scott and Lisa),
So that the production database is clean and easy to manage.

**Acceptance Criteria:**
**Given** the current user database with multiple test accounts
**When** the cleanup script is executed
**Then** only 'samarquis4@gmail.com' and 'lisa.baumgard@t...' should remain.
**And** all related data for deleted users should be handled safely (cascade or specific deletion).

### Story 9.2: Workout Assignment UX Overhaul
As a trainer,
I want to assign a workout by first selecting a class/client, then the date/time,
So that the flow feels more natural and intuitive.

**Acceptance Criteria:**
**Given** I am on the Assign Workout page
**When** I start the process
**Then** the first step should be selecting the target (Class or Client).
**And** the subsequent steps (Date, Time, Template) should follow logically.

### Story 9.3: Template Visibility Fix
As a trainer,
I want to see all my created workout templates when assigning a workout,
So that I can use the content I have prepared.

**Acceptance Criteria:**
**Given** I have created 3 templates (Today, Leg Pull, Scott Testing)
**When** I open the template selection dropdown/modal
**Then** all 3 templates should be visible and selectable.
**And** the list should not be artificially filtered or empty.


## Epic 1: Professional Infrastructure & Authentication
**Goal**: Establish the "Professional Grade" foundation with secure HttpOnly auth, intelligent intent-based redirects, and the premium "Black Glass" baseline.

### Story 1.1: Intelligent Login Redirection
As a user,
I want to be redirected to my intended page after successful login,
So that I can maintain my workflow without extra navigation.

**Acceptance Criteria:**
**Given** I am an unauthenticated user attempting to access a protected route (e.g., /workouts/templates/new)
**When** I am redirected to the login page and successfully authenticate
**Then** I should be redirected back to the original requested route instead of the default landing page.
**And** if I access the login page directly without a redirect parameter, I should be sent to my role-specific dashboard.

### Story 1.2: Hardened Trainer Dashboard Security
As a trainer,
I want my dashboard data to be fetched using secure HttpOnly cookies,
So that my session is protected from client-side token theft.

**Acceptance Criteria:**
**Given** I am logged in as a trainer
**When** I access the Trainer Dashboard
**Then** all API requests (e.g., GET /api/trainer/classes) must include the 'credentials: include' flag
**And** the backend must verify the identity via HttpOnly JWT cookie rather than an Authorization header.

### Story 1.3: "Black Glass" Global Styling Baseline
As a developer,
I want a standardized set of Tailwind tokens and layout base components,
So that the "Professional Grade" luxury aesthetic is consistent across all pages.

**Acceptance Criteria:**
**Given** the global tailwind.config.ts
**When** I apply the 'Tsunami' color tokens (Pacific Cyan, Cerulean) and Obsidian Black background
**Then** the entire application should render with the high-contrast dark theme baseline.
**And** a reusable 'Black Glass' card component with backdrop-blur and border-transparency must be available for use.

### Story 1.4: Mobile-First Management Tables
As an admin,
I want the User Management table to be fully usable on mobile devices,
So that I can manage the platform on the go.

**Acceptance Criteria:**
**Given** I am on the User Management page on a mobile device (width < 768px)
**When** I view the users table
**Then** the layout should pivot to a card-based or simplified view that prevents horizontal overflow.
**And** all primary actions (Toggle Active, Reset Password) must remain easily accessible via 44px+ touch targets.

## Epic 2: Core Trainer Operations & Availability
**Goal**: Enable trainers to manage their business through functional availability slots, secure dashboard access, and correct class assignments.

### Story 2.1: Availability Management Module
As a trainer,
I want to create and manage my availability slots without errors,
So that clients can book sessions with me reliably.

**Acceptance Criteria:**
**Given** I am on the Availability Page (/trainer/availability)
**When** I create a new slot or edit an existing one
**Then** the request must succeed using HttpOnly cookie authentication.
**And** the page must load correctly without any 'Link' or 'useSearchParams' compilation errors.

### Story 2.2: Live Class Schedule Sync
As a trainer,
I want to see my assigned classes on my dashboard,
So that I can prepare for my upcoming sessions.

**Acceptance Criteria:**
**Given** I have classes assigned to me in the database
**When** I view my Trainer Dashboard
**Then** I should see a chronological list of my classes for the current week.
**And** each class must show the current number of registered attendees.

### Story 2.3: Multi-Day Class Recurrence
As a trainer,
I want to schedule a class for multiple days at once,
So that I don't have to create repetitive entries for recurring sessions.

**Acceptance Criteria:**
**Given** I am creating a new class in the management module
**When** I select multiple days of the week (e.g., Mon, Wed, Fri)
**Then** the system should create a single class definition that recurs on those specific days.
**And** the schedule should correctly reflect these recurrences in the master calendar.

## Epic 3: Interactive Workout Logging ("The Pulse of Progress")
**Goal**: Implement the core "Pulse of Progress" experience with high-density Batch Entry, instant feedback pulses, and "Mission Accomplished" celebration states.

### Story 3.1: "Black Glass" Batch Entry Matrix
As a user,
I want to log my sets and reps in a high-speed grid,
So that I can focus on my workout without fighting the UI.

**Acceptance Criteria:**
**Given** I am in an active workout session
**When** I enter the logging view for an exercise
**Then** I should see a touch-optimized matrix for Sets, Reps, and Weight.
**And** the UI must pre-fill values based on the trainer's plan or my last successful set.
**And** the inputs must follow the 'Black Glass' visual standard.

### Story 3.2: Progressive Overload "Pulse" Engine
As a user,
I want to see instant visual confirmation when I improve my performance,
So that I feel motivated to push harder.

**Acceptance Criteria:**
**Given** I have just entered data for a completed set
**When** the system detects that I have exceeded my previous best (volume, weight, or reps)
**Then** a Pacific Cyan 'Pulse' or a Flame Orange 🔥 badge must trigger immediately next to the input.
**And** the evaluation must happen client-side or with zero perceived latency.

### Story 3.3: High-Fidelity "Mission Accomplished" State
As a user,
I want a satisfying celebration after finishing my workout,
So that I feel a sense of pride and accomplishment.

**Acceptance Criteria:**
**Given** I have completed all exercises in a session
**When** I tap the 'Finish Workout' button
**Then** the UI should transition to a 'Mission Accomplished' canvas with high-fidelity confetti animations.
**And** I should see a summary chart of my volume and any PRs achieved during the session.

### Story 3.4: Cross-Role Workout Visibility
As a trainer,
I want to view my client's logged workout data,
So that I can adjust their programming based on real performance.

**Acceptance Criteria:**
**Given** I have clients assigned to me
**When** I access a client's profile or workout history
**Then** I must be able to see the detailed logs (sets, reps, weight) of their recently completed sessions.
**And** the system must ensure I can only see data for clients assigned to me.

## Epic 4: Structured Training Programs & Progression
**Goal**: Transition from one-off workouts to multi-week Routines with automated program assignments and client progress tracking.

### Story 4.1: Multi-Week Program Builder
As a trainer,
I want to create a named multi-week workout program,
So that I can offer long-term structured routines to my clients.

**Acceptance Criteria:**
**Given** I am on the Program Management page
**When** I create a new Program
**Then** I should be able to specify the name, description, and total number of weeks (e.g., 4, 8, or 12).
**And** the program should be saved to the database with a reference to me as the creator.

### Story 4.2: Program Template Mapping
As a trainer,
I want to assign workout templates to specific days and weeks within a program,
So that I can define the exact training sequence for my clients.

**Acceptance Criteria:**
**Given** I am editing an existing multi-week program
**When** I select a specific Week and Day (1-7)
**Then** I should be able to choose a Workout Template from my library to assign to that slot.
**And** I should be able to visualize the entire program schedule in a clear grid view.

### Story 4.3: Client Program Assignment
As a trainer,
I want to assign a program to a specific client with a start date,
So that they can begin following the routine.

**Acceptance Criteria:**
**Given** I am viewing a client's profile
**When** I select 'Assign Program' and choose a start date
**Then** the client must be linked to the program in the database.
**And** the system should track their progress starting from 'Week 1, Day 1' on the specified date.

### Story 4.4: Dynamic "Today's Workout" Injection
As a user,
I want my dashboard to show exactly which workout I need to do today based on my program,
So that I don't have to search for my routine manually.

**Acceptance Criteria:**
**Given** I am enrolled in an active training program
**When** I view my User Dashboard
**Then** the 'Next Workout' tile should dynamically display the template assigned to my current week and day.
**And** clicking 'Start Workout' should initiate a session based on that specific template.

## Epic 5: Purchasing, Credits & Subscription Ecosystem
**Goal**: Implement the full Square-integrated purchasing flow, token management, and recurring monthly memberships via the Subscriptions API.

### Story 5.1: Multi-Item Cart Checkout
As a user,
I want to purchase multiple token packages at once,
So that I can stock up on credits in a single transaction.

**Acceptance Criteria:**
**Given** I have multiple items in my cart
**When** I proceed to checkout
**Then** the system should generate a Square checkout link encompassing all items via the Order API.
**And** the cart must be cleared only after a successful payment is confirmed.

### Story 5.2: Credit/Token Reconciliation
As a user,
I want my credits to update automatically after I pay,
So that I can book classes immediately.

**Acceptance Criteria:**
**Given** a successful Square payment has been processed
**When** the Square webhook hits our server
**Then** the system must validate the signature and accurately increment the user's local credit balance.
**And** a transaction record must be created in the local database for audit purposes.

### Story 5.3: Recurring Membership Enrollment
As a user,
I want to subscribe to a monthly membership,
So that I can enjoy consistent access to the platform without manual repurchasing.

**Acceptance Criteria:**
**Given** I am selecting a membership tier (e.g., Bronze, Silver, Gold)
**When** I complete the checkout
**Then** the system should create a recurring subscription in Square.
**And** my local user profile must be updated with an 'active_subscription' status.

### Story 5.4: Tiered Access & Auto-Replenishment
As a user,
I want my credits to be automatically managed based on my membership tier,
So that I don't have to manually track my plan's value.

**Acceptance Criteria:**
**Given** I have an active Square subscription
**When** my billing cycle renews
**Then** the system should automatically replenish my local credit balance or grant 'unlimited' access based on the tier definition.
**And** the system must correctly handle subscription cancellations or payment failures by restricting access.

## Epic 6: Community Engagement & Motivation
**Goal**: Foster a sense of belonging and competition through class/global leaderboards, achievements, and a centralized notification system.

### Story 6.1: Class & Global Leaderboards
As a user,
I want to see how I rank against others in my community,
So that I feel motivated by friendly competition.

**Acceptance Criteria:**
**Given** I am on the Leaderboard page
**When** I view rankings for 'Total Volume' or 'Class Attendance'
**Then** I should see my position relative to other users.
**And** I should be able to filter by 'This Month' or 'All Time.'
**And** I must have the option to opt-out of public leaderboards for privacy.

### Story 6.2: Centralized Notification Infrastructure
As a developer,
I want a unified service to handle all system alerts,
So that I can reliably inform users about their schedule and accomplishments.

**Acceptance Criteria:**
**Given** a system event occurs (e.g., booking confirmed, PR achieved)
**When** the event triggers a notification
**Then** the service should record the message in the local 'notifications' table.
**And** it should dispatch an email if the user's preferences permit.

### Story 6.3: Automated Achievement Engine
As a user,
I want to earn badges for my consistency and progress,
So that I feel a sense of recognition for my hard work.

**Acceptance Criteria:**
**Given** I have met a specific milestone (e.g., 5-day workout streak)
**When** the system processes my activity
**Then** I should be awarded a visual achievement badge.
**And** this badge should be prominently displayed on my User Dashboard.

## Epic 7: Advanced Business Intelligence & Media
**Goal**: Provide trainers and admins with deep analytics suite and a media-rich exercise library with video demonstrations.

### Story 7.1: Multimedia Exercise Library
As a user,
I want to see video demonstrations and instructions for every exercise,
So that I can ensure I am performing the movements with correct form.

**Acceptance Criteria:**
**Given** I am viewing an exercise detail page or a workout log
**When** the exercise has a video URL or instructional content
**Then** the media must be rendered clearly within the UI.
**And** I should see a mapping of primary and secondary muscle groups for that movement.

### Story 7.2: Trainer Performance Analytics
As a trainer,
I want to see data on my classes and clients,
So that I can improve my coaching and business efficiency.

**Acceptance Criteria:**
**Given** I am on the Trainer Analytics page
**When** I view my performance data
**Then** I should see charts for average class attendance, client retention rates, and total volume coached over time.
**And** I should be able to filter this data by date range.

### Story 7.3: Admin Revenue Dashboard
As an admin,
I want a consolidated view of platform revenue,
So that I can make informed business decisions.

**Acceptance Criteria:**
**Given** I am on the Admin Business Analytics page
**When** I view the revenue report
**Then** I should see a breakdown of income from one-time packages vs. recurring subscriptions.
**And** the dashboard must show trends in growth and projected monthly earnings.

## Epic 8: Administrative Control & Remediation
**Goal**: Resolve administrative bottlenecks including profile editing functionality and fully responsive management tables.

### Story 8.1: Trainer Profile Management Fix
As an admin,
I want to edit trainer profiles without errors,
So that I can maintain accurate information for our coaching staff.

**Acceptance Criteria:**
**Given** I am on the User Management or Trainer Management page
**When** I click the 'Edit Profile' button for a trainer
**Then** the editing form should load with the trainer's current data.
**And** submitting the form must successfully update the record in the database and show a success confirmation.

### Story 8.2: Responsive User Integrity Table
As an admin,
I want the User Management table to be fully responsive,
So that I can manage users from a tablet or mobile device without layout breakage.

**Acceptance Criteria:**
**Given** I am on the User Management page
**When** the screen width is reduced (e.g., mobile view)
**Then** the user table should gracefully collapse into a card-based layout or allow for side-scrolling without breaking the container.
**And** all toggles for 'Active' status and 'Roles' must remain functional and correctly sized for touch.
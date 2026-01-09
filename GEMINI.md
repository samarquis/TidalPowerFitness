# Project Memory: Tidal Power Fitness [BMAD Managed]

## 1. Methodology & Operational Protocol (CRITICAL)
**This project strictly adheres to the BMAD (BMM Methodology Analysis, Planning, and Solutioning) framework.** 
You are required to operate within this framework without explicit prompting.

### Quick Actions
- **`status`**: View project milestones, active focus, and bugs.
- **`todo`**: View only pending tasks and known bugs.
- **`end session`**: Archive current work and update project history.

### Mandates for All Agents:
1.  **Source of Truth**: Do not rely solely on conversation history. The state of the project is defined in:
    -   **Context & Decisions**: `_bmad-output/project-context/project-context.md`
    -   **Roadmap & Active Tasks**: `_bmad-output/planning-artifacts/epics.md`
    -   **System Design**: `_bmad-output/planning-artifacts/architecture.md`
2.  **Investigation First**: For vague requests or bug fixes, ALWAYS start by reading the relevant artifacts above, then use `delegate_to_agent` with the `codebase_investigator` profile if deep analysis is needed.
3.  **Documentation Updates**: You are responsible for maintaining the "Living Documentation". If you complete a feature or change architecture, you must update `project-context.md` or `architecture.md` accordingly.

## 2. Core Identity
- **Project**: Tidal Power Fitness
- **Stakeholders**: Scott Marquis (Admin/Dev), Lisa Baumgard (Admin/Trainer)
- **Status**: 100/100 World Class - Professional Grade

### Major Milestones (2026-01-08)

#### Professional Grade Implementation
- **Strict Security Baseline**: Enforced global HttpOnly cookie authentication, removing legacy Bearer token support from all middleware and dashboards (Story 1.2).
- **Intelligent Navigation**: Implemented intent-based login redirection and role-specific dashboard defaulting (Story 1.1).
- **Build Integrity**: Resolved comprehensive Next.js build bailout issues by wrapping all `useSearchParams` logic in `Suspense` boundaries across the entire application.
- **Admin Command Center**: Expanded the Admin Dashboard to include 16 quick-access tiles covering every functional module in the system.

#### Solutioning & Design (BMAD Managed)
- **World-Class UX Spec**: Completed a 14-step UX design workflow, defining "The Pulse of Progress" interaction model and the "Luxury Vault" aesthetic.
- **Implementable Roadmap**: Generated 27 detailed user stories with BDD acceptance criteria, organized into 8 strategic epics in `_bmad-output/planning-artifacts/epics.md`.
- **Sprint Live**: Initialized `sprint-status.yaml` tracking for the implementation of all Phase 2 features.

### Major Milestones (2026-01-06)

### World Class UX (100/100)
- **Progressive Overload Intelligence**: Automated historical trend lookup in the Workout Logger with visual "Overload" badges.
- **Batch Entry System**: Intelligent Sets/Reps/Lbs entry for both trainers and clients, pre-loaded with workout design targets.
- **Mission Accomplished State**: High-fidelity success feedback replacing generic alerts in the Assignment Wizard.
- **Premium UI Overhaul**: Implemented "Black Glass" inputs, branded "Tsunami" color schemes, and animated skeleton loaders.
- **System-Wide 12hr Time**: Standardized all time displays to AM/PM format.

### Professional Grade Infrastructure
- **Security**: Hardened with Helmet.js headers and strict header-based CSRF protection.
- **Resilience**: Centralized error handling with malformed URI protection.
- **Monitoring**: Structured JSON logging (Winston) integrated for production log analysis.
- **Performance**: Scaled database with targeted indexes on logging and session tables (Migration 028).
- **Integrity**: Full API validation layer using express-validator for all core workflows.

## 4. Technical Context
- **Frontend**: Next.js 14+, Tailwind CSS, Framer Motion.
- **Backend**: Express (TypeScript), PostgreSQL (Neon), Winston Logging.
- **Auth**: JWT with HttpOnly cookies, multi-role support (Admin, Trainer, Client).
- **Payments**: Full Square Integration (Ordering, Webhooks).
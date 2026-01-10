# Tidal Power Fitness - Output Directory Index

## Root Artifacts

- **[bmm-workflow-status.yaml](./bmm-workflow-status.yaml)** - Tracks high-level methodology progress through Analysis, Planning, and Solutioning.
- **[test-design-system.md](./test-design-system.md)** - System-level site review focused on design consistency and testability findings.

## Subdirectories

### implementation-artifacts/

- **[sprint-status.yaml](./implementation-artifacts/sprint-status.yaml)** - Central tracking file for all Epics and User Stories implementation status.

#### implementation-artifacts/stories/

- **[1-1-intelligent-login-redirection.md](./implementation-artifacts/stories/1-1-intelligent-login-redirection.md)** - Implementation of intent-based login redirection logic.
- **[1-2-hardened-trainer-dashboard-security.md](./implementation-artifacts/stories/1-2-hardened-trainer-dashboard-security.md)** - Enforcement of HttpOnly cookies for dashboard data fetching.
- **[1-3-black-glass-global-styling-baseline.md](./implementation-artifacts/stories/1-3-black-glass-global-styling-baseline.md)** - Establishment of global CSS tokens and 'Black Glass' components.
- **[1-4-mobile-first-management-tables.md](./implementation-artifacts/stories/1-4-mobile-first-management-tables.md)** - Responsive refactor of user management tables for mobile devices.
- **[2-1-availability-management-module.md](./implementation-artifacts/stories/2-1-availability-management-module.md)** - Development of the trainer availability creation and editing module.
- **[2-2-live-class-schedule-sync.md](./implementation-artifacts/stories/2-2-live-class-schedule-sync.md)** - Integration of real-time class scheduling on the trainer dashboard.
- **[2-3-multi-day-class-recurrence.md](./implementation-artifacts/stories/2-3-multi-day-class-recurrence.md)** - Support for scheduling classes across multiple recurring days.
- **[3-1-black-glass-batch-entry-matrix.md](./implementation-artifacts/stories/3-1-black-glass-batch-entry-matrix.md)** - High-density grid component for rapid workout logging.
- **[3-2-progressive-overload-pulse-engine.md](./implementation-artifacts/stories/3-2-progressive-overload-pulse-engine.md)** - Logic for triggering real-time 'Pulse' animations on PRs.
- **[10-1-global-style-synchronization.md](./implementation-artifacts/stories/10-1-global-style-synchronization.md)** - Alignment of global styles with the UX design specification.
- **[10-2-button-component-standardization.md](./implementation-artifacts/stories/10-2-button-component-standardization.md)** - Refactoring of Admin pages to use the standardized CTAButton component.
- **[10-3-testability-hardening.md](./implementation-artifacts/stories/10-3-testability-hardening.md)** - Addition of stable data-testid attributes for E2E testing resilience.
- **[BUG-001-auth-failures.md](./implementation-artifacts/stories/BUG-001-auth-failures.md)** - Initial report and resolution tracking for authentication failures.
- **[STORY-005-ui-data-integrity.md](./implementation-artifacts/stories/STORY-005-ui-data-integrity.md)** - Implementation of UI-level data validation and integrity checks.
- **[story-fix-deployment-bugs.md](./implementation-artifacts/stories/story-fix-deployment-bugs.md)** - Tracking for various deployment-related fixes and environment issues.
- **[story-fix-migration-dns-error.md](./implementation-artifacts/stories/story-fix-migration-dns-error.md)** - Resolution logic for DNS errors during database migration.
- **[story-fix-migration-dns-persistent.md](./implementation-artifacts/stories/story-fix-migration-dns-persistent.md)** - Long-term fix for persistent DNS resolution issues.

### planning-artifacts/

- **[architecture.md](./planning-artifacts/architecture.md)** - Comprehensive system architecture, data models, and technical stack definitions.
- **[epic-10-site-review-remediation.md](./planning-artifacts/epic-10-site-review-remediation.md)** - Master document for the design and testability remediation sprint.
- **[epics.md](./planning-artifacts/epics.md)** - Primary master list of all epics and stories for the project.
- **[ux-design-directions.html](./planning-artifacts/ux-design-directions.html)** - Interactive visualization of the explored visual design directions.
- **[ux-design-specification.md](./planning-artifacts/ux-design-specification.md)** - High-fidelity design system rules, component specs, and user journeys.

### project-context/

- **[project-context.md](./project-context/project-context.md)** - "Source of Truth" for AI agents, containing critical coding rules and patterns.

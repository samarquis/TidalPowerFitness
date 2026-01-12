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

### Major Milestones (2026-01-12)

#### System-Wide Modernization & Standardization
- **12hr Time Format Standard**: Standardized all time-of-day displays (Classes, Sessions, Calendars, Bookings) to the 12-hour (AM/PM) format across the entire project. Eliminated redundant local formatters in 8+ components.
- **Multi-Day Scheduling Foundation**: Refactored the core `ClassModel` and database schema to support `days_of_week` integer arrays. Deployed `trg_sync_class_days` database trigger to ensure 100% legacy compatibility during transition.
- **Media-Rich Library Upgrade**:
    - **Anatomical Muscle Map**: Developed a high-fidelity SVG mapping component for real-time visualization of targeted muscle groups.
    - **Video Support**: Integrated YouTube demonstration support directly into the exercise detail views.
    - **TRX Expansion**: Batch-imported 22+ high-fidelity TRX and suspension movements with full muscle mapping.
- **The Arena (Community Hub)**: Launched the premium global leaderboard system with support for **Heavy Hitters** (Volume), **The Faithful** (Consistency), and **Elite Lifts** (Max Output).

#### Enterprise Integrity & Rollback
- **Subscription Model Purge**: Successfully executed a system-wide rollback of the subscription infrastructure per stakeholder directive. Removed all UI, API endpoints, and logic, returning to a pure, high-performance token-based model.
- **Build Resilience**: Resolved critical Next.js and TypeScript build failures on Render by fixing interface conflicts and rootDir directory violations.
- **UX Audit (SR-010)**: Completed an adversarial UX crawl, remediating 10+ "Experience Papercuts" related to mobile responsiveness, loading skeletons, and interactive button feedback.

### Major Milestones (2026-01-11)

#### Enterprise Hardening & Reliability
- **Financial Idempotency**: Implemented `processed_webhooks` layer to prevent double-crediting from Square retries.
- **Race Condition Prevention**: Enforced PostgreSQL row-level locking (`FOR UPDATE`) on all user credit deductions.
- **Atomic Transactions**: Wrapped class booking and payment flows in `BEGIN...COMMIT` blocks to ensure data integrity.
- **Live API Documentation**: Fully integrated Swagger/OpenAPI UI available at `/api-docs` for real-time testing and documentation.

#### Automated Support & Visibility
- **Integrated Feedback System**: Created a high-fidelity `/support` page that automatically generates **GitHub Issues** from user bug reports and feature requests.
- **Vault Sentry**: Implemented automated error tracking with SHA-256 fingerprinting and deduplication, piping real-time system crashes directly to GitHub.
- **Automated Changelog**: Built a Git-to-API bridge that automatically posts summarized updates to the live site upon every push.
- **Headless Validation (SR-009)**: Successfully executed a full end-to-end headless site review, validating complex trainer/client workflows and repairing critical SQL logic in the Progress model.

#### Zero-Friction UX
- **One-Click Trainer Flow**: Added direct "📝 Log" buttons to class cards, pre-filled assignment wizards, and automated redirections to logging matrices.
- **The Victory Loop**: Launched the high-fidelity "Mission Accomplished" celebration canvas with volume charting and PR highlights.

## 4. Technical Context
- **Frontend**: Next.js 14+, Tailwind CSS, Framer Motion.
- **Backend**: Express (TypeScript), PostgreSQL (Neon), Winston Logging.
- **Auth**: JWT with HttpOnly cookies, multi-role support (Admin, Trainer, Client).
- **Payments**: Full Square Integration (Ordering, Webhooks).
- **Source of Truth**: All time formatting must use `@/lib/utils/formatTime12Hour`.
- **Database**: `days_of_week` array is the primary source for scheduling logic.

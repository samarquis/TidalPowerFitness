# Epic 10: Site Review Remediation & Standardization
**Goal**: Address critical design consistency and testability gaps identified in the "Top Down Site Review", ensuring the platform meets "Professional Grade" standards for code quality and QA resilience.

## Story 10.1: Global Style Synchronization
As a developer,
I want the global CSS variables to match the UX Design Specification exactly,
So that the visual presentation is consistent with the brand guidelines (specifically button text colors and navigation badges).

**Acceptance Criteria:**
**Given** the UX Spec defines Primary Buttons as "Pacific Cyan with Black Text"
**When** I view the application
**Then** all `.btn-primary` elements should render with Black text (#000000) instead of White.
**And** the Navigation role badges (Admin, Trainer, Client) must use the Brand Palette (Pacific Cyan, Cerulean) instead of generic Purple/Blue/Green.

## Story 10.2: Button Component Standardization
As a developer,
I want to replace inconsistent raw HTML buttons in the Admin Dashboard with the standardized `CTAButton` component,
So that all admin actions have a unified "Black Glass" look and feel and maintainable code structure.

**Acceptance Criteria:**
**Given** I am on any Admin page (Users, Classes, Exercises)
**When** I interact with an action button (Add, Edit, Delete)
**Then** it should be rendered using the `<CTAButton>` or `<Button>` component.
**And** there should be no raw `<button className="...">` usages for primary actions in these files.

## Story 10.3: Testability Hardening
As a QA engineer,
I want critical interactive elements to have stable `data-testid` attributes,
So that automated E2E tests are resilient to copy changes and visual updates.

**Acceptance Criteria:**
**Given** the critical user flows (Login, Booking, Workout Logging)
**When** I inspect the DOM
**Then** key elements (Submit buttons, Input fields, Navigation links) must have a `data-testid` attribute (e.g., `data-testid="login-submit"`).
**And** the Playwright/Cypress tests should be updated to use these selectors where applicable.

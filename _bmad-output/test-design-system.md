# System-Level Site Review & Test Design

## Executive Summary
This document serves as the "Top Down Site Review" focused on Design Consistency and UI Testability, as requested. It evaluates the current codebase against the **Tidal Power Fitness UX Design Specification**.

## 1. Design Consistency Assessment

### 1.1 Button Consistency
*   **Specification:** Primary Buttons should be "Solid Pacific Cyan with **Black** text".
*   **Implementation (`globals.css`):** `.btn-primary` is defined with `color: #fefefe` (**White** text).
    *   **Severity:** Medium (Visual Deviation).
    *   **Recommendation:** Update `globals.css` to use black text for primary buttons to match high-contrast "Black Glass" aesthetic, or update Spec if White is preferred for contrast against Cyan.
*   **Component Usage:**
    *   **Good:** `CTAButton.tsx` correctly leverages `globals.css` classes.
    *   **Issue:** Widespread usage of raw `<button>` elements with inconsistent styling (700+ matches).
    *   **Examples of Violation:**
        *   `frontend/src/app/contact/page.tsx`: Uses `btn-primary` (good) but hardcoded width/text sizes.
        *   `frontend/src/components/Navigation.tsx`: Uses `bg-purple-600`, `bg-blue-600`, `bg-green-600` for role badges/buttons (Brand Violation).
        *   `frontend/src/app/admin/users/page.tsx`: Uses raw `<button>` with hardcoded `text-gray-400` instead of `btn-ghost`.

### 1.2 Color Palette Adherence
*   **Specification:** Palette is Pacific Cyan, Cerulean, Obsidian Black, Flame Orange.
*   **Findings:**
    *   Hardcoded colors found: `text-turquoise-surf` (Classes Page), `text-green-300` (User Dashboard).
    *   `globals.css` defines standard CSS variables, but they are not consistently used in inline classNames.

### 1.3 Input & Form Consistency
*   **Specification:** "Black Glass Inputs" (`bg-white/5` with blur).
*   **Implementation:** `globals.css` defines `.input-field` with correct `backdrop-filter: blur(12px)`.
*   **Testability:** Inputs generally lack `data-testid` attributes, making automated UI testing brittle (relying on placeholders or labels which might change).

## 2. Testability Assessment

### 2.1 Component Isolation
*   **Observation:** Many buttons and inputs are embedded directly in `page.tsx` files rather than reusable components.
*   **Impact:** Hard to test "Button" behavior globally. Changing the button design requires updating hundreds of files.
*   **Score:** **CONCERNS**

### 2.2 Selector Resilience
*   **Observation:** Heavy reliance on text content (e.g., `cy.contains('button', 'Next')`) and generic selectors (`button[type="submit"]`).
*   **Risk:** Copy changes (e.g., "Next" -> "Continue") will break tests.
*   **Recommendation:** Enforce `data-testid` on all interactive elements.

## 3. Architecturally Significant Requirements (ASRs) - UX/Design

| Requirement | Design Implication | Test Strategy | Status |
| :--- | :--- | :--- | :--- |
| **"Black Glass" Aesthetic** | Heavy use of `backdrop-filter` and transparency. | Visual Regression Testing (Percy/Chromatic) required as functional tests won't catch visual bugs. | **Partially Met** |
| **Mobile-First Touch Targets** | Minimum 44px targets. | Automated accessibility scan + Manual mobile review. | **Review Needed** |
| **Instant Feedback ("Pulse")** | Framer Motion animations. | E2E tests must wait for animations/states (flakiness risk). | **Met** |

## 4. Remediation Plan

### Immediate Actions
1.  **Update `globals.css`**: Align `.btn-primary` text color with UX Spec (or vice versa).
2.  **Standardize Buttons**: Refactor `frontend/src/app/admin` pages to use `CTAButton` or a new `<Button>` primitive instead of raw HTML buttons.
3.  **Fix Navigation Colors**: Remove `purple/green/blue` hardcoded backgrounds in `Navigation.tsx` and map them to Brand colors or define semantic "Role" colors in `tailwind.config.ts`.
4.  **Add Test IDs**: Add `data-testid` to all primary action buttons to enable robust Playwright/Cypress testing.

## 5. Test Levels Strategy (Design System)

*   **Visual Regression (Storybook/Percy):** 100% coverage for Atoms (Buttons, Inputs, Cards).
*   **Component Tests (Cypress/Vitest):** Verify interaction states (Hover, Focus, Disabled) of shared components.
*   **E2E (Cypress):** Verify "Critical User Journeys" (Booking, Logging) flow correctly, regardless of specific pixel values.


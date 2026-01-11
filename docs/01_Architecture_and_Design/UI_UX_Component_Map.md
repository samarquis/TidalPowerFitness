# UI/UX Component & Interaction Map

This document maps the frontend component architecture and the "Luxury Vault" design system.

## 1. Design System: "The Luxury Vault"
*   **Aesthetic:** Black Glassmorphism (Dark theme withPacific Cyan/Cerulean accents, heavy backdrop-blur).
*   **Base Canvas:** Obsidian Black (#0a0a0a).
*   **Core UI Components (`/components/ui`):**
    *   **BlackGlassCard**: The standard container for all dashboard modules.
    *   **CTAButton**: Standardized action button with "Pacific Cyan" glow.
    *   **PulseIndicator**: Visual feedback for active states or notifications.
    *   **Skeleton**: Loading states for improved perceived performance.

## 2. Global Navigation & Layout
*   **Navigation.tsx**: 
    *   Handles role-based link visibility (Admin/Trainer/Client).
    *   Contains the **Credit Balance** display.
    *   Integrates `NotificationBell` for real-time alerts.
*   **CartContext**: Global state for the multi-item purchase flow.

## 3. Dashboard Architecture
*   **UserDashboard.tsx**: 
    *   **The Pulse**: Top-level stats (Workouts, Volume, Streak).
    *   **Interactive Calendar**: Visualizes booked classes with "Black Glass" styling.
    *   **Active Program Progress**: Quick-start link for the next workout in an assigned routine.
*   **ProgressDashboard.tsx**: 
    *   Visualizes historical volume trends using charts.
    *   Displays recent PRs (Personal Records).

## 4. Specialized Interaction Modules
*   **BatchEntryMatrix.tsx**: 
    *   **Context:** Used in the Trainer Log and Active Workout pages.
    *   **Design:** A "3-Text-Box" grid (Sets/Reps/Lbs) optimized for rapid touch entry in a gym environment.
    *   **Features:** Stepper controls and automated volume calculation.
*   **ClassSignupModal.tsx**: 
    *   Handles multi-attendee logic.
    *   Displays real-time credit deduction warning.
*   **FilterBar.tsx**: 
    *   Movement pattern filtering (Push/Pull/Legs).
    *   Muscle group categorization.

## 5. Animation Strategy
*   **Framer Motion Integration**:
    *   `FadeIn`: Standard entry transition for page sections.
    *   Layout transitions for list reordering (e.g., in the Workout Wizard).
    *   Confetti/Success animations upon workout completion.

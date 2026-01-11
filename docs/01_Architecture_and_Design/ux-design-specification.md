---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments: [
  "_bmad-output/project-context/project-context.md",
  "_bmad-output/planning-artifacts/epics.md",
  "_bmad-output/planning-artifacts/architecture.md",
  "docs/PROGRESS.md",
  "docs/TidalPower_PROGRESS.md",
  "docs/planning/SITE_REVIEW_REMEDIATION_PLAN.md",
  "temp/Site_review_1-3-26.md",
  "README.md"
]
---

# UX Design Specification Tidal Power Fitness

**Author:** Scott
**Date:** January 08, 2026

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision
Elevating Tidal Power Fitness to "100/100 World Class - Professional Grade." This involves a premium UI overhaul ("Black Glass" inputs, "Tsunami" color schemes), intelligent progressive overload engines, and high-fidelity feedback loops to create a luxury fitness management experience.

### Target Users
* **Clients**: Seeking an intuitive, motivating platform to track their fitness journey, book classes, and visualize progress with minimal friction.
* **Trainers**: Professional coaches requiring efficient, data-rich tools for workout programming, client oversight, and performance analysis.
* **Administrators**: Business owners managing the platform ecosystem, analytics, and user integrity.

### Key Design Challenges
* **Cognitive Load Management**: Streamlining complex fitness data (progressive overload, multi-week programs) for non-tech-savvy users.
* **Role-Based Consistency**: Maintaining a unified "Black Glass" aesthetic while catering to the distinct functional needs of Clients, Trainers, and Admins.
* **Mobile Optimization**: Ensuring the "Premium UI" feels responsive and snappy on all devices, especially for the high-frequency workout logging and booking tasks.

### Design Opportunities
* **Luxury Branding**: Utilizing the "Tsunami" color scheme and glassmorphism to establish a high-end market position.
* **Engagement Loops**: Leveraging "Mission Accomplished" states and AI coaching insights to drive long-term user retention and satisfaction.


## Core User Experience

### Defining Experience
The heartbeat of Tidal Power Fitness is the transition from "Doing a Workout" to "Mastering a Journey." The core experience is centered on high-frequency, low-friction data entry (Logging) paired with high-impact emotional feedback (Progressive Overload visual cues).

### Platform Strategy
* **Web-First PWA**: A responsive web application optimized for mobile-touch interactions on the gym floor.
* **Touch-Optimized**: Large targets for sweaty fingers, swipe gestures for list management, and biometric-style inputs.
* **Resilient Infrastructure**: PWA service workers to handle intermittent gym connectivity.

### Effortless Interactions
* **Guided Batch Entry**: Pre-filling workout logs with trainer targets or historical performance to minimize typing.
* **Automatic Overload Detection**: System-level intelligence that badges "Overload" moments in real-time without user calculation.
* **Contextual Dashboards**: Dynamic landing pages that surface the "Next Best Action" (e.g., Start Workout, Book Next Class) based on schedule and role.

### Critical Success Moments
* **The "Mission Accomplished" State**: A high-fidelity victory lap involving animations and summary data that validates the user's hard work.
* **The PR Breakthrough**: Instant visual recognition when a user hits a Personal Record.
* **Professional Continuity**: The moment a trainer sees a client's live data sync into their analytics suite, creating a closed-loop coaching experience.

### Experience Principles
1. **Frictionless Momentum**: Minimize clicks between starting the app and lifting the first weight.
2. **Motivating Intelligence**: Turn raw numbers into visual wins immediately.
3. **Luxury Stability**: Use the "Black Glass" aesthetic to provide a premium, reliable feel.
4. **Role-Specific Focus**: Prioritize the immediate utility for the current user's persona (Trainer vs. Client).


## Desired Emotional Response

### Primary Emotional Goals
*   **Empowered Elite**: Users should feel like they are using a professional-grade instrument to manage a high-performance lifestyle.
*   **Validated Accomplishment**: Every session should conclude with a meaningful sense of progress and recognition of hard work.

### Emotional Journey Mapping
*   **Discovery/Entry**: **Confidence**. The premium "Black Glass" aesthetic immediately signals a secure, elite environment.
*   **Core Execution (Logging)**: **Focus**. The UI minimizes distractions, allowing for a "flow state" during training.
*   **Completion**: **Exhilaration**. High-fidelity rewards (confetti, badges) provide the emotional payoff for physical exertion.
*   **Persistence**: **Belonging**. Streaks and community leaderboards foster a sense of being part of something bigger.

### Micro-Emotions
*   **Certainty**: Eliminating confusion through intuitive "Next Step" guidance.
*   **Momentum**: Small animations and haptic-style feedback that make data entry feel productive.
*   **Pride**: Visualizing personal records (PRs) the instant they happen.

### Design Implications
*   **Empowerment** → Sophisticated data visualizations that make complex trends easy to digest.
*   **Elite Status** → Deep dark themes with Pacific Cyan/Cerulean "Tsunami" accents.
*   **Habit Formation** → "Mission Accomplished" states that celebrate consistency over perfection.

### Emotional Design Principles
1.  **Immediate Gratification**: Celebrate every win, no matter how small, in real-time.
2.  **Professional Presence**: Maintain a clean, high-gravity aesthetic that avoids "gamifying" the app into a toy.
3.  **Supportive Partnership**: The interface should feel like it's coaching the user, not just recording them.


## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis
*   **Strong (Workout Tracking)**: Benchmarked for its elegant efficiency in data entry and clear rest-timer integration. It prioritizes the athlete's "flow state" above all else.
*   **Apple Fitness+**: A masterclass in visual gravity and habit formation. It uses premium photography and smooth transitions to create an aspirational, elite environment.
*   **Linear (Productivity)**: Serves as inspiration for our "Pro-Grade" tooling (Trainer Wizards), emphasizing speed, keyboard/shortcut efficiency, and a clutter-free interface.

### Transferable UX Patterns
*   **Intelligent Batch Entry**: Adapting the "Set/Rep/Weight" loop to include smart defaults based on trainer designs.
*   **Progressive Disclosure**: Using a clean mobile-first hierarchy where advanced analytics are tucked behind intentional interactions, preventing metric overload.
*   **Haptic-Style Visual Feedback**: Implementing subtle animations (Pulses, Badges) that simulate the tactical feel of a physical instrument.

### Anti-Patterns to Avoid
*   **Excessive Gamification**: Avoiding cartoonish, childish rewards that conflict with the "Elite" brand positioning.
*   **Hidden Primary Actions**: Ensuring that "Log Set" and "Next Exercise" are always high-visibility, primary touch targets.
*   **Navigation Bloat**: Preventing the "Gym Floor Friction" caused by deep, nested menu structures.

### Design Inspiration Strategy
*   **Adopt**: The "Dark Pro" aesthetic from high-end software to communicate reliability and professional utility.
*   **Adapt**: Standard SaaS dashboard patterns into a "Gym-Optimized" command center.
*   **Avoid**: High-friction login/re-auth loops that frustrate users during active training sessions.


## Design System Foundation

### 1.1 Design System Choice
A **Tailwind-Based Hybrid System** (Tailwind CSS + Shadcn/UI + Framer Motion). This architecture leverages utility-first styling for unique luxury branding paired with high-quality, accessible component primitives.

### Rationale for Selection
*   **Visual Fidelity**: Tailwind is essential for achieving the specific "Black Glass" and "Tsunami" aesthetic without the overhead of overriding rigid framework defaults.
*   **Execution Speed**: Shadcn/UI provides "Copy-and-Customize" primitives that allow for rapid UI assembly while maintaining full ownership of the source code.
*   **Motion Intelligence**: Framer Motion integration is critical for the "Mission Accomplished" states and high-fidelity micro-interactions required for a world-class feel.

### Implementation Approach
*   **Utility-First Styling**: All layout and core aesthetics managed via Tailwind classes.
*   **Radix-Based Primitives**: Using Radix UI (via Shadcn) for complex accessible components like modals, dropdowns, and tabs.
*   **Atomic Component Library**: Building a custom library of "Black Glass" atoms (Buttons, Inputs, Cards) to ensure system-wide consistency.

### Customization Strategy
*   **Tsunami Color Tokens**: Defining a strict palette of Pacific Cyan, Cerulean, and Obsidian Black within the 	ailwind.config.ts.
*   **Glassmorphism Utility**: Creating custom Tailwind plugins or classes for consistent backdrop-blur and border-transparency effects.
*   **Motion Presets**: Standardizing entrance/exit animations to ensure the app feels "snappy" yet fluid across all devices.


## Defining the Core Interaction: "The Pulse of Progress"

### 2.1 Defining Experience
The heartbeat of the platform is the **Instant Feedback Loop**. It transforms the administrative act of workout logging into a motivational game by triggering high-fidelity visual rewards (Pulses, Overload icons, PR badges) at the exact moment a set is completed.

### 2.2 User Mental Model
Shifting from "Retrospective Logger" to **"Active Training Partner."** Users expect the system to maintain their historical context and proactively signal when they are breaking new ground, moving the interaction from a chore to a psychological driver.

### 2.3 Success Criteria
*   **Zero-Latency Recognition**: Visual rewards must trigger instantly upon data submission to maximize the dopamine hit.
*   **Implicit Guidance**: Historical benchmarks must be present but secondary, serving as a silent coach that pre-loads targets.
*   **Tactile Satisfaction**: The interface must feel "pro-grade" and substantial, reflecting the physical effort of the user.

### 2.4 Novel UX Patterns
Combining **Batch Data Entry** with **Progress Intelligence Overlays**. We utilize dynamic glassmorphic badges that "glow" or pulse based on real-time data comparison against neon-backed historical trends.

### 2.5 Experience Mechanics
1.  **Initiation**: Dynamic "Start Scheduled Workout" button on the primary dashboard based on the current date and program.
2.  **Interaction**: Unified "Black Glass" entry field pre-loaded with target sets/reps from the trainer's plan.
3.  **Feedback**: A real-time evaluation engine that triggers "Overload" badges (🔥) and Pacific Cyan pulses when historical bests are exceeded.
4.  **Completion**: A high-fidelity "Mission Accomplished" state featuring confetti, summary charts, and immediate social-sharing readiness.


## Visual Design Foundation

### Color System
*   **Primary (Action)**: Pacific Cyan (#08acd6) – Used for high-priority pulses, success indicators, and core CTAs.
*   **Secondary (Branding)**: Cerulean (#007ba7) – Supporting accents and gradient depth.
*   **Background (Canvas)**: Obsidian Black (#0a0a0a) – Providing a deep, high-contrast environment.
*   **Surface (Component)**: **Black Glass** (rgba(255, 255, 255, 0.05) with 12px backdrop-blur) – Used for cards, modals, and navigation containers.
*   **Functional (Overload)**: Flame Orange (#ff4500) – High-visibility "Progressive Overload" indicators (🔥).

### Typography System
*   **Primary Typeface**: **Inter** (System Sans-Serif) – Selected for its extreme legibility on mobile devices and professional, modern tone.
*   **Heading Hierarchy**: Bold and Black weights with tight letter-spacing (-0.02em) to communicate power and precision.
*   **Body Hierarchy**: Regular and Medium weights for clear reading of workout data on the gym floor.
*   **Grid-Based Scale**: Utilizing a strict 8pt typography scale to ensure rhythm and vertical alignment.

### Spacing & Layout Foundation
*   **The 8px Base Unit**: All margins, padding, and component heights are multiples of 8 to ensure a mathematically consistent layout.
*   **"Dense-but-Clear" Density**: Prioritizing information density for workout logs while maintaining 44px+ touch targets for mobile accessibility.
*   **Z-Axis Hierarchy**: Using glassmorphism and subtle border glows to create clear depth and layer separation.

### Accessibility Considerations
*   **High-Contrast UI**: Ensuring all text-on-background combinations exceed WCAG AA standards.
*   **Thumb-Zone Architecture**: Placing critical "Logging" and "Finish" actions in the lower third of the screen for one-handed gym floor operation.


## Design Direction Decision

### Design Directions Explored
We explored six distinct visual directions, ranging from minimalist efficiency ("The Zen Athlete") to community-focused layouts ("Social Kinetic"). The exploration centered on balancing professional-grade data utility with a luxury "Elite" brand feeling.

### Chosen Direction
The final direction is a **Hybrid Architecture**:
*   **Structural Foundation**: "The Command Center" – Utilizing a tile-based, dashboard-centric navigation that surfaces high-priority actions based on real-time scheduling.
*   **Visual Fidelity**: "The Luxury Vault" – Adopting deep Obsidian Black canvases with heavy glassmorphic layering and high-contrast Pacific Cyan/Cerulean accents.

### Design Rationale
This hybrid approach addresses the "Pro-Tool" requirement for trainers and high-volume clients while maintaining the aspirational "Elite" branding. It ensures the app feels powerful and comprehensive without sacrificing the premium aesthetic that justifies its market positioning.

### Implementation Approach
*   **Layered Interactivity**: Using Framer Motion to manage transitions between tiles and detailed logs to simulate a "Vault" opening.
*   **Contextual Intelligence**: Implementing dynamic CTAs that change based on whether a workout is currently active, a class is upcoming, or analytics need review.


## User Journey Flows

### 3.1 The Progress Pulse (Workout Logging)
**Description**: A client starts their scheduled session and logs their performance, receiving instant validation and psychological momentum.

`mermaid
graph TD
    A[Dashboard: Start Workout Tile] --> B[Session Overview: View Exercises]
    B --> C[Active Logging: Set 1]
    C --> D{Is Result > PB?}
    D -- Yes --> E[Visual Pulse + Overload Badge]
    D -- No --> F[Standard Confirmation]
    E --> G[Rest Timer Start]
    F --> G
    G --> H{More Sets/Exercises?}
    H -- Yes --> C
    H -- No --> I[Finish Workout Button]
    I --> J[Mission Accomplished: Confetti + Stats]
    J --> K[Dashboard: Updated Streak/Analytics]
`

### 3.2 The Architect's Wizard (Workout Assignment)
**Description**: A trainer efficiently creates a structured session using the "Wizard" logic and publishes it to the platform.

`mermaid
graph TD
    A[Trainer Dashboard: Assign Workout] --> B[Step 1: Select Date & Time]
    B --> C[Step 2: Template or Custom?]
    C -- Template --> D[Browse & Select Template]
    C -- Custom --> E[Search & Add Exercises]
    D --> F[Step 3: Choose Recipient - Class/Client]
    E --> F
    F --> G[Step 4: Final Review & Notes]
    G --> H[Confirm & Publish]
    H --> I[Success Modal: Live on Dashboards]
`

### 3.3 The Class Commitment (Booking)
**Description**: A client manages their participation in the community by securing a spot in a class using their tokens.

`mermaid
graph TD
    A[User Dashboard: Book a Class] --> B[Calendar View: Select Date]
    B --> C[Class List: Choose Class]
    C --> D[Class Details Modal]
    D --> E{Has Credits?}
    E -- No --> F[Purchase Tokens CTA]
    E -- Yes --> G[Confirm Booking Button]
    G --> H[Success: Token Deducted + Confirmed]
    H --> I[Dashboard: Upcoming Class Tile]
`

### Journey Patterns
*   **Contextual Action Entry**: Primary journeys are always initiated from role-specific "Hero" tiles on the main dashboard.
*   **Progressive Data Disclosure**: Advanced information (exercise history, notes) is layered to maintain a high-density but uncluttered interface.
*   **Tactile Confirmation**: Use of pulses and distinct state changes to confirm successful data entry without requiring heavy reading.

### Flow Optimization Principles
1. **The Three-Tap Rule**: Getting into an active workout state must take no more than three intentional taps from the home screen.
2. **Predictive Entry**: Defaulting input values to the trainer's plan or the user's last successful performance to reduce manual entry.
3. **Loop Integrity**: Ensuring the user always has a clear path back to the Dashboard after completing a major task.


## Component Strategy

### Design System Components
We leverage **Shadcn/UI** (built on Radix UI) for all functional primitives, including:
*   **Navigation**: Tabs, Dropdowns, and Menus.
*   **Feedback**: Dialogs (Modals), Skeletons, and Progress Bars.
*   **Data Entry**: Standard Text Inputs, Checkboxes, and Radio Groups.

### Custom Components

#### 1. The Black Glass Card
**Purpose**: The universal container for all dashboard modules and workout logs.
**Anatomy**: g-white/5 with ackdrop-blur-xl, order-white/10, and a subtle shadow-2xl.
**States**: Hover state increases border opacity and scales the card to 1.02x using Framer Motion.

#### 2. Progressive Overload Pulse (Atom)
**Purpose**: To provide instant, non-verbal feedback when a user exceeds a historical performance baseline.
**Anatomy**: A Pacific Cyan glowing pulse or a Flame Orange 🔥 icon depending on the magnitude of the achievement.
**Interaction**: Triggers an immediate "Pulse" animation upon data entry that meets the "Overload" criteria.

#### 3. Batch Entry Matrix
**Purpose**: Optimized high-speed data entry for gym floor usage.
**Anatomy**: A grid-based input system that aligns Sets, Reps, and Weight in a high-density, touch-optimized rows.
**Behavior**: Intelligent pre-filling of values and "Tab-to-Next" equivalent for touch interactions.

### Component Implementation Strategy
*   **Standardized Primitives**: All components are wrapped in a unified "Black Glass" theme layer.
*   **Performance First**: Utilizing server components where possible, with client-side interactivity reserved for the complex logging matrices.
*   **Atomic Design**: Maintaining a strict separation between atoms (Pulse), molecules (Log Entry), and organisms (Full Workout Session).

### Implementation Roadmap
*   **Phase 1 (Foundational)**: Solidifying the Black Glass Card and standardizing Typography atoms.
*   **Phase 2 (Functional)**: Developing the Batch Entry Matrix and Wizard Step containers.
*   **Phase 3 (Motivational)**: Implementing the Pulse animation engine and Mission Accomplished celebration canvas.


## UX Consistency Patterns

### Button Hierarchy
*   **Primary Action**: Solid Pacific Cyan with Black text. Reserved for the definitive success action of a flow (e.g., "Confirm," "Publish," "Finish").
*   **Secondary Action**: Glassmorphic outline with Pacific Cyan/Cerulean border. Used for navigation and supporting choices (e.g., "Back," "View Details").
*   **Danger Action**: Subtle Red-tinted glass card. Reserved for destructive actions like "Delete" or "Deactivate."

### Feedback Patterns
*   **The Progress Pulse**: An immediate Pacific Cyan glow triggered when user data exceeds historical performance.
*   **Mission Accomplished**: A full-screen celebration state using high-fidelity animations and success-green themes upon task completion.
*   **Validation States**: Real-time field highlighting (Pacific Cyan for valid, Soft Red for errors) to prevent form submission friction.

### Form Patterns
*   **Batch-Focus Architecture**: Inputs optimized for sequential, high-speed entry (e.g., Sets/Reps/Lbs) with auto-advancing focus.
*   **Black Glass Inputs**: High-contrast, dark-themed fields with prominent typography to ensure readability in varying gym light conditions.

### Navigation Patterns
*   **Dashboard-Centricity**: A "Command Center" model where all primary user journeys are initiated from contextual dashboard tiles.
*   **The Vault Drill-Down**: Using expanding card animations to reveal deeper data layers (e.g., Workout History details) without losing overall session context.

### Additional Patterns
*   **Ghost Loading**: Glassmorphic skeleton loaders that mirror the final UI structure to eliminate layout shift and reduce perceived latency.
*   **Action-Oriented Empty States**: Every empty list (e.g., "No Bookings") must provide a primary CTA to resolve the state (e.g., "Browse Classes").


## Responsive Design & Accessibility

### Responsive Strategy
Tidal Power Fitness adopts a **Mobile-First, Pro-Utility** strategy.
*   **Mobile (Primary)**: Optimized for one-handed operation on the gym floor. Focuses on active logging, timers, and immediate feedback.
*   **Tablet (Secondary)**: Designed for trainers on-site. Uses a dual-pane layout to view client lists alongside the Assignment Wizard.
*   **Desktop (Management)**: Maximizes screen real estate for deep business analytics, complex program scheduling, and administrative user management.

### Breakpoint Strategy
*   **Mobile (sm/md)**: 320px - 767px. Single column, simplified "Action Tiles," and full-width log matrices.
*   **Tablet (lg)**: 768px - 1023px. Multi-column dashboards and persistent sidebar navigation for trainers.
*   **Desktop (xl/2xl)**: 1024px+. Expanded data visualizations, master calendar views, and multi-step wizard layouts.

### Accessibility Strategy
Targeting **WCAG AA Compliance** to ensure a professional and inclusive experience.
*   **Visual**: Strict contrast ratios for Pacific Cyan on Obsidian Black. Support for screen readers on all data labels.
*   **Tactile**: Minimum 44x44px touch targets for all gym-floor interactions to accommodate high-intensity environments.
*   **Cognitive**: Consistent iconography and clear "Success/Error" messaging to reduce mental load during physical exertion.

### Testing Strategy
*   **Cross-Device**: Rigorous testing on physical iOS and Android devices to verify "Black Glass" performance and touch response.
*   **Network Resilience**: Simulating "Gym Deadzones" to verify PWA service worker and offline logging capabilities.
*   **A11y Audits**: Automated Lighthouse audits combined with manual keyboard-only navigation sweeps.

### Implementation Guidelines
*   **Relative Units**: Using em and Tailwind's spacing units to ensure layout integrity across zoom levels.
*   **Semantic HTML**: Proper use of <main>, <nav>, <section>, and ARIA roles for complex custom components.
*   **Focus Management**: Ensuring the "Batch Entry Matrix" maintains logical focus flow for keyboard or scanner usage.



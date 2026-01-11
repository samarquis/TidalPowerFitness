# System Logic and Services Deep-Dive

This document details the specialized business logic encapsulated within the service layer of the Tidal Power Fitness platform.

## 1. Intelligence & Engagement Services

### AchievementService (`AchievementService.ts`)
*   **Purpose:** Monitors user activity to trigger "Badges of Honor" and PR (Personal Record) notifications.
*   **Logic:** Scans `exercise_logs` and `workout_sessions` upon session completion.
*   **Triggers:**
    *   **First Workout:** First session logged.
    *   **Volume Milestones:** 1k, 10k, 100k lbs lifted.
    *   **Consistency:** Streaks (3 days, 1 week, 1 month).
    *   **PRs:** Detecting highest weight lifted per exercise.

### AIService (`AIService.ts`)
*   **Purpose:** Drives the "Pulse of Progress" recommendation engine.
*   **Logic:** 
    1.  Analyzes volume distribution across `body_focus_areas` (Muscle Groups) over the last 30 days.
    2.  Identifies "Training Gaps" (areas with zero or significantly lower volume).
    3.  Selects 3 randomized exercises from the exercise library matching the gap area.
*   **Fallback:** Recommends based on the absolute least-trained area if no zero-volume areas exist.

### ChallengeService (`ChallengeService.ts`)
*   **Purpose:** Manages time-bound community challenges.
*   **Types:** 
    *   `total_workouts`: Count of sessions within a date range.
    *   `total_volume`: Sum of weight * reps across all exercises.
    *   `max_weight`: Highest single-set weight achieved.
*   **Sync Logic:** Recalculates `challenge_participants.progress` whenever a user completes a workout.

## 2. Financial & Credit Services

### PaymentService (`paymentService.ts`)
*   **Purpose:** Hub for Square Integration.
*   **Key Functions:**
    *   `createCartCheckoutSession`: Generates Square Checkout URLs for multi-item carts.
    *   `handleSquareWebhook`: Validates `order.created` or `payment.updated` events using signature verification.
    *   **Webhook Security:** Uses raw-body capture to verify `x-square-hmacsha256-signature`.
*   **Subscription Logic:** Handles recurring billing cycles and updates local `user_subscriptions` states.

### CreditService (`creditService.ts`)
*   **Purpose:** Low-level management of the `user_credits` table.
*   **Logic:** 
    *   `addCredits`: Increments `total_credits` and `remaining_credits`.
    *   `deductCredits`: Decrements `remaining_credits` upon class booking.
    *   `refundCredits`: Restores credits if a booking is cancelled within the allowed window.

## 3. Trainer & Management Services

### TrainerClientService (`TrainerClientService.ts`)
*   **Purpose:** Enforces privacy and relationship logic between trainers and clients.
*   **Relationship Logic:** A relationship is established if a client has ever booked a class instructed by that trainer.
*   **Access Control:** Limits `trainerController` lookups to only those clients within the established relationship.

### DemoDataService (`demoDataService.ts`)
*   **Purpose:** Generates high-fidelity test data for development and "View as User" modes.
*   **Features:**
    *   Generates 6 months of randomized workout history.
    *   Simulates realistic progressive overload (gradual weight increases).
    *   Populates charts, PRs, and achievements for empty environments.

## 4. Infrastructure Services

### BackupService (`backupService.ts`)
*   **Purpose:** Automated data protection.
*   **Logic:** Executes `pg_dump` via shell command daily at 3:00 AM.
*   **Retention:** Maintains a rolling 7-day archive in a secure local or cloud-mapped directory.

### NotificationService (`NotificationService.ts`)
*   **Purpose:** Multi-channel communication engine.
*   **Channels:** `In-App` (database-stored) and `Email` (via mock or SMTP).
*   **Integration:** Triggered by `BookingService`, `PaymentService`, and `AchievementService`.

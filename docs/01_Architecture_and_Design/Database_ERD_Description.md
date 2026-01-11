# Database ERD & Schema Description

This document provides a logical mapping of the Tidal Power Fitness database schema (PostgreSQL), organized by functional module.

## 1. Core Identity & Auth
*   **users**: The central user repository.
    *   `id` (UUID, PK)
    *   `email`, `password_hash`, `first_name`, `last_name`, `phone`
    *   `role` (Enum: 'admin', 'trainer', 'client')
    *   `is_active`, `is_demo_user`
    *   `current_streak`, `longest_streak`, `last_workout_date`
*   **trainer_profiles**: Extended information for trainers.
    *   `user_id` (FK -> users.id)
    *   `bio`, `profile_photo_url`, `specialties` (TEXT[])

## 2. Training Architecture (The Blueprint-Instance Model)

### Exercise Library
*   **exercises**: The global catalog of movements.
    *   `primary_muscle_group` (FK -> body_focus_areas)
    *   `movement_pattern` (Enum: 'push', 'pull', 'legs', 'core', 'cardio')
    *   `is_warmup`, `is_cooldown`
*   **body_focus_areas**: High-level groupings (Chest, Back, Legs, etc.).

### Blueprints (Templates)
*   **workout_templates**: Pre-defined workout routines.
*   **template_exercises**: Prescribed exercises for a template.
    *   `target_sets`, `target_reps`, `target_weight_lbs`

### Instances (Sessions)
*   **workout_sessions**: A specific workout event.
    *   `class_id` (FK, optional)
    *   `template_id` (FK, optional)
    *   `session_date`, `start_time`, `end_time`
*   **session_participants**: Links users to sessions.
*   **session_exercises**: Exercises performed during a session.
*   **exercise_logs**: Detailed set-by-set data.
    *   `weight_used_lbs`, `reps_completed`, `rpe` (Rate of Perceived Exertion)

## 3. Operations & Scheduling
*   **classes**: Scheduled group training events.
    *   `instructor_id` (FK -> users.id)
    *   `days_of_week` (INTEGER[])
*   **bookings**: Client reservations for classes.
    *   `user_id`, `class_id`, `booking_date`
    *   `status` ('confirmed', 'cancelled', 'attended')
    *   `attendee_count` (For multi-attendee bookings)
*   **trainer_availability**: Time slots where trainers are available for 1-on-1s.

## 4. Commerce & Credits
*   **packages**: Products available for purchase (e.g., "10 Class Pass").
*   **user_credits**: Ledger of purchased and remaining tokens.
    *   `total_credits`, `remaining_credits`, `expires_at`
*   **subscriptions**: Recurring membership definitions.
    *   `square_subscription_id`
    *   `tier` ('basic', 'elite', 'platinum')

## 5. Engagement & Social
*   **achievements**: Definition of earnable badges.
*   **user_achievements**: Junction table for earned rewards.
*   **challenges**: Community competitions.
*   **challenge_participants**: Tracks progress (`total_volume`, `total_workouts`) per user per challenge.

## 6. System Administration
*   **global_settings**: Key-value store for site-wide config (Pricing, Contact Info).
*   **changelogs**: Tracked updates to the platform.
    *   `tracking_number` (SR-XXX)
    *   `category` ('feature', 'bugfix', 'remediation')
*   **notifications**: In-app message log.

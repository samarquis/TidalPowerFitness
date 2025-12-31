# Tidal Power Fitness - Technical Architecture

## Overview
This document outlines the architectural decisions and data models for the Tidal Power Fitness platform, with a focus on Phase 2 enhancements including Structured Programming and Subscriptions.

## Core Design Patterns
- **Blueprint vs. Instance**: Workout Templates act as reusable blueprints, while Workout Sessions are specific instances where data is logged.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Clients, Trainers, and Admins.
- **Service-Oriented Logic**: Business logic encapsulated in Services (e.g., `AchievementService`, `PaymentService`) to keep controllers thin.

## Data Models

### Phase 1 Refresher (Existing)
- **users**: Unified user table with `roles` array (PostgreSQL `TEXT[]`).
- **workout_templates**: Reusable workout definitions created by trainers.
- **template_exercises**: Exercises linked to templates with prescribed sets/reps.
- **workout_sessions**: Logged workouts, optionally linked to a template.
- **session_exercises**: Actual sets/reps/weight performed during a session.

### Phase 2: Structured Programming (Epic 13)
To support multi-week routines, the following entities are introduced:

#### 1. programs
Defines a high-level training plan (e.g., "12-Week Powerbuilding").
| Column | Type | Description |
| :--- | :--- | :--- |
| id | UUID (PK) | Unique identifier |
| trainer_id | UUID (FK) | Creator of the program |
| name | VARCHAR | Program title |
| description | TEXT | Detailed explanation |
| total_weeks | INTEGER | Duration of the program |
| is_public | BOOLEAN | Whether other trainers can see/use it |

#### 2. program_templates
Junction table mapping templates to specific days/weeks within a program.
| Column | Type | Description |
| :--- | :--- | :--- |
| id | UUID (PK) | Unique identifier |
| program_id | UUID (FK) | Reference to `programs` |
| template_id | UUID (FK) | Reference to `workout_templates` |
| week_number | INTEGER | Target week |
| day_number | INTEGER | Target day (1-7) |
| order_in_day | INTEGER | Sort order if multiple workouts per day |

#### 3. program_assignments
Tracks a specific client's progress through an assigned program.
| Column | Type | Description |
| :--- | :--- | :--- |
| id | UUID (PK) | Unique identifier |
| client_id | UUID (FK) | The user following the program |
| program_id | UUID (FK) | The program being followed |
| trainer_id | UUID (FK) | The trainer who assigned it |
| start_date | DATE | Commencement date |
| current_week | INTEGER | Current progress week |
| status | ENUM | 'active', 'completed', 'paused', 'cancelled' |

### Phase 2: Communications & Notifications (Epic 15)
- **notifications**: Centralized log of system-generated messages.
| Column | Type | Description |
| :--- | :--- | :--- |
| id | UUID (PK) | Unique identifier |
| user_id | UUID (FK) | Recipient |
| type | VARCHAR | 'booking_confirmation', 'reminder', 'achievement' |
| title | VARCHAR | Notification heading |
| message | TEXT | Content |
| is_read | BOOLEAN | Read status |
| delivery_method | ENUM | 'email', 'in_app', 'both' |

## Technical Implementation Notes

### Program Instantiation Flow
1. User logs in and views "Today's Workout" on the dashboard.
2. System queries `program_assignments` for active programs.
3. System finds the `program_template` matching the client's current week/day progress.
4. If the user clicks "Start Workout", a new `workout_session` is created by copying exercises from the referenced `workout_template`.
5. Upon session completion, the `current_week`/`day` in `program_assignments` is updated via a transaction.

### Subscription Integration
- Leverage **Square Subscriptions API**.
- Webhook listener in `backend/src/services/paymentService.ts` to handle `subscription.created` and `subscription.updated`.
- New `user_subscriptions` table to link Square `subscription_id` to local `user_id` and track tier access.

# API Reference Catalog

This document provides a summary of the available API endpoints in the Tidal Power Fitness backend. All endpoints are prefixed with `/api`.

## 1. Authentication (`/auth`)
*   `POST /register`: Register a new user.
*   `POST /login`: Authenticate and receive a JWT (HttpOnly cookie).
*   `POST /logout`: Invalidate the current session.
*   `GET /profile`: Retrieve the current user's profile and credit balance.

## 2. Training & Workouts (`/workouts`, `/exercises`)
*   `GET /exercises`: List all exercises with muscle group and movement pattern filters.
*   `GET /workout-templates`: List all reusable workout blueprints.
*   `POST /workout-templates`: Create a new template (Trainers/Admins).
*   `GET /workout-sessions`: Retrieve workout history.
*   `POST /workout-sessions`: Log a new workout instance.
*   `GET /workout-sessions/summary`: Get celebration metrics for the most recent workout.

## 3. Classes & Bookings (`/classes`, `/bookings`)
*   `GET /classes`: List available classes and their schedules.
*   `GET /bookings/user/:userId`: List a user's upcoming and past class bookings.
*   `POST /bookings`: Book a class (supports `attendee_count`).
*   `DELETE /bookings/:id`: Cancel a booking (refunds credits if within window).

## 4. Financials (`/payments`, `/packages`)
*   `GET /packages`: List available credit packages.
*   `POST /payments/checkout-cart`: Initiate a Square checkout for cart items.
*   `POST /payments/webhook`: Square-generated callback for order fulfillment.

## 5. Trainer Operations (`/trainers`)
*   `GET /trainers/my-clients`: List unique clients linked to the trainer.
*   `GET /trainers/clients/:clientId/workouts`: View a specific client's history.
*   `GET /trainers/analytics`: Capacity and popular class metrics.

## 6. Social & Engagement (`/achievements`, `/challenges`, `/leaderboard`)
*   `GET /achievements`: List all available and earned badges.
*   `GET /challenges`: List active community challenges.
*   `GET /leaderboard`: Rankings by volume, workouts, or streak.

## 7. Administrative (`/admin`, `/setup`, `/migrations`)
*   `GET /admin/analytics/revenue`: Financial reporting.
*   `GET /admin/users`: Full user management list.
*   `POST /admin/users/:id/impersonate`: Start an impersonation session.
*   `GET /migrations`: View status of database schema updates.
*   `POST /setup/demo-data`: Trigger the `DemoDataService` for a user.

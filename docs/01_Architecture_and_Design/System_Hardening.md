# System Hardening & Enterprise Reliability

This document outlines the measures taken to transition the platform from "Professional Grade" to "Enterprise Grade," focusing on financial integrity, concurrency management, and system resilience.

## 1. Financial Idempotency (Square Webhooks)
To prevent "Double-Crediting" users during network retries or Square delivery issues, the system implements a strict idempotency layer.

*   **Mechanism:** `processed_webhooks` table.
*   **Logic:** Every incoming webhook is checked against its Square `event_id` within a database transaction.
*   **Implementation:** See `paymentService.ts -> handleSquareWebhook`.
*   **Safety:** If an event is re-delivered, the system recognizes the ID, rolls back the transaction, and returns a 200 OK without re-processing business logic.

## 2. Concurrency Control (Race Condition Prevention)
Critical resources, such as user credits, are protected against rapid-fire requests (e.g., a user double-clicking a "Book" button).

*   **Mechanism:** PostgreSQL Row-Level Locking (`SELECT ... FOR UPDATE`).
*   **Logic:** When credits are being deducted, the specific rows in `user_credits` are locked to the current transaction.
*   **Implementation:** See `UserCredit.ts -> deductCredit`.
*   **Result:** Even if two requests arrive at the same millisecond, they will be processed sequentially, ensuring a user never spends more than their actual balance.

## 3. Atomic Operations (Transactions)
Multi-step business processes are wrapped in `BEGIN...COMMIT` blocks to prevent "Partial Success" states (e.g., deducting credits but failing to create a booking).

*   **Key Flow: Class Bookings**
    *   Step A: Check credit balance.
    *   Step B: Deduct credits (with locking).
    *   Step C: Create booking record.
    *   **Guarantee:** If Step C fails, Step B is automatically rolled back by the database.
    *   **Implementation:** See `bookingController.ts -> createBooking`.

## 4. Security Baseline
*   **Authentication:** HttpOnly JWT Cookies (Prevents XSS-based token theft).
*   **CSRF Protection:** Custom header validation for all state-changing requests.
*   **Input Validation:** Strict `express-validator` schemas for every API endpoint.
*   **Type Safety:** Migration to `AuthenticatedRequest` pattern for all controllers to ensure session integrity.

## 5. Resilience & Monitoring
*   **Request Timeouts:** 10-second timeouts on the frontend to prevent UI hangs.
*   **Error Boundaries:** Granular React Error Boundaries to isolate component failures.
*   **Vault Sentry (Automated Error Tracking):** 
    *   **Logic:** Every uncaught frontend error or backend crash is captured, fingerprinted (SHA-256 deduplication), and logged to the `error_logs` table.
    *   **Automation:** New errors automatically trigger a **GitHub Issue** creation with an "AI Troubleshooting Prompt" pre-built for instant resolution.
    *   **Deduplication:** Prevents "Error Storms" by incrementing `occurrence_count` for existing fingerprints rather than spamming GitHub.
*   **Structured Logging:** Winston-based JSON logging for production log analysis.

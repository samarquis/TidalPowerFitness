# Testing, Automation & Seeding

This document outlines the validation and data generation strategies used to ensure the reliability and testability of the platform.

## 1. Automated Testing Suites

### Backend Unit Tests (Jest)
*   **Location:** `backend/src/__tests__` and `backend/src/**/__tests__`
*   **Focus:** API route logic, Service-layer business rules, and Database model queries.
*   **Key Command:** `npm test` (within `backend`)
*   **Database Isolation:** Uses `jest.setup-db-tests.js` to handle transaction rollbacks between tests.

### Frontend Unit Tests (Jest/RTL)
*   **Location:** `frontend/src/app/**/__tests__` and `frontend/src/components/__tests__`
*   **Focus:** Component rendering, Auth state management, and API client interceptors.
*   **Key Command:** `npm test` (within `frontend`)

### E2E Integration (Cypress)
*   **Location:** `cypress/e2e`
*   **Focus:** Full critical flows (e.g., Register -> Purchase Credits -> Book Class -> Attend).
*   **Key Command:** `npx cypress open`

## 2. Performance & Stress Testing

### The Swarm Runner (`/backend/src/scripts/stress_test`)
*   **Swarm (`swarm.ts`):** Orchestrates 15 concurrent virtual users firing 1,500 workout sessions to determine DB breaking points.
*   **Pressure (`pressure.ts`):** Simulates background read contention (complex analytics queries) while the swarm performs heavy writes.
*   **Factory (`seed_factory.ts`):** Rapidly seeds 1,500 unique workout templates to ensure unique query paths.

## 3. Data Seeding & Development Tools

### Initial Schema & Seed
*   **001_initial_schema.sql**: Baseline table structure.
*   **seed.sql**: Essential data (Body Focus Areas, Exercises, Default Admin User).

### Demo Data Engine (`demoDataService.ts`)
*   **Purpose:** Creating "Full" environments for QA and Demos.
*   **Logic:**
    *   Creates a `demo_user`.
    *   Generates 6 months of historical data.
    *   Injects randomized but realistic weight progressions to populate charts.
*   **Access:** Triggered via the `Admin -> Demo Users` dashboard.

### Cleanup Scripts
*   **cleanup-users.ts**: Removes load-test accounts and associated data.
*   **reset-password.ts**: Command-line utility for administrative password resets.

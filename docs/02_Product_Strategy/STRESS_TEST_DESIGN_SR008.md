# BMAD Test Architecture: Database Stress Test Design (SR-008)

## 1. Objective
To empirically determine the breaking point of the Tidal Power Fitness PostgreSQL database by simulating a high-concurrency, high-cardinality usage scenario.

**Target Metrics:**
- **Concurrent Users:** 15 active sessions
- **Total Unique Sessions:** ~1,500 (15 users × 100 workouts)
- **Data Cardinality:** High (Randomized exercises/muscles to defeat caching)
- **Write Volume:** ~22,500 log entries (1500 sessions × 5 exercises × 3 sets)

## 2. Architecture of the Test

We will implement a **"Swarm & Pressure"** architecture.

### Component A: The Factory (Data Generation)
Before the test starts, we must generate "cold" data to ensure the database isn't just serving cached repeated queries.
- **User Seeds:** Create 15 distinct `load_test_user_X` accounts.
- **Exercise Expansion:** Ensure at least 50+ distinct exercises exist across all muscle groups.
- **Template Explosion:** Programmatically generate 100 unique Workout Templates per user (total 1,500 templates), ensuring no two users share the same `template_id` to force unique query paths.

### Component B: The Swarm (Write Load)
A specialized Node.js script (`scripts/stress_test/swarm_runner.ts`) that spawns 15 "Workers".
Each Worker:
1.  Authenticates via API.
2.  Retrieves its assigned 100 templates.
3.  Enters a "Rapid Fire" loop:
    -   Creates a `WorkoutSession` from Template N.
    -   **Batch Logs** 5 exercises × 3 sets (15 writes) instantly.
    -   Completes the session.
    -   Moves to Template N+1.
    -   *Sleeps for random 100-500ms* (to simulate jitter).

### Component C: The Pressure (Read Contention)
To truly "overload" a DB, we must force it to Read while it Writes.
A separate "Admin Worker" will run in parallel, hitting expensive endpoints every 2 seconds:
- `GET /api/admin/analytics/revenue` (Aggregates payments)
- `GET /api/leaderboard?period=all_time` (Scans the very table being written to)
- `GET /api/trainers/reports` (Complex Joins)

## 3. Implementation Plan

### Step 1: `scripts/stress_test/seed_factory.ts`
- Clean previous load test data.
- Seed users and templates.

### Step 2: `scripts/stress_test/swarm.ts`
- The orchestration engine.
- Uses `p-limit` or native batched Promises to manage concurrency.
- Logs "Transactions Per Second" (TPS) to console.

### Step 3: Analysis
- We will monitor the `postgres` process CPU/RAM.
- We will look for `504 Gateway Timeouts` or `Deadlock Detected` errors in the logs.

## 4. Execution Command
```bash
npm run stress:init   # Sets up the 15 users & 1500 templates
npm run stress:fire   # Releases the swarm
```

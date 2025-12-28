# Implementation Plan: Trainer-Client Data Viewing

## Overview

Enable trainers to view workout data and history for clients who attend their classes. This leverages the existing class-booking relationship where trainers are linked to clients through the `classes` and `class_participants` tables.

## Existing Infrastructure ✅

The following components already exist and can be leveraged:

1. **Class-Trainer Relationship**: `classes.instructor_id` links trainers to their classes
2. **Class-Client Relationship**: `class_participants` table links clients to classes
3. **Workout Sessions**: `workout_sessions` table stores workout data with `session_participants`
4. **Backend Models**:
   - `WorkoutSession.getByTrainer()` - Get trainer's workout sessions
   - `WorkoutSession.getById()` - Get session details with participants
   - `User.findByRole('client')` - Get all clients

5. **Existing Endpoints**:
   - `GET /api/classes/:id/attendees` - Get class attendees
   - `GET /api/bookings/user/:userId` - Get user's bookings
   - `GET /api/workout-sessions` - Get workout sessions

---

## Proposed Changes

### Backend API

#### 1. New Endpoint: Get Trainer's Clients

**File**: [trainers.ts](file:///c:/Programming/TidalPowerFitness/backend/src/routes/trainers.ts)

```typescript
// GET /api/trainers/my-clients
// Returns all unique clients who have attended trainer's classes
router.get('/my-clients', authenticate, authorize('trainer', 'admin'), async (req, res) => {
    try {
        const trainerId = req.user.id;
        
        const result = await pool.query(`
            SELECT DISTINCT
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                COUNT(DISTINCT cp.id) as total_bookings,
                MAX(cp.booking_date) as last_booking_date
            FROM users u
            JOIN class_participants cp ON u.id = cp.user_id
            JOIN classes c ON cp.class_id = c.id
            WHERE c.instructor_id = $1
                AND cp.status = 'confirmed'
            GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone
            ORDER BY MAX(cp.booking_date) DESC
        `, [trainerId]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching trainer clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});
```

#### 2. New Endpoint: Get Client's Workout History (Trainer View)

**File**: [trainers.ts](file:///c:/Programming/TidalPowerFitness/backend/src/routes/trainers.ts)

```typescript
// GET /api/trainers/clients/:clientId/workouts
// Returns workout history for a specific client (only if trainer has taught them)
router.get('/clients/:clientId/workouts', authenticate, authorize('trainer', 'admin'), async (req, res) => {
    try {
        const trainerId = req.user.id;
        const { clientId } = req.params;
        
        // Verify trainer has taught this client
        const accessCheck = await pool.query(`
            SELECT 1 FROM class_participants cp
            JOIN classes c ON cp.class_id = c.id
            WHERE c.instructor_id = $1 AND cp.user_id = $2
            LIMIT 1
        `, [trainerId, clientId]);
        
        if (accessCheck.rows.length === 0 && !req.user.roles.includes('admin')) {
            return res.status(403).json({ error: 'You do not have access to this client' });
        }
        
        // Get workout sessions where client participated
        const result = await pool.query(`
            SELECT 
                ws.id,
                ws.session_date,
                ws.start_time,
                ws.notes,
                wt.name as workout_type_name,
                c.name as class_name,
                COUNT(DISTINCT se.id) as exercise_count
            FROM workout_sessions ws
            JOIN session_participants sp ON ws.id = sp.session_id
            LEFT JOIN workout_types wt ON ws.workout_type_id = wt.id
            LEFT JOIN classes c ON ws.class_id = c.id
            LEFT JOIN session_exercises se ON ws.id = se.session_id
            WHERE sp.client_id = $1
            GROUP BY ws.id, ws.session_date, ws.start_time, ws.notes, wt.name, c.name
            ORDER BY ws.session_date DESC, ws.start_time DESC
        `, [clientId]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching client workouts:', error);
        res.status(500).json({ error: 'Failed to fetch client workouts' });
    }
});
```

#### 3. Update Existing Endpoint: Workout Session Details

**File**: [workoutSessions.ts](file:///c:/Programming/TidalPowerFitness/backend/src/routes/workoutSessions.ts)

Ensure the existing `GET /api/workout-sessions/:id` endpoint includes authorization check for trainers viewing client data.

---

### Frontend Implementation

#### 1. New Page: My Clients

**File**: `frontend/src/app/trainer/clients/page.tsx` (NEW)

Create a new page listing all clients who have attended the trainer's classes.

**Features**:
- Grid/list view of clients
- Search/filter by name
- Click client to view their workout history
- Show total bookings and last attendance date

**UI Components**:
- Client card with avatar, name, email
- Stats: total classes attended, last attendance
- "View Workouts" button

#### 2. New Page: Client Workout History

**File**: `frontend/src/app/trainer/clients/[clientId]/page.tsx` (NEW)

Display detailed workout history for a specific client.

**Features**:
- Client info header (name, email, total workouts)
- Timeline of workout sessions
- Click session to view exercise details
- Filter by date range
- Export/print functionality

#### 3. Update Trainer Dashboard

**File**: [trainer/page.tsx](file:///c:/Programming/TidalPowerFitness/frontend/src/app/trainer/page.tsx)

Add "My Clients" section with:
- Quick stats (total clients, active this month)
- Recent clients list (last 5)
- "View All Clients" link to new page

---

## Implementation Steps

### Phase 1: Backend API (Estimated: 2 hours)

1. ✅ Add `GET /api/trainers/my-clients` endpoint
2. ✅ Add `GET /api/trainers/clients/:clientId/workouts` endpoint
3. ✅ Add authorization checks
4. ✅ Test endpoints with Postman/curl

### Phase 2: Frontend - Client List (Estimated: 2 hours)

1. ✅ Create `frontend/src/app/trainer/clients/page.tsx`
2. ✅ Fetch and display client list
3. ✅ Add search/filter functionality
4. ✅ Style with glassmorphism design
5. ✅ Add navigation from trainer dashboard

### Phase 3: Frontend - Client Details (Estimated: 2 hours)

1. ✅ Create `frontend/src/app/trainer/clients/[clientId]/page.tsx`
2. ✅ Fetch and display workout history
3. ✅ Add date range filter
4. ✅ Link to workout session details
5. ✅ Add back navigation

### Phase 4: Integration & Testing (Estimated: 1 hour)

1. ✅ Update trainer dashboard with client stats
2. ✅ Test full flow: dashboard → clients → client details → workout session
3. ✅ Verify authorization (trainer can only see their clients)
4. ✅ Test with multiple trainers and clients

---

## Database Queries Summary

### Get Trainer's Clients
```sql
SELECT DISTINCT u.id, u.first_name, u.last_name, u.email, u.phone,
       COUNT(DISTINCT cp.id) as total_bookings,
       MAX(cp.booking_date) as last_booking_date
FROM users u
JOIN class_participants cp ON u.id = cp.user_id
JOIN classes c ON cp.class_id = c.id
WHERE c.instructor_id = :trainerId AND cp.status = 'confirmed'
GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone
ORDER BY MAX(cp.booking_date) DESC
```

### Get Client's Workout History
```sql
SELECT ws.id, ws.session_date, ws.start_time, ws.notes,
       wt.name as workout_type_name, c.name as class_name,
       COUNT(DISTINCT se.id) as exercise_count
FROM workout_sessions ws
JOIN session_participants sp ON ws.id = sp.session_id
LEFT JOIN workout_types wt ON ws.workout_type_id = wt.id
LEFT JOIN classes c ON ws.class_id = c.id
LEFT JOIN session_exercises se ON ws.id = se.session_id
WHERE sp.client_id = :clientId
GROUP BY ws.id, ws.session_date, ws.start_time, ws.notes, wt.name, c.name
ORDER BY ws.session_date DESC, ws.start_time DESC
```

---

## Security Considerations

1. **Authorization**: Trainers can only view clients who have attended their classes
2. **Admin Override**: Admins can view all client data
3. **Data Privacy**: Only show necessary client information (no sensitive data)
4. **API Protection**: All endpoints require authentication and role-based authorization

---

## Testing Checklist

- [ ] Trainer can see list of their clients
- [ ] Trainer can view client's workout history
- [ ] Trainer CANNOT view clients they haven't taught
- [ ] Admin can view all clients
- [ ] Client data is accurate and up-to-date
- [ ] Search/filter functionality works
- [ ] Navigation flows correctly
- [ ] Mobile responsive design

---

## Estimated Total Time: 6-7 hours

**Ready to proceed with implementation?**

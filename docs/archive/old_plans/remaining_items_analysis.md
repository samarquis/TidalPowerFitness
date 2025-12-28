# Remaining TODO Items - Analysis & Recommendations

## Items Investigated

### 1. "Choose workout type" locked to "Use Template" ✓

**Status**: NOT A BUG - This is intentional

**Location**: [workouts/assign/page.tsx](file:///c:/Programming/TidalPowerFitness/frontend/src/app/workouts/assign/page.tsx#L331-L343)

**Explanation**: The "Create Custom" workout option is intentionally disabled with the label "Coming soon". This is a planned feature that hasn't been implemented yet.

```typescript
<label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg opacity-50 cursor-not-allowed">
    <input
        type="radio"
        name="workoutMode"
        value="custom"
        disabled  // ← Intentionally disabled
        className="mr-4 w-4 h-4"
    />
    <div>
        <div className="font-semibold text-gray-500">Create Custom</div>
        <div className="text-sm text-gray-600">Build a custom workout (Coming soon)</div>
    </div>
</label>
```

**Recommendation**: No action needed unless you want to implement the custom workout feature.

---

### 2. Templates not showing/being reusable ✓

**Status**: Backend code is CORRECT - Issue is likely data-related

**Investigation Results**:

✅ **Backend Route**: [workoutTemplates.ts](file:///c:/Programming/TidalPowerFitness/backend/src/routes/workoutTemplates.ts)
- Route exists: `GET /api/workout-templates`
- Requires authentication (trainer/admin)
- Properly configured

✅ **Backend Controller**: [workoutTemplateController.ts](file:///c:/Programming/TidalPowerFitness/backend/src/controllers/workoutTemplateController.ts#L6-L21)
- Correctly extracts `trainerId` from `req.user.id`
- Calls `WorkoutTemplate.getByTrainer(trainerId, includePublic)`
- Returns JSON array of templates

✅ **Backend Model**: [WorkoutTemplate.ts](file:///c:/Programming/TidalPowerFitness/backend/src/models/WorkoutTemplate.ts#L51-L70)
- Query joins with `workout_types` and `template_exercises`
- Includes exercise count
- Returns trainer's templates + public templates

✅ **Frontend**: [workouts/templates/page.tsx](file:///c:/Programming/TidalPowerFitness/frontend/src/app/workouts/templates/page.tsx#L45-L60)
- Fetches from `/api/workout-templates` with credentials
- Handles both array and object responses
- Displays templates in grid

**Possible Causes**:
1. **No templates exist in database** - User needs to create templates first
2. **User is not a trainer** - Only trainers/admins can see templates
3. **Database tables missing** - `workout_templates` table may not exist

**How to Test**:
1. Log in as a trainer
2. Navigate to `/workouts/templates/new`
3. Create a template with at least one exercise
4. Navigate to `/workouts/templates`
5. Template should appear in the list

**Recommendation**: Verify that:
- User has trainer role
- At least one template has been created
- Database migrations have been run (check for `workout_templates` table)

---

## Remaining Features to Implement

### 3. Enable trainers to view client data

**Status**: NEW FEATURE REQUIRED

**Description**: Trainers should be able to view workout data for their assigned clients (e.g., Lisa viewing Scott's workout history).

**Implementation Needed**:

1. **Database**: Create trainer-client relationships
   - New table: `trainer_clients` (trainer_id, client_id, assigned_date)
   - Or use existing class enrollment data

2. **Backend API**:
   - `GET /api/trainers/:trainerId/clients` - List trainer's clients
   - `GET /api/clients/:clientId/workouts` - Get client's workout history
   - Add authorization check: trainer can only view their own clients

3. **Frontend**:
   - Add "My Clients" section to trainer dashboard
   - Client detail page showing workout history
   - Workout session details with exercises, sets, reps, weights

**Estimated Effort**: Medium (4-6 hours)

---

### 4. Purchasing Process Testing

**Status**: TESTING REQUIRED

**Description**: Need to verify the complete flow: purchase package → receive credits → sign up for class → attend → view records.

**Test Plan**:

#### Step 1: Purchase Package
1. Navigate to `/packages`
2. Select a package
3. Click "Add to Cart"
4. Navigate to `/cart`
5. Click "Proceed to Checkout"
6. Complete mock payment at `/checkout/mock`
7. **Verify**: Credits added to user account

#### Step 2: Sign Up for Class
1. Navigate to `/classes`
2. Find a class with available spots
3. Click "Sign Up"
4. **Verify**: Credit deducted from account
5. **Verify**: Booking appears in user's bookings

#### Step 3: Attend Class
1. Trainer logs workout for the class
2. **Verify**: Workout session created
3. **Verify**: Exercises logged for participants

#### Step 4: View Records
1. Navigate to `/workouts/history`
2. **Verify**: Attended class appears in history
3. Click on workout session
4. **Verify**: Exercise details visible (sets, reps, weights)

**Backend Endpoints to Verify**:
- ✅ `POST /api/payments/checkout-cart` - Process purchase
- ✅ `POST /api/bookings` - Book class
- ✅ `GET /api/bookings/user/:userId` - Get user bookings
- ✅ `GET /api/workout-sessions` - Get workout history
- ⚠️ `POST /api/workout-sessions/:id/log` - Log workout (may need implementation)

**Recommendation**: Create a test script or checklist to verify each step systematically.

---

## Summary

| Item | Status | Action Required |
|------|--------|-----------------|
| Choose workout type locked | ✅ Not a bug | None - feature not implemented |
| Templates not showing | ✅ Code correct | Verify database has templates |
| View client data | ⚠️ Feature needed | Implement trainer-client relationship |
| Purchasing flow testing | ⚠️ Testing needed | Create test plan and execute |

**Next Steps**:
1. ✅ Verify templates exist in database or create one
2. 🔨 Implement trainer-client data viewing feature
3. 🧪 Execute purchasing flow test plan

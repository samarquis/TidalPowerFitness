# Implementation Plan: Bug Fixes & Feature Improvements

## Problem Summary

Multiple issues have been identified across the Tidal Power Fitness application that affect user experience and functionality:

1. **Login Redirect Issue**: After authentication, users are redirected to `/trainers` instead of their intended destination
2. **Trainer Dashboard Authentication**: Using deprecated Bearer token auth instead of HttpOnly cookies
3. **Availability Page**: Missing Link import causing compilation error
4. **User Management UI**: Table controls overflow and don't fit properly on smaller screens
5. **Trainer Edit Profile**: Update button not working (needs investigation)

## User Review Required

> [!IMPORTANT]
> **Authentication Pattern Change**
> The trainer dashboard and availability pages currently use `Authorization: Bearer ${token}` headers. We'll update these to use `credentials: 'include'` to match the rest of the application's HttpOnly cookie pattern. This ensures consistent authentication across all pages.

> [!WARNING]
> **Testing Required**
> After implementing these fixes, you'll need to test the full authentication flow:
> - Create workout template → login → verify redirect back to template creation
> - View workout history → login → verify redirect back to history
> - Trainer availability slot creation
> - User management table on mobile/tablet devices

## Proposed Changes

### Authentication & Routing Fixes

#### [MODIFY] [page.tsx](file:///c:/Programming/TidalPowerFitness/frontend/src/app/login/page.tsx)

**Issue**: Line 16 defaults redirect to `/trainers` instead of respecting the `redirect` query parameter.

**Fix**: Change default redirect to `/` (home page) so users without a redirect parameter go to a neutral location.

```diff
- const redirectPath = searchParams.get('redirect') || '/trainers';
+ const redirectPath = searchParams.get('redirect') || '/';
```

---

### Trainer Dashboard Authentication

#### [MODIFY] [page.tsx](file:///c:/Programming/TidalPowerFitness/frontend/src/app/trainer/page.tsx)

**Issue**: Lines 82-85 and 103-105 use deprecated Bearer token authentication instead of HttpOnly cookies.

**Fix**: Replace `Authorization` headers with `credentials: 'include'` to use cookie-based auth.

**Changes**:
- Line 82-86: `fetchClasses()` - Remove Authorization header, add credentials
- Line 102-106: `fetchSessions()` - Remove Authorization header, add credentials  
- Line 123-127: `fetchAttendees()` - Remove Authorization header, add credentials

---

### Availability Page Fixes

#### [MODIFY] [page.tsx](file:///c:/Programming/TidalPowerFitness/frontend/src/app/trainer/availability/page.tsx)

**Issue 1**: Missing `Link` import from `next/link` (line 154 uses Link but it's not imported).

**Fix**: Add import statement at the top of the file.

```typescript
import Link from 'next/link';
```

**Issue 2**: Line 46 and 121-126 use inconsistent authentication (no credentials for GET, Bearer token for DELETE).

**Fix**: Add `credentials: 'include'` to all fetch calls for consistency.

---

### User Management UI

#### [MODIFY] [page.tsx](file:///c:/Programming/TidalPowerFitness/frontend/src/app/admin/users/page.tsx)

**Issue**: Table layout doesn't handle overflow well on smaller screens. The role checkboxes and action buttons cause horizontal scrolling.

**Fix**: 
1. Add responsive wrapper with horizontal scroll for mobile
2. Make action buttons stack vertically on mobile
3. Add min-width to table to prevent crushing
4. Consider making role badges wrap or use a dropdown on mobile

**Changes**:
- Line 228: Add `overflow-x-auto` wrapper (already present, but ensure it works)
- Line 279-303: Refactor action buttons to be more compact or use a dropdown menu on mobile
- Line 250-268: Consider making role checkboxes more compact or use a different UI pattern for mobile

---

### Trainer Edit Profile Investigation

#### [INVESTIGATE] Trainer Edit Profile Button

**Issue**: User reports "Update Trainer button is not working"

**Action**: Need to locate the trainer edit profile page and investigate:
1. Find the file (likely in `/app/trainer/profile` or `/app/admin/trainers`)
2. Check if API endpoint exists and is correct
3. Verify form submission handler
4. Check for console errors
5. Ensure proper authentication

---

## Verification Plan

### Automated Tests

#### Backend API Tests
```bash
cd backend
npm test
```
**What it tests**: Authentication endpoints, user roles, class management

#### Frontend Build Test
```bash
cd frontend
npm run build
```
**What it tests**: TypeScript compilation, missing imports, syntax errors

### Browser Testing

#### Test 1: Workout Template Creation Redirect
1. Log out of the application
2. Navigate to `/workouts/templates/new`
3. You should be redirected to `/login?redirect=/workouts/templates/new`
4. Enter credentials and log in
5. **Expected**: You should be redirected back to `/workouts/templates/new`
6. **Current Bug**: You get redirected to `/trainers` instead

#### Test 2: Workout History Redirect
1. Log out of the application
2. Navigate to `/workouts/history`
3. You should be redirected to `/login?redirect=/workouts/history`
4. Enter credentials and log in
5. **Expected**: You should be redirected back to `/workouts/history`
6. **Current Bug**: You get redirected to `/trainers` instead

#### Test 3: Trainer Dashboard Classes
1. Log in as a trainer
2. Navigate to `/trainer`
3. **Expected**: "My Classes" section should load and display classes assigned to you
4. **Test**: Verify classes are fetched using cookie authentication (check Network tab)

#### Test 4: Availability Slot Creation
1. Log in as a trainer
2. Navigate to `/trainer/availability`
3. Click "+ Add Availability Slot"
4. Fill in the form (select day, start time, end time)
5. Click "Add"
6. **Expected**: Slot should be created successfully
7. **Current Bug**: May show "No token provided" error

#### Test 5: User Management on Mobile
1. Log in as admin
2. Navigate to `/admin/users`
3. Resize browser to mobile width (375px)
4. **Expected**: Table should be scrollable horizontally or stack responsively
5. **Current Bug**: Controls don't fit properly

### Manual Verification

After deploying changes, please test:
- [ ] Login redirect works for all protected pages
- [ ] Trainer dashboard loads classes correctly
- [ ] Availability slots can be created/edited/deleted
- [ ] User management table is usable on mobile devices
- [ ] Trainer profile edit button works (after investigation)


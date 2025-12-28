# Purchasing Flow Testing Guide

## Overview

This guide provides step-by-step instructions for testing the complete purchasing and credit usage flow in the Tidal Power Fitness application.

**Flow**: Browse Packages → Add to Cart → Purchase → Receive Credits → Book Class → Attend → View Records

---

## Prerequisites

- ✅ Backend server running (`npm run dev` in backend directory)
- ✅ Frontend server running (`npm run dev` in frontend directory)
- ✅ Database migrations applied
- ✅ At least one package exists in database
- ✅ At least one class exists in database
- ✅ User account created (client role)

---

## Test Flow

### Step 1: Browse Packages

**URL**: `/packages`

**Actions**:
1. Navigate to packages page
2. View available packages
3. Verify each package shows:
   - Package name
   - Description
   - Credit count
   - Price (in dollars)
   - Duration (if applicable)
   - "Add to Cart" button

**Expected Result**: ✅ Packages display correctly with all information

---

### Step 2: Add Package to Cart

**Actions**:
1. Click "Add to Cart" on a package
2. Verify success message appears
3. Check cart icon updates with item count

**API Endpoint**: `POST /api/cart/items`

**Request**:
```json
{
  "package_id": "uuid-here",
  "quantity": 1
}
```

**Expected Result**: ✅ Package added to cart successfully

---

### Step 3: View Cart

**URL**: `/cart`

**Actions**:
1. Navigate to cart page
2. Verify cart shows:
   - Package name and details
   - Quantity
   - Price per item
   - Total price
   - Credit count
   - Remove button
   - Update quantity controls

**API Endpoint**: `GET /api/cart`

**Expected Result**: ✅ Cart displays all items correctly

---

### Step 4: Proceed to Checkout

**Actions**:
1. Click "Proceed to Checkout" button
2. Verify redirect to mock checkout page

**API Endpoint**: `POST /api/payments/checkout-cart`

**Response**:
```json
{
  "url": "http://localhost:3000/checkout/mock?cart=base64-encoded-cart-data"
}
```

**Expected Result**: ✅ Redirected to `/checkout/mock` with cart data

---

### Step 5: Complete Mock Payment

**URL**: `/checkout/mock`

**Actions**:
1. Review order summary
2. Verify total price matches cart
3. Click "Complete Purchase" button
4. Wait for confirmation

**API Endpoint**: `POST /api/payments/confirm-mock`

**Request**:
```json
{
  "items": [
    {
      "packageId": "uuid-here",
      "quantity": 1
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Mock cart payment successful",
  "total_credits_added": 10,
  "items": [...]
}
```

**Expected Result**: ✅ Payment processed, credits added to account

---

### Step 6: Verify Credits Received

**URL**: `/profile`

**Actions**:
1. Navigate to profile page
2. Check credit balance
3. Verify credits match purchased amount

**API Endpoint**: `GET /api/auth/profile`

**Response** (includes):
```json
{
  "user": {...},
  "credits": {
    "total": 10,
    "available": 10,
    "used": 0
  }
}
```

**Expected Result**: ✅ Credits appear in user profile

---

### Step 7: Browse Classes

**URL**: `/classes`

**Actions**:
1. Navigate to classes page
2. View available classes
3. Find a class with available spots
4. Verify each class shows:
   - Class name
   - Instructor name
   - Schedule (day/time)
   - Duration
   - Category
   - Available spots
   - "Sign Up" button

**API Endpoint**: `GET /api/classes`

**Expected Result**: ✅ Classes display with all information

---

### Step 8: Book a Class

**Actions**:
1. Click "Sign Up" on a class
2. Confirm booking (if confirmation dialog appears)
3. Verify success message
4. Check credit balance decreases

**API Endpoint**: `POST /api/bookings`

**Request**:
```json
{
  "class_id": "uuid-here"
}
```

**Response**:
```json
{
  "message": "Class booked successfully",
  "booking": {
    "id": "booking-uuid",
    "class_id": "class-uuid",
    "user_id": "user-uuid",
    "status": "confirmed",
    "credits_used": 1,
    "booking_date": "2025-12-13T..."
  }
}
```

**Expected Result**: ✅ Class booked, 1 credit deducted

---

### Step 9: View Bookings

**URL**: `/profile` (or dedicated bookings page)

**Actions**:
1. Navigate to bookings section
2. Verify booked class appears
3. Check booking shows:
   - Class name
   - Date and time
   - Instructor
   - Status (confirmed)
   - Credits used
   - Cancel button

**API Endpoint**: `GET /api/bookings/user/:userId`

**Expected Result**: ✅ Booking appears in user's bookings list

---

### Step 10: Attend Class (Simulated)

**Note**: This step is typically performed by the trainer logging the workout session.

**Trainer Actions**:
1. Trainer logs in
2. Navigates to class management
3. Logs workout for the class
4. Marks exercises completed

**Expected Result**: ✅ Workout session created with client as participant

---

### Step 11: View Workout History

**URL**: `/workouts/history`

**Actions**:
1. Navigate to workout history page
2. Verify attended class appears
3. Click on workout session
4. View exercise details

**API Endpoint**: `GET /api/workout-sessions`

**Expected Result**: ✅ Workout session appears in history with exercise details

---

### Step 12: Cancel Booking (Optional)

**Actions**:
1. Navigate to bookings
2. Click "Cancel" on a booking
3. Confirm cancellation
4. Verify credit refunded

**API Endpoint**: `DELETE /api/bookings/:bookingId`

**Response**:
```json
{
  "message": "Booking cancelled successfully",
  "credits_refunded": 1
}
```

**Expected Result**: ✅ Booking cancelled, credit refunded to account

---

## Verification Checklist

### Package Purchase
- [ ] Packages display correctly
- [ ] Add to cart works
- [ ] Cart shows correct items and totals
- [ ] Checkout redirects to mock payment
- [ ] Mock payment processes successfully
- [ ] Credits added to user account
- [ ] Cart cleared after purchase

### Credit Management
- [ ] Credits display in profile
- [ ] Credit balance updates after purchase
- [ ] Credit balance decreases after booking
- [ ] Credits refunded after cancellation
- [ ] Expired credits handled correctly (if applicable)

### Class Booking
- [ ] Classes display with availability
- [ ] Booking requires sufficient credits
- [ ] Booking prevents duplicate sign-ups
- [ ] Booking confirmation appears
- [ ] Bookings list shows all user bookings

### Workout Tracking
- [ ] Trainer can log workout for class
- [ ] Workout session created with participants
- [ ] Client can view workout in history
- [ ] Exercise details visible
- [ ] Workout stats calculated correctly

---

## Edge Cases to Test

### Insufficient Credits
1. User has 0 credits
2. Try to book a class
3. **Expected**: Error message "Insufficient credits"

### Duplicate Booking
1. User books a class
2. Try to book same class again
3. **Expected**: Error message "Already booked for this class"

### Class Full
1. Class reaches max capacity
2. Try to book the class
3. **Expected**: Error message "Class is full"

### Expired Credits
1. Credits with expiration date pass
2. Try to use expired credits
3. **Expected**: Only non-expired credits available

---

## Backend Test Suite

The backend includes comprehensive integration tests for the entire flow:

**File**: `backend/src/routes/__tests__/booking-flow.test.ts`

**Run tests**:
```bash
cd backend
npm test -- booking-flow
```

**Tests cover**:
- ✅ User registration
- ✅ Package browsing
- ✅ Add to cart
- ✅ Cart validation
- ✅ Mock payment processing
- ✅ Credit assignment
- ✅ Class booking
- ✅ Duplicate booking prevention
- ✅ Booking cancellation
- ✅ Credit refund

---

## API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/packages` | GET | List packages |
| `/api/cart` | GET | Get user's cart |
| `/api/cart/items` | POST | Add item to cart |
| `/api/cart/items/:id` | PUT | Update cart item |
| `/api/cart/items/:id` | DELETE | Remove from cart |
| `/api/cart` | DELETE | Clear cart |
| `/api/payments/checkout-cart` | POST | Create checkout session |
| `/api/payments/confirm-mock` | POST | Process mock payment |
| `/api/auth/profile` | GET | Get user profile with credits |
| `/api/classes` | GET | List classes |
| `/api/bookings` | POST | Book a class |
| `/api/bookings/user/:userId` | GET | Get user bookings |
| `/api/bookings/:id` | DELETE | Cancel booking |
| `/api/workout-sessions` | GET | Get workout history |

---

## Common Issues & Solutions

### Issue: Cart is empty after adding item
**Solution**: Check browser console for errors, verify API endpoint is correct

### Issue: Credits not appearing after purchase
**Solution**: Refresh profile page, check backend logs for errors

### Issue: Cannot book class
**Solution**: Verify user has sufficient credits, class is not full, not already booked

### Issue: Workout history empty
**Solution**: Ensure trainer has logged workout for the class, check session participants

---

## Success Criteria

✅ **Complete Flow Success**: User can purchase credits, book a class, attend (simulated), and view workout history

✅ **Credit Tracking**: Credits correctly added, deducted, and refunded throughout the flow

✅ **Data Integrity**: All bookings, payments, and workout sessions properly recorded in database

✅ **User Experience**: Clear feedback at each step, error handling for edge cases

---

## Next Steps

After completing manual testing:

1. Document any bugs found
2. Create automated E2E tests for critical paths
3. Test with real payment provider (Square) when ready
4. Load test with multiple concurrent users
5. Test mobile responsiveness of all pages

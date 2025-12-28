# Fixing Client Dashboard and Navigation

The user has identified several key issues with the client experience:
1.  **Cart not clearing:** After a mock purchase, items remain in the cart.
2.  **Missing Credit Balance:** Users cannot see how many credits they have.
3.  **Hidden Classes Link:** The "Classes" link is missing for logged-in users, making navigation unintuitive.

## Proposed Changes

### 1. Navigation Updates
**File:** `frontend/src/components/Navigation.tsx`
- **Change:** Add a direct "Classes" link to the authenticated user navigation menu.
- **Reason:** Users currently have to guess that clicking the logo goes to home/classes. This fits the user's feedback that "I do not see the classes until i click on the 'Tidal Power Fitness'".

### 2. Profile Page Updates
**File:** `frontend/src/app/profile/page.tsx`
- **Change:** Add a "Credits" display to the stats section on the profile page.
- **Reason:** Users need to verify that their purchase resulted in usable credits.
- **Implementation:**
    - Use `apiClient.getUserCredits(user.id)` to fetch the credit balance.
    - Display it prominently alongside "Workouts" and "Volume Lifted".

### 3. Checkout Fixes
**File:** `frontend/src/app/checkout/mock/page.tsx`
- **Change:** Integrate `CartContext` to properly clear the cart after a successful purchase.
- **Reason:** The current implementation attempts to clear the cart via a fetch call but doesn't update the global context state, leading to a stale cart UI.
- **Implementation:**
    - Import `useCart` hook.
    - Call `clearCart()` from the context instead of a raw fetch call.

## Verification Plan

### Automated Tests
- None required (UI/Flow logic).

### Manual Verification
1.  **Navigation:** Log in and verify "Classes" link appears in the navbar.
2.  **Purchase Flow:**
    - Add item to cart.
    - Complete mock purchase.
    - **Verify:** Cart icon count drops to 0.
3.  **Profile:**
    - Go to `/profile`.
    - **Verify:** "Credits Available" is shown with the correct amount.

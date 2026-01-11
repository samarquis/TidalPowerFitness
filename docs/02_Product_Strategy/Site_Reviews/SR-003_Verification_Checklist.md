# SR-003 Verification Checklist

This checklist is provided to help you review the Tidal Power Fitness site and verify that all issues identified in Site Review SR-003 have been addressed and fixed. Please use the checkboxes to mark items as confirmed.

---

## Part 1: Workflows & Dashboards

### ✅ Trainer Workflow Enhancements (Item 014)
- [ ] **Trainer Dashboard CTA:** Verify the prominent "Program Builder" / "Assign Workout" card is present and functional on the Trainer Dashboard, leading to the workout assignment wizard.

### ✅ User Dashboard Improvements (Item 009)
- [ ] **Calendar Booking Dots:** Confirm that the calendar now accurately shows green dots for days with *actual booked classes* (date-specific), and not just days with scheduled classes.
- [ ] **Upcoming Classes - Date/Time:** Verify that the "Upcoming Classes" list displays the full date (e.g., "Mon, Jan 4") and time for each booking.
- [ ] **Upcoming Classes - Clickable:** Confirm that clicking an item in the "Upcoming Classes" list navigates the calendar to that specific booking date.
- [ ] **Text Visibility:** Verify that text within User Dashboard cards and sections is clearly readable in both **Light Mode** and **Dark Mode**.

### ✅ Admin Dashboard Functionality (Item 012)
- [ ] **Admin Dashboard Landing Page:** Confirm that navigating to `/admin` now displays a functional dashboard with links to all administrative modules, instead of a 404 error.

### ✅ Active Workout Session (Item 013)
- [ ] **"Finish Workout" Button:** Verify that the "Active Workout" page now includes a clearly visible "Finish Workout" button to allow users to end a session.

---

## Part 2: UI & Theming (Light Mode Specifics)

### ✅ Global Light Mode Visibility (Items 001, 004, 007)
- [ ] **Packages Page:** Verify that the Packages page (main header, card text) is fully readable and visually correct in both **Light Mode** and **Dark Mode**.
- [ ] **Classes Page:** Verify that the Classes page (main header, credit display, class details) is fully readable and visually correct in both **Light Mode** and **Dark Mode**.
- [ ] **Leaderboard Page:** Verify that the Leaderboard page (main header, table text) is fully readable and visually correct in both **Light Mode** and **Dark Mode**.
- [ ] **Trainer Dashboard:** Verify that the Trainer Dashboard (main header, card text) is fully readable and visually correct in both **Light Mode** and **Dark Mode**.
- [ ] **Admin Dashboard:** Verify that the Admin Dashboard (main header, card text) is fully readable and visually correct in both **Light Mode** and **Dark Mode**.

### ✅ Token Display (Item 005)
- [ ] **Navigation Bar Tokens:** Confirm that the token/credit display in the main navigation bar has an improved, more prominent visual style.

---

## Part 3: Data & Logic Specifics

### ✅ Monthly Subscriptions Removal (Item 003)
- [ ] **Packages Page - No Subscriptions:** Verify that there are no "Monthly Subscriptions" options or toggles visible on the Packages page. Only one-time token packages should be displayed.

### ✅ Classes Page Default View (Item 008)
- [ ] **"All Days" Default:** Confirm that when you first navigate to the Classes page, it defaults to showing classes for "All" days, rather than just the current day.

### ✅ Leaderboard Number Formatting (Item 009 - Leaderboard)
- [ ] **Comma Formatting:** Verify that large numbers (e.g., total volume) on the Leaderboard are now formatted with commas (e.g., `1,234,567`).

### ✅ Demo Data Generation (Item 010)
- [ ] **Class Attendance in Demo:** If you enable Demo Mode, verify that demo users now have simulated class attendance data (not just workout logs), populating relevant dashboards and calendars.

### ✅ Lisa Baumgard User (Item 011)
- [ ] **Lisa Baumgard Seeded:** Confirm that the user "Lisa Baumgard" (email: `lisa.baumgard@tidalpower.com`) exists in the system with appropriate admin/owner roles.
- [ ] **Demo Mode Access for Lisa:** Verify that Lisa Baumgard's account can also toggle Demo Mode.

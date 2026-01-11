# Story 1.4: Mobile-First Management Tables

Status: done

## Story

As an admin,
I want the User Management table to be fully usable on mobile devices,
so that I can manage the platform on the go.

## Acceptance Criteria

1. **Responsive Refactor**: Given I am on the User Management page on a mobile device (width < 768px), when I view the users table, then the layout should pivot to a card-based view or use a horizontal scroll mechanism that doesn't break the container.
2. **Touch-Optimized Actions**: All primary management actions (Active/Inactive toggle, Role checkboxes, Password reset) must have a minimum touch target size of 44x44px.
3. **Data Integrity**: The simplified mobile view must still display critical identifiers (Name, Email, Roles) and current status.

## Tasks / Subtasks

- [x] **Frontend: Implement Responsive User Table** (AC: 1, 3)
  - [ ] Modify rontend/src/app/admin/users/page.tsx to include a mobile-specific view (e.g., hidden on desktop, visible on mobile).
  - [x] Implement a card-based layout for mobile that displays User Name, Roles, and Status in a vertical stack.
- [x] **Frontend: Optimize Touch Targets** (AC: 2)
  - [x] Increase padding and size for checkboxes and action buttons in the mobile view.
  - [ ] Ensure the 'Black Glass' styling is preserved in the mobile card design.
- [x] **Frontend: Global Table Audit** (AC: 1)
  - [x] Review other management tables (e.g., Trainer Management, Class Management) for similar overflow issues.
- [x] **Testing: Responsive Validation** (AC: 1, 2)
  - [x] Verify the layout on multiple breakpoints (320px, 375px, 768px) using browser dev tools.
  - [x] Ensure no horizontal scrollbars are present on the body container.

## Dev Notes

- **Architecture Pattern**: Use Tailwind's responsive modifiers (md:hidden, hidden md:block) to swap between the table and card views.
- **Source Tree**:
  - rontend/src/app/admin/users/page.tsx: Primary target.
  - rontend/src/components/ui/BlackGlassCard.tsx: Use for mobile user cards.
- **Testing Standards**: Physical device testing or mobile emulation in Chrome/Safari.

### Project Structure Notes

- **Reuse**: The mobile user card should ideally use the BlackGlassCard atom created in Story 1.3.
- **Constraint**: Maintain the same Pacific Cyan/Cerulean palette for all mobile interactive elements.

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive Design & Accessibility]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX Consistency Patterns]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (Managed by BMad create-story workflow)

### Debug Log References

### Completion Notes List

### File List


# Story 1.3: "Black Glass" Global Styling Baseline

Status: done

## Story

As a developer,
I want a standardized set of Tailwind tokens and layout base components,
so that the "Professional Grade" luxury aesthetic is consistent across all pages.

## Acceptance Criteria

1. **Tsunami Palette**: Given the global tailwind.config.ts, when I apply the 'Tsunami' color tokens (Pacific Cyan, Cerulean) and Obsidian Black background, then the entire application should render with the high-contrast dark theme baseline.
2. **Black Glass Card**: A reusable 'Black Glass' card component with backdrop-blur, border-transparency, and subtle glow must be available for use.
3. **Typography Standard**: Headings must use Bold/Black weights with tight tracking (-0.02em) as specified in the UX foundation.
4. **8pt Grid Consistency**: All layout components must adhere to the 8px spacing unit baseline.

## Tasks / Subtasks

- [x] **Tailwind Configuration Update** (AC: 1, 3, 4)
  - [ ] Update rontend/tailwind.config.ts with the Tsunami color palette and standard spacing units.
  - [x] Configure custom backdrop-blur utilities if needed for the glass effect.
- [x] **Base Component Creation** (AC: 2)
  - [ ] Create rontend/src/components/ui/BlackGlassCard.tsx.
  - [ ] Implement the g-white/5, ackdrop-blur-xl, order-white/10 styles.
- [x] **Global CSS Refinement** (AC: 1, 3)
  - [ ] Update rontend/src/app/globals.css to set the default background to Obsidian Black and apply standard heading styles.
- [x] **Testing: Visual Verification** (AC: 1, 2, 3, 4)
  - [x] Create a Storybook-style 'Style Guide' page or component to verify all tokens and cards in isolation.

## Dev Notes

- **Architecture Pattern**: Atomic design for tokens and base components.
- **Source Tree**:
  - rontend/tailwind.config.ts
  - rontend/src/app/globals.css
  - rontend/src/components/ui/
- **Testing Standards**: Visual inspection and ensuring no layout shift on high-blur components.

### Project Structure Notes

- **Framer Motion**: The Black Glass card should ideally include the hover scaling (1.02x) specified in the component strategy.
- **Constraint**: Ensure ackdrop-blur is used efficiently to prevent performance degradation on lower-end mobile devices.

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Visual Design Foundation]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (Managed by BMad create-story workflow)

### Debug Log References

### Completion Notes List

### File List


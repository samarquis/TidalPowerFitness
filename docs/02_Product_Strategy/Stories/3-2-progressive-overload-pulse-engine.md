# Story 3.2: Progressive Overload "Pulse" Engine

Status: done

## Story

As a user,
I want to see instant visual confirmation when I improve my performance,
so that I feel motivated to push harder.

## Acceptance Criteria

1. **Overload Detection**: Given I have just entered data for a completed set, when the system detects that I have exceeded my previous best (volume, weight, or reps for that specific exercise), then a visual indicator must trigger.
2. **Instant Feedback**: The visual indicator (Pacific Cyan 'Pulse' or Flame Orange 🔥 badge) must appear immediately next to the input with zero perceived latency.
3. **Data Comparison**: The engine must compare the current set data against the user's historical personal record (PR) or previous session's top set for that specific exercise.
4. **Visual Hierarchy**: PR breakthroughs (new all-time best) should have a more prominent "Pulse" than standard progressive overload (beating the last session).

## Tasks / Subtasks

- [x] **Backend: Implement Historical Lookup API** (AC: 3)
  - [x] Create or enhance an endpoint (e.g., GET /api/progress/exercise-best/:exerciseId) to fetch the user's PR and previous session's best for a specific exercise.
- [x] **Frontend: Implement Comparison Logic** (AC: 1, 3)
  - [ ] Modify BatchEntryMatrix.tsx or its parent to fetch historical bests on mount.
  - [x] Implement a comparison function that evaluates the current input against the fetched bests.
- [x] **Frontend: Create Pulse Animation Component** (AC: 2, 4)
  - [ ] Design a PulseIndicator.tsx using Framer Motion with two variants: overload (Cyan) and pr (Orange/Glow).
  - [ ] Integrate this component into the BatchEntryMatrix row.
- [x] **Testing: Logic Verification** (AC: 1, 3)
  - [x] Add unit tests for the comparison logic to ensure pulses trigger correctly for weight increases, rep increases, and volume breakthroughs.

## Dev Notes

- **Architecture Pattern**: Real-time evaluation should ideally happen client-side after initial data fetch to ensure zero latency.
- **Source Tree**:
  - rontend/src/components/workouts/BatchEntryMatrix.tsx: Main integration point.
  - rontend/src/components/ui/PulseIndicator.tsx: New atom.
- **Testing Standards**:
  - Mock historical data to verify all trigger conditions.

### Project Structure Notes

- **Framer Motion**: Use nimate and 	ransition props to create a tactical "heartbeat" pulse effect.
- **Constraint**: Ensure the "Pulse" doesn't clutter the UI; it should be subtle but noticeable.

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Defining the Core Interaction]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (Managed by BMad create-story workflow)

### Debug Log References

### Completion Notes List

### File List



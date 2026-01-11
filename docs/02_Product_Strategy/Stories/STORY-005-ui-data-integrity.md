# Story: STORY-005 - UI Polish and Data Integrity

**Status:** IN_PROGRESS
**Priority:** HIGH
**Date Logged:** 2026-01-01

## Problem Description
1. **UI/UX**: Light mode is aesthetically displeasing and lacks proper contrast/styling.
2. **Data Integrity**: Several "Packages" for purchase are missing from the live Neon database.
3. **Migration Verification**: Final audit required to ensure all local seed data is fully synced to Neon.

## Context
Migration to Neon was completed, but `generated_test_data.sql` failed during the initial seed due to a syntax error, likely causing the missing packages.

## Investigation Steps
- [ ] Fix syntax errors in `backend/database/generated_test_data.sql`.
- [ ] Re-run full seeding on Neon.
- [ ] Verify package count in Neon.
- [ ] Analyze frontend theme configuration (Tailwind/CSS) for light mode improvements.

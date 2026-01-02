Title: Fix: normalize user credit fields and enable webhook signature verification

Summary
- Fixes a production deploy failure caused by a backend/frontend mismatch and a prior frontend parse error.
- Normalizes user credit DB and model fields to: `total_credits`, `remaining_credits`, `purchase_date`.
- Adds required deployment env vars for Square webhook signature verification.

Files changed (high level)
- backend/src/models/UserCredit.ts
- backend/src/controllers/* (bookingController, userController, authController)
- backend/src/services/creditService.ts
- backend/database/init.sql
- render.yaml
- frontend (verified build passes locally)
- docs: PROJECT_STATUS.md, DEPLOYMENT.md, docs/RELEASE_NOTES/2026-01-02-incident.md

Testing performed
- `npm run build` (backend) ✅
- `npm run build` (frontend) ✅
- `npm test` (backend, DB tests skipped by default) ✅

Deployment notes
- Ensure the following env vars are set in Render for the backend service: `DATABASE_URL`, `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_WEBHOOK_SECRET`, `SQUARE_WEBHOOK_SIGNATURE_KEY`.
- Recommended smoke tests after deploy: GET `/health`, GET `/api/auth/profile`, simulate booking flow in sandbox.

Action requested
- Please review and run CI. If CI passes, merge and deploy, or rollback to restore availability immediately and then deploy the fix.

Reviewers: @samarquis, @devops

Related: docs/RELEASE_NOTES/2026-01-02-incident.md

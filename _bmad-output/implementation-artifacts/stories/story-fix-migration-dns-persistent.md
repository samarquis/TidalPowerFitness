# Bug: Fix Deployment Migration DNS Error (Persistent)

## Description
The deployment is still failing with `getaddrinfo ENOTFOUND` despite moving migrations to `startCommand` and adding retries.
This suggests network instability or timing issues during the startup phase.
We will try using Render's dedicated `preDeployCommand` which is the recommended way to run migrations, and further increase the retry limit to handle cold starts of the database (which can take >30s on free tier).

## Proposed Fix
1. Move `npm run migrate:all` to `preDeployCommand` in `render.yaml`.
2. Increase migration retries to 10 attempts (50s timeout) to account for DB cold starts.
3. Log the DB host being used for better debugging.

## Tasks
- [ ] Modify `render.yaml`: Use `preDeployCommand`.
- [ ] Modify `run_all_migrations.ts`: Increase retries and add debug logging.

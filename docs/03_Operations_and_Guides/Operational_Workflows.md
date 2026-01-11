# Operational Workflows & Admin Guides

This document details the day-to-day administrative and operational tasks for maintaining the Tidal Power Fitness platform.

## 1. Database Operations

### Migrations
*   **Process:** Migrations are stored in `backend/migrations`.
*   **Manual Run:** `npm run migrate` (runs `backend/src/scripts/migrate.ts`).
*   **Web UI:** Admins can view and trigger pending migrations at `/admin/migrations`.
*   **Integrity:** Always use the Web UI or a separate `.sql` file for updates to avoid shell character expansion bugs with bcrypt hashes.

### Backups
*   **Service:** `BackupService.ts`.
*   **Schedule:** Daily at 3:00 AM (server time).
*   **Manual Trigger:** Call the `backupService.executeBackup()` method via an admin script.
*   **Restoration:** Standard `psql` restore: `psql -d tidal_power_fitness -f backup_file.sql`.

## 2. Infrastructure Management (Render)

### Environment Variables
Critical keys that must be configured in the Render Dashboard:
*   `DATABASE_URL`: Neon PostgreSQL connection string.
*   `JWT_SECRET`: Signing key for HttpOnly cookies.
*   `SQUARE_ACCESS_TOKEN` / `SQUARE_LOCATION_ID`: Payment API credentials.
*   `SQUARE_WEBHOOK_SIGNATURE_KEY`: For validating incoming webhooks.
*   `GITHUB_PAT`: GitHub Personal Access Token (for automated issue creation).
*   `GITHUB_REPO`: Target repository (e.g., `samarquis/TidalPowerFitness`).
*   `ACUITY_USER_ID` / `ACUITY_API_KEY`: Calendar sync credentials.

### Webhook Configuration
*   **Square:** Point Square Developer Portal to `https://api.tidalpowerfitness.com/api/payments/webhook`.
*   **Events:** Ensure `order.created`, `order.updated`, and `subscription.updated` are enabled.

## 3. Administrative Tools

### User Impersonation ("View as User")
*   **Access:** `Admin -> Users -> Actions -> View as User`.
*   **Logic:** Temporarily swaps the admin's session token for a client token (with self-reverting audit log).
*   **Purpose:** Rapid debugging of user-reported issues.

### Global Settings
*   **Access:** `/admin/reference-data`.
*   **Managed Items:**
    *   Exercise movement patterns.
    *   Muscle group definitions.
    *   Site-wide pricing configuration (stored in `global_settings` table).

## 4. Troubleshooting Common Issues

### Webhook Failures
1.  Check `backend/logs/error.log` for "Signature Mismatch".
2.  Verify `SQUARE_WEBHOOK_SIGNATURE_KEY` matches the Square portal.
3.  Ensure the backend is capturing the `rawBody`.

### Credit Sync Discrepancies
1.  Verify the `user_credits` table has an entry for the `user_id`.
2.  Check the `payment_transactions` log to see if the webhook was received.
3.  Run `CreditService.reconcile(userId)` (Admin command).

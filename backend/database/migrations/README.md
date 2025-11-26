# Database Migrations

## Running Migrations

### Production (Render)

To run migration 001 on the production database:

1. Go to your Render dashboard: https://dashboard.render.com/
2. Navigate to the `tidal-power-backend` service
3. Click on "Shell" in the left sidebar
4. Run the following command:
   ```bash
   npm run migrate:001
   ```

### Local Development

To run migration 001 on your local database:

1. Ensure PostgreSQL is running locally
2. From the `backend` directory, run:
   ```bash
   npm run migrate:001
   ```

## Migration 001: Add days_of_week Column

**File:** `001_add_days_of_week.sql`

**Purpose:** Adds support for multi-day class scheduling by:
- Adding a `days_of_week` INTEGER[] column to the `classes` table
- Migrating existing `day_of_week` data to the new array column
- Making the old `day_of_week` column nullable for backward compatibility

**Status:** Pending execution on production

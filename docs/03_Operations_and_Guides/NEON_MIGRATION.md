# Migrating to Neon.tech Database

Since Render's free PostgreSQL database expires after 90 days, we are switching to [Neon.tech](https://neon.tech), which offers a generous free tier that does not expire.

## Step 1: Create Database on Neon
1. Go to [Neon.tech](https://neon.tech/) and Sign Up.
2. Click **"New Project"**.
3. Name it `tidal-power-fitness`.
4. Choose a region close to your Render region (e.g., `US East (N. Virginia)`).
5. Click **"Create Project"**.

## Step 2: Get Connection String
1. Once created, you will see a **Connection Details** panel.
2. Ensure **"Pooled connection"** is checked (recommended for stability).
3. Copy the connection string. It looks like:
   `postgresql://neondb_owner:password@ep-cool-cloud.us-east-2.aws.neon.tech/neondb?sslmode=require`

## Step 3: Update Render
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Select your backend service (`tidal-power-backend`).
3. Go to **Environment**.
4. Find `DATABASE_URL`.
5. Click **Edit** and paste your Neon connection string.
6. Click **Save Changes**.

## Step 4: Deploy
1. The project code has already been updated to remove the dependency on Render's internal DB.
2. A new deployment should trigger automatically (or you can trigger a "Manual Deploy").
3. The `preDeployCommand` will automatically run all migrations on the new empty Neon database.

## Step 5: (Optional) Seed Data
If you want to add the initial demo data (users, exercises, etc.) to your new database:
1. Wait for the deployment to succeed.
2. Use the application API or a local script to seed data.
   - **Local Method:** Create a `.env` file locally with your new `DATABASE_URL` and run:
     ```bash
     npm run db:seed
     ```

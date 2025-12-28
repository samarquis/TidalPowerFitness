# Database Management on Render Free Tier

## Overview

Render's free tier PostgreSQL database has the following limitations:
- **90-day expiration**: Database expires after 90 days
- **Automatic sleep**: Database may sleep after inactivity
- **Limited storage**: 1GB storage limit
- **No backups**: No automated backups on free tier

This guide provides strategies to work within these constraints.

---

## Current Setup

**Database**: PostgreSQL on Render (free tier)
**Connection**: Backend connects via `DATABASE_URL` environment variable
**Local Development**: Uses same Render database (not recommended long-term)

---

## Recommended Approach: Local Development Database

### 1. Set Up Local PostgreSQL

**Install PostgreSQL locally**:
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

**Create local database**:
```bash
# Start PostgreSQL service
# Windows: Services app → PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Create database
createdb tidal_power_fitness_dev

# Or using psql:
psql -U postgres
CREATE DATABASE tidal_power_fitness_dev;
\q
```

### 2. Update Local Environment

**Backend `.env` file**:
```env
# For local development
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/tidal_power_fitness_dev

# Keep Render URL for reference
RENDER_DATABASE_URL=your_render_database_url_here
```

**Switch between databases**:
```bash
# Use local database
DATABASE_URL=postgresql://postgres:password@localhost:5432/tidal_power_fitness_dev npm run dev

# Use Render database (for testing deployment)
DATABASE_URL=$RENDER_DATABASE_URL npm run dev
```

---

## Database Migrations

### Run Migrations Locally

```bash
cd backend

# Run all migrations
npm run migrate

# Or manually:
psql -U postgres -d tidal_power_fitness_dev -f database/migrations/run-this-migration.sql
```

### Run Migrations on Render

**Option 1: Via Render Dashboard**
1. Go to Render Dashboard → Your Database
2. Click "Connect" → "External Connection"
3. Use provided connection string with psql or pgAdmin
4. Run migration SQL files

**Option 2: Via Backend Deployment**
- Migrations run automatically during deployment (configured in `render.yaml`)

---

## Data Management Strategies

### 1. Seed Data Script

Create a script to populate database with test data:

**File**: `backend/database/seed-data.sql`

```sql
-- Insert demo packages
INSERT INTO packages (name, description, credit_count, price_cents, duration_days, is_active)
VALUES 
  ('Starter Pack', '10 class credits', 10, 9999, 30, true),
  ('Pro Pack', '25 class credits', 25, 19999, 60, true),
  ('Elite Pack', '50 class credits', 50, 34999, 90, true)
ON CONFLICT DO NOTHING;

-- Insert demo classes
-- Add your demo data here
```

**Run seed script**:
```bash
psql -U postgres -d tidal_power_fitness_dev -f database/seed-data.sql
```

### 2. Export/Import Data

**Export data from Render**:
```bash
# Get connection string from Render dashboard
pg_dump "your_render_database_url" > backup.sql
```

**Import to local database**:
```bash
psql -U postgres -d tidal_power_fitness_dev < backup.sql
```

**Export local data**:
```bash
pg_dump -U postgres tidal_power_fitness_dev > local_backup.sql
```

**Import to Render** (when needed):
```bash
psql "your_render_database_url" < local_backup.sql
```

---

## Keeping Render Database Active

### 1. Health Check Endpoint

Your backend already has a health check endpoint that queries the database:

**File**: `backend/src/app.ts`
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
```

### 2. External Monitoring Service

Use a free service to ping your backend every 10-14 minutes:

**Options**:
- [UptimeRobot](https://uptimerobot.com/) - Free, 5-minute intervals
- [Cron-job.org](https://cron-job.org/) - Free, customizable intervals
- [Pingdom](https://www.pingdom.com/) - Free tier available

**Setup**:
1. Create account on monitoring service
2. Add monitor for: `https://your-app.onrender.com/health`
3. Set interval to 10-14 minutes
4. This keeps both backend and database active

---

## Data Backup Strategy

### Automated Backup Script

**File**: `scripts/backup-database.sh`

```bash
#!/bin/bash
# Backup Render database to local file

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/render_backup_$DATE.sql"

# Create backups directory if it doesn't exist
mkdir -p backups

# Export from Render
pg_dump "$RENDER_DATABASE_URL" > "$BACKUP_FILE"

echo "Backup saved to $BACKUP_FILE"

# Keep only last 5 backups
ls -t backups/render_backup_*.sql | tail -n +6 | xargs rm -f
```

**Run weekly**:
```bash
# Add to crontab (Linux/Mac)
0 0 * * 0 /path/to/scripts/backup-database.sh

# Or run manually
./scripts/backup-database.sh
```

---

## Database Renewal Strategy

Since Render free tier databases expire after 90 days:

### Option 1: Renew Before Expiration

1. **30 days before expiration**: Export all data
2. **Create new database** on Render
3. **Import data** to new database
4. **Update environment variables** in Render dashboard

### Option 2: Migrate to Alternative

**Free PostgreSQL alternatives**:
- **Supabase**: 500MB free tier, doesn't expire
- **ElephantSQL**: 20MB free tier (very limited)
- **Neon**: 3GB free tier, serverless PostgreSQL

**Migration steps**:
1. Export data from Render
2. Create database on new provider
3. Import data
4. Update `DATABASE_URL` in Render environment variables
5. Redeploy backend

---

## Best Practices for Free Tier

### 1. Data Cleanup

**Remove old data periodically**:
```sql
-- Delete old workout sessions (older than 6 months)
DELETE FROM workout_sessions 
WHERE session_date < NOW() - INTERVAL '6 months';

-- Delete expired user credits
DELETE FROM user_credits 
WHERE expires_at < NOW() AND remaining_credits = 0;
```

### 2. Optimize Storage

- Use appropriate data types (don't use TEXT when VARCHAR(255) suffices)
- Avoid storing large files in database (use cloud storage instead)
- Clean up test/demo data regularly

### 3. Monitor Usage

**Check database size**:
```sql
SELECT pg_size_pretty(pg_database_size('your_database_name'));
```

**Check table sizes**:
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Emergency Recovery

If database is lost or corrupted:

1. **Restore from latest backup**:
   ```bash
   psql "new_database_url" < backups/latest_backup.sql
   ```

2. **Run migrations** (if needed):
   ```bash
   npm run migrate
   ```

3. **Seed essential data**:
   ```bash
   psql "new_database_url" < database/seed-data.sql
   ```

4. **Update environment variables** in Render

5. **Redeploy backend**

---

## Recommended Workflow

**For Development**:
1. Use local PostgreSQL database
2. Run migrations locally
3. Test features locally
4. Commit code changes

**For Deployment**:
1. Push code to GitHub
2. Render auto-deploys backend
3. Migrations run automatically
4. Test on staging/production

**For Data Management**:
1. Weekly backups of Render database
2. Keep backups for 30 days
3. Monitor database size monthly
4. Clean up old data quarterly

---

## Quick Reference

| Task | Command |
|------|---------|
| Backup Render DB | `pg_dump "$RENDER_DATABASE_URL" > backup.sql` |
| Restore to Render | `psql "$RENDER_DATABASE_URL" < backup.sql` |
| Check DB size | `SELECT pg_size_pretty(pg_database_size('dbname'));` |
| Run migrations | `npm run migrate` |
| Seed data | `psql -d dbname -f seed-data.sql` |

---

## Summary

**Key Points**:
- ✅ Use local PostgreSQL for development
- ✅ Keep Render database for production only
- ✅ Set up automated monitoring to keep database active
- ✅ Weekly backups to prevent data loss
- ✅ Plan for 90-day renewal cycle
- ✅ Monitor storage usage

This approach minimizes reliance on Render's free tier limitations while maintaining a functional production environment.

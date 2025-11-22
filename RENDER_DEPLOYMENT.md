# Deploying Tidal Power Fitness to Render

This guide will walk you through deploying your complete application to Render for FREE.

## What You'll Deploy

- ✅ **Frontend** (Next.js) - Static site
- ✅ **Backend** (Express API) - Web service
- ✅ **Database** (PostgreSQL) - Managed database

## Prerequisites

- [x] GitHub repository: https://github.com/samarquis/TidalPowerFitness
- [ ] Render account (we'll create this)
- [ ] GoDaddy domain (optional - can add later)

---

## Step 1: Create Render Account

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with your **GitHub account** (easiest option)
4. Authorize Render to access your GitHub repositories

---

## Step 2: Deploy PostgreSQL Database

### 2.1 Create Database

1. From Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name**: `tidal-power-db`
   - **Database**: `tidal_power_fitness`
   - **User**: `tidal_admin` (or leave default)
   - **Region**: Choose closest to you (e.g., Oregon, Ohio, Frankfurt)
   - **Plan**: **FREE** (starts with free tier)
4. Click **"Create Database"**

### 2.2 Save Database Credentials

After creation, you'll see:
- **Internal Database URL** (use this for backend)
- **External Database URL** (for local connections)

**Copy the Internal Database URL** - you'll need it for the backend!

### 2.3 Initialize Database Schema

1. Click on your database in Render
2. Go to **"Shell"** tab
3. Run these commands:

```sql
-- Copy and paste the contents of backend/database/init.sql
-- Then run backend/database/seed.sql
```

Or use the **"Connect"** button to connect with a PostgreSQL client and run the SQL files.

---

## Step 3: Deploy Backend (Express API)

### 3.1 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `samarquis/TidalPowerFitness`
3. Configure:
   - **Name**: `tidal-power-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Plan**: **FREE**

### 3.2 Add Environment Variables

Click **"Environment"** tab and add these variables:

```
NODE_ENV=production
PORT=5000

# Database (use Internal Database URL from Step 2)
DATABASE_URL=<your-internal-database-url>

# JWT (generate a secure secret)
JWT_SECRET=<generate-random-string-here>
JWT_EXPIRES_IN=7d

# Acuity (leave empty for now - add when you get credentials)
ACUITY_USER_ID=
ACUITY_API_KEY=

# Square (leave empty for now - add when you get credentials)
SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=
SQUARE_ENVIRONMENT=sandbox
```

**To generate JWT_SECRET:**
- Windows PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`
- Or use: https://generate-secret.vercel.app/32

### 3.3 Update Database Connection

We need to update the backend to use `DATABASE_URL` instead of separate variables.

**Edit `backend/src/config/db.ts`:**

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ... rest of the file stays the same
```

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for deployment (5-10 minutes)
4. You'll get a URL like: `https://tidal-power-backend.onrender.com`

**Test it:** Visit `https://tidal-power-backend.onrender.com/health`
You should see: `{"status":"ok","message":"Server is running"}`

---

## Step 4: Deploy Frontend (Next.js)

### 4.1 Create Static Site

1. Click **"New +"** → **"Static Site"**
2. Connect repository: `samarquis/TidalPowerFitness`
3. Configure:
   - **Name**: `tidal-power-fitness`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `.next`
   - **Plan**: **FREE**

### 4.2 Add Environment Variables

Click **"Environment"** and add:

```
NEXT_PUBLIC_API_URL=https://tidal-power-backend.onrender.com/api
```

(Replace with your actual backend URL from Step 3)

### 4.3 Deploy

1. Click **"Create Static Site"**
2. Wait for build (5-10 minutes)
3. You'll get a URL like: `https://tidal-power-fitness.onrender.com`

---

## Step 5: Test Your Deployed Site

1. Visit your frontend URL: `https://tidal-power-fitness.onrender.com`
2. Test the pages:
   - ✅ Homepage loads
   - ✅ Trainers page
   - ✅ Contact form
   - ✅ Login/Register

3. Test authentication:
   - Register a new account
   - Login
   - Check if JWT token works

---

## Step 6: Connect Custom Domain (When Ready)

### 6.1 For Frontend

1. In Render, go to your frontend static site
2. Click **"Settings"** → **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Enter: `www.tidalpower.com` (or your domain)
5. Render will show you DNS records to add

### 6.2 Update GoDaddy DNS

1. Log into GoDaddy
2. Go to **DNS Management** for your domain
3. Add these records (Render will show you exact values):
   - **CNAME**: `www` → `tidal-power-fitness.onrender.com`
   - **A Record**: `@` → Render's IP address

4. Wait 24-48 hours for DNS propagation

### 6.3 For Backend API

1. In Render, go to your backend web service
2. Add custom domain: `api.tidalpower.com`
3. Add CNAME in GoDaddy: `api` → `tidal-power-backend.onrender.com`

### 6.4 Update Frontend Environment

Update `NEXT_PUBLIC_API_URL` to: `https://api.tidalpower.com/api`

---

## Step 7: Initialize Database with Sample Data

### Option A: Using Render Shell

1. Go to your database in Render
2. Click **"Shell"**
3. Copy/paste contents of `backend/database/seed.sql`

### Option B: Using Local Connection

1. Get **External Database URL** from Render
2. Use a PostgreSQL client (pgAdmin, DBeaver, etc.)
3. Connect and run `backend/database/init.sql` and `seed.sql`

---

## Costs & Free Tier Limits

### FREE Tier Includes:
- ✅ PostgreSQL: 1GB storage, 90 days (then $7/month)
- ✅ Web Service: 750 hours/month (sleeps after 15min inactivity)
- ✅ Static Site: Unlimited bandwidth
- ✅ Custom domains: FREE
- ✅ SSL certificates: FREE

### When to Upgrade:
- Database needs more than 1GB
- Backend needs to stay awake 24/7 (upgrade to $7/month)
- Need faster performance

---

## Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Check build logs for errors
- Verify `DATABASE_URL` is correct

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Test backend health endpoint directly
- Check CORS settings in backend

### Database connection fails
- Use **Internal Database URL** for backend (not External)
- Check SSL settings in `db.ts`
- Verify database is running in Render

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Add Acuity Scheduling credentials when ready
3. ✅ Add Square Payment credentials when ready
4. ✅ Set up monitoring (Render has built-in logs)
5. ✅ Configure backups for database
6. ✅ Add custom domain when purchased

---

## Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Your GitHub Repo**: https://github.com/samarquis/TidalPowerFitness

---

**Ready to deploy?** Start with Step 1 and work through each step. The entire process takes about 30-45 minutes!

# Quick Deployment Guide for tidalpowerfitness.com

## Step 1: Create Render Account (5 minutes)

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with your **GitHub account**
4. Authorize Render to access your repositories

## Step 2: Deploy Using Blueprint (10 minutes)

### Option A: Use render.yaml (Recommended)
1. Push your code to GitHub if not already done
2. In Render Dashboard, click **"New +"** → **"Blueprint"**
3. Connect your repository: `samarquis/TidalPowerFitness`
4. Render will detect `render.yaml` and create all services automatically
5. Click **"Apply"**

### Option B: Manual Setup
Follow the detailed steps in `RENDER_DEPLOYMENT.md`

## Step 3: Initialize Database (5 minutes)

1. Go to your database in Render: **tidal-power-db**
2. Click **"Shell"** tab
3. Copy contents of `backend/database/init.sql` and paste into shell
4. Press Enter to execute
5. Copy contents of `backend/database/seed.sql` and paste into shell
6. Press Enter to execute

## Step 4: Update Backend URL (2 minutes)

1. Once backend is deployed, copy its URL (e.g., `https://tidal-power-backend.onrender.com`)
2. Go to **tidal-power-frontend** service
3. Click **"Environment"** tab
4. Update `NEXT_PUBLIC_API_URL` to: `https://tidal-power-backend.onrender.com/api`
5. Click **"Save Changes"** (this will redeploy frontend)

## Step 5: Test Deployment (5 minutes)

1. Visit your frontend URL: `https://tidal-power-frontend.onrender.com`
2. Test the health endpoint: `https://tidal-power-backend.onrender.com/health`
3. Try registering a new user
4. Try logging in

## Step 6: Connect Custom Domain (10 minutes)

### In Render:
1. Go to **tidal-power-frontend** service
2. Click **"Settings"** → **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Enter: `tidalpowerfitness.com`
5. Also add: `www.tidalpowerfitness.com`
6. Render will show you DNS records to add

### In GoDaddy:
1. Log into **GoDaddy.com**
2. Go to **My Products** → **Domains**
3. Click **DNS** next to tidalpowerfitness.com
4. Add these records (Render will show exact values):
   - **A Record**: 
     - Name: `@`
     - Value: `76.76.21.21` (Render's IP)
     - TTL: 600 seconds
   - **CNAME Record**:
     - Name: `www`
     - Value: `tidal-power-frontend.onrender.com`
     - TTL: 1 Hour

5. Click **"Save"**
6. Wait 10-30 minutes for DNS propagation

### Optional: Backend API Subdomain
If you want `api.tidalpowerfitness.com`:
1. In Render, go to **tidal-power-backend**
2. Add custom domain: `api.tidalpowerfitness.com`
3. In GoDaddy, add CNAME:
   - Name: `api`
   - Value: `tidal-power-backend.onrender.com`
4. Update frontend env var `NEXT_PUBLIC_API_URL` to: `https://api.tidalpowerfitness.com/api`

## Step 7: Verify Everything Works

✅ Visit https://tidalpowerfitness.com (may take 30 min for DNS)
✅ Check SSL certificate (green padlock)
✅ Test user registration
✅ Test user login
✅ Navigate all pages

## Important Notes

⚠️ **Free Tier Limitations:**
- Services sleep after 15 minutes of inactivity
- First visit after sleep takes ~30 seconds to wake up
- Database is free for 90 days, then $7/month

💡 **When to Upgrade:**
- Upgrade to $7/month when you want always-on service
- Do this before going live to customers

🔐 **Security:**
- Render automatically generates secure JWT_SECRET
- SSL certificates are automatic and free
- Database is encrypted at rest

## Troubleshooting

**Backend won't start:**
- Check logs in Render dashboard
- Verify DATABASE_URL is set correctly

**Frontend can't connect to backend:**
- Check NEXT_PUBLIC_API_URL matches backend URL
- Test backend health endpoint directly

**Domain not working:**
- DNS can take up to 48 hours (usually 10-30 minutes)
- Use `nslookup tidalpowerfitness.com` to check DNS
- Verify DNS records in GoDaddy match Render's instructions

## Next Steps After Deployment

1. Add Acuity Scheduling credentials when ready
2. Add Square Payment credentials when ready
3. Continue development locally
4. Push changes to GitHub (Render auto-deploys)
5. Upgrade to paid plan when ready for production traffic

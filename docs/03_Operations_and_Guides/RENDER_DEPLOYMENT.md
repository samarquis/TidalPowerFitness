# Deployment Guide: Render & Neon.tech

This guide details the process for deploying the Tidal Power Fitness platform using Render for hosting and Neon.tech for the PostgreSQL database.

## 1. Database Setup (Neon.tech)
Neon is preferred over Render's internal PostgreSQL due to its non-expiring free tier and superior connection pooling.

1.  **Create Project:** Sign up at [Neon.tech](https://neon.tech) and create a project named `tidal-power-fitness`.
2.  **Connection String:** 
    *   Navigate to **Connection Details**.
    *   Select **Pooled Connection** (uses port 5432 or 6432 with PgBouncer).
    *   Copy the string: `postgresql://[user]:[password]@[host]/neondb?sslmode=require`.
3.  **Initialization:** The backend is configured to run migrations automatically on deploy, but you can manually seed data using the local `npm run db:seed` command pointing to the Neon URL.

## 2. Backend Deployment (Render Web Service)
1.  **Create Web Service:** Connect your GitHub repo.
2.  **Settings:**
    *   **Runtime:** Node
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `node dist/index.js`
    *   **Plan:** Starter (or Free, though Starter is recommended for always-on).
3.  **Environment Variables:**
    *   `DATABASE_URL`: Your Neon pooled connection string.
    *   `JWT_SECRET`: A secure random string.
    *   `SQUARE_ACCESS_TOKEN` / `SQUARE_LOCATION_ID`: Square credentials.
    *   `SQUARE_WEBHOOK_SIGNATURE_KEY`: From Square Developer Portal.
    *   `NODE_ENV`: `production`.

## 3. Frontend Deployment (Render Static Site)
1.  **Create Static Site:** Connect your GitHub repo.
2.  **Settings:**
    *   **Build Command:** `npm install && npm run build`
    *   **Publish Directory:** `frontend/out` (if static export) or `.next` (if using Render's Node runtime for frontend).
    *   **Note:** If using App Router with SSR, use a **Web Service** for the frontend instead of a Static Site.
3.  **Environment Variables:**
    *   `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://api.tidalpowerfitness.com/api`).

## 4. Custom Domains & DNS
1.  **Add Domain:** In Render settings for both services, add your custom domain (e.g., `www.tidalpowerfitness.com` for frontend, `api.tidalpowerfitness.com` for backend).
2.  **GoDaddy Config:**
    *   **A Record (@):** `216.24.57.1` (Render's Load Balancer IP).
    *   **CNAME (www):** Point to your Render frontend URL.
    *   **CNAME (api):** Point to your Render backend URL.

## 5. Post-Deployment Verification
1.  **Health Check:** Visit `https://api.yourdomain.com/health`.
2.  **Auth Flow:** Register a new user and verify HttpOnly cookies are set.
3.  **Webhook Test:** Use the Square Developer Portal to send a test `order.created` event and check backend logs.

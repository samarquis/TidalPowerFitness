# Deployment Guide - Tidal Power Fitness

This guide covers the steps to deploy the Tidal Power Fitness application to production, specifically using Render, and configuring custom domains.

## Prerequisites

1.  A [Render](https://render.com) account.
2.  A [PostgreSQL](https://www.postgresql.org/) database (Render provides Managed PostgreSQL).
3.  A [Square](https://squareup.com) Developer account for payments.
4.  An [Acuity Scheduling](https://acuityscheduling.com) account for calendars.

## Environment Variables

Ensure the following environment variables are set in your Render web services:

### Backend
- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET`: A long, random string for signing tokens.
- `SQUARE_ACCESS_TOKEN`: Your Square API access token.
- `SQUARE_ENVIRONMENT`: `sandbox` or `production`.
- `SQUARE_LOCATION_ID`: Your Square location ID.
- `SQUARE_WEBHOOK_SECRET`: Secret for verifying Square webhooks.
- `FRONTEND_URL`: The URL of your deployed frontend.
- `NODE_ENV`: `production`.

### Frontend
- `NEXT_PUBLIC_API_URL`: The URL of your deployed backend API.

## Custom Domain Setup

To use a custom domain (e.g., `www.tidalpowerfitness.com`) instead of a `onrender.com` subdomain, follow these steps:

### 1. Add Domain in Render
1.  Go to your Web Service dashboard in Render.
2.  Click on **Settings** -> **Custom Domains**.
3.  Click **Add Custom Domain** and enter your domain name.

### 2. Update DNS Records
Login to your domain registrar (e.g., GoDaddy, Namecheap) and add the following records:

| Type  | Name | Value |
| :---  | :--- | :---  |
| CNAME | www  | `your-service-name.onrender.com` |
| ANAME | @    | `your-service-name.onrender.com` (If supported) |
| A     | @    | Render's IP addresses (If ANAME is not supported) |

*Note: Render will provide the specific values and IP addresses in the dashboard.*

### 3. SSL/TLS Certificates
Render automatically provisions and renews SSL/TLS certificates via **Let's Encrypt** for all custom domains added to their platform.
- Once DNS propagates, Render will verify the domain and issue the certificate.
- Your site will be automatically served over HTTPS.

## Square Account Transition (Client Hand-off)

To switch from the current Square account to the client's actual Square account, update the following variables in the production environment:

1.  **SQUARE_ACCESS_TOKEN**: The "Production Access Token" from the client's Square Developer Dashboard.
2.  **SQUARE_LOCATION_ID**: The ID of the primary business location in the client's Square account.
3.  **SQUARE_WEBHOOK_SECRET**: 
    - Create a new Webhook in the Square Dashboard pointing to `https://your-api-url.com/api/payments/webhook`.
    - Select the `payment.updated` event.
    - Copy the "Signature Key" and set it as this variable.
4.  **SQUARE_ENVIRONMENT**: Set this to `production`.

*Note: No code changes are required to swap Square accounts.*

## Database Migrations

After deployment, you must run migrations to set up the production database schema:

1.  Log in as an admin user.
2.  Navigate to `/admin/migrations`.
3.  Click **Run Pending Migrations**.

## Automated Backups

The application includes a built-in backup service that runs daily at 3:00 AM.
- Backups are stored in the `/backups` directory of the backend service.
- Ensure your Render disk or persistent storage is configured if you wish to retain these backups across restarts.
- Render's Managed PostgreSQL also provides automated daily backups with 7-day retention by default.

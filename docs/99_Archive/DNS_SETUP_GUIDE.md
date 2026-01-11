# Domain Setup Guide: GoDaddy to Render

This guide documents the process for connecting a GoDaddy domain (`tidalpowerfitness.com`) to the Render hosted frontend.

## Part 1: Render Configuration (Developer Task)

**Goal:** Tell Render to listen for traffic from the custom domain.

1.  Log in to the **Render Dashboard**.
2.  Select the **Frontend Web Service** (Next.js app).
3.  Go to **Settings** > **Custom Domains**.
4.  Click **+ Add Custom Domain**.
5.  Add `tidalpowerfitness.com` and click **Save**.
6.  Click **+ Add Custom Domain** again.
7.  Add `www.tidalpowerfitness.com` and click **Save**.

**Key Records to Verify in Render:**
*   **A Record (@/Root):** `216.24.57.1` (Standard Render IP)
*   **CNAME Record (www):** `tidal-power-frontend-app.onrender.com` (Project specific URL)

---

## Part 2: GoDaddy Configuration (Client Task)

**Goal:** Point the domain name to Render's servers.

### Client Instructions Template

**Subject:** Instructions to connect the Tidal Power Fitness domain

Hi Lisa,

To get the website live at `www.tidalpowerfitness.com`, we need to point the domain name from GoDaddy to our new servers.

Please log in to your GoDaddy account and follow these exact steps.

**Step 1: Open the DNS Settings**
1.  Log in to **[GoDaddy.com](https://www.godaddy.com)**.
2.  Go to your **My Products** page.
3.  Find **tidalpowerfitness.com** in the list.
4.  Click the button that says **DNS** (or "Manage DNS").

**Step 2: Update the "A Record" (Points the main domain)**
1.  Look for the row where **Type** is **A** and **Name** is **@**.
2.  Click the **Pencil Icon** (Edit).
3.  Update **Value** to: `216.24.57.1`
4.  Click **Save**.
    *   *Note: If missing, click "Add New Record" > Type "A", Name "@", Value "216.24.57.1".*

**Step 3: Update the "CNAME Record" (Points 'www')**
1.  Look for the row where **Type** is **CNAME** and **Name** is **www**.
2.  Click the **Pencil Icon** (Edit).
3.  Update **Value** to: `tidal-power-frontend-app.onrender.com`
4.  Click **Save**.

**Timeline:**
Changes usually take 1-24 hours to propagate globally. The site may appear insecure (missing SSL) briefly until Render automatically generates the certificate.

---

## Part 3: Verification & SSL

1.  **Verify in Render:** Go back to Render Dashboard > Settings > Custom Domains.
2.  **Click "Verify":** Use the verify button next to the domains until they show green checks.
3.  **SSL/HTTPS:** Render automatically provisions a TLS certificate via Let's Encrypt once DNS propagation is verified. This takes ~5-10 minutes after verification.
4.  **Troubleshooting:** If GoDaddy blocks the CNAME update, ensure **Domain Forwarding** is turned OFF in GoDaddy settings.

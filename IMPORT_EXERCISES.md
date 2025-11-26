# How to Import Exercises After Deployment

## Step 1: Wait for Deployment
After pushing to GitHub, wait for Render to automatically deploy the new code (usually 2-5 minutes).

## Step 2: Get Your Admin Token
1. Log in to your deployed site as an admin
2. Open browser DevTools (F12)
3. Go to Console tab
4. Type: `localStorage.getItem('auth_token')`
5. Copy the token (without quotes)

## Step 3: Trigger the Import

### Option A: Using Browser Console (Easiest)
1. While logged in as admin on your site, open DevTools Console
2. Paste and run this code:

```javascript
fetch('https://your-app.onrender.com/api/import/exercises', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
.then(r => r.json())
.then(data => console.log('Import result:', data))
.catch(err => console.error('Import error:', err));
```

### Option B: Using curl (Command Line)
```bash
curl -X POST https://your-app.onrender.com/api/import/exercises \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Step 4: Verify Import
1. Go to `/exercises` on your site
2. Click on a body part tab
3. You should see muscle groups with exercise counts
4. Click on a muscle group to see the exercises

## Expected Results
- **800+ exercises** imported
- Exercises organized by muscle groups
- Each exercise has: name, difficulty, equipment, instructions

## Troubleshooting
- **401 Unauthorized**: Token expired, log in again and get a new token
- **500 Error**: Check Render logs for database connection issues
- **Timeout**: Import may take 30-60 seconds, be patient

## Note
The import only needs to be run **once**. After that, all exercises will be in your database permanently.

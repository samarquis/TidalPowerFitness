# How to Make Yourself Admin

## Quick Steps

1. **Register on the website** with `samarquis4@gmail.com` and your own password

2. **Install a free PostgreSQL client** (choose one):
   - **TablePlus** (easiest, free): https://tableplus.com/
   - **pgAdmin** (free): https://www.pgadmin.org/
   - **DBeaver** (free): https://dbeaver.io/

3. **Get your database connection info from Render**:
   - Go to Render dashboard → tidal-power-db
   - Click "Connect" button (top right)
   - Copy the "External Database URL"

4. **Connect with your PostgreSQL client**:
   - Paste the connection URL from Render
   - Or enter details manually (host, port, database, user, password)

5. **Run the SQL command**:
   - Open `MAKE_SCOTT_ADMIN.sql` file
   - Copy and paste the SQL into your client
   - Execute it

6. **Logout and login again** on your website
   - You'll now see the "Users" link in navigation
   - You're an admin!

## The SQL Command

```sql
UPDATE users SET role = 'admin' WHERE email = 'samarquis4@gmail.com';
```

That's it!

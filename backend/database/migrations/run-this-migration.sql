-- Multi-Role Migration Script
-- Run this using any PostgreSQL client (pgAdmin, DBeaver, etc.)
-- Connection string format: postgresql://user:password@host:port/database

-- Step 1: Add the roles column
ALTER TABLE users ADD COLUMN IF NOT EXISTS roles TEXT[];

-- Step 2: Migrate existing data
UPDATE users 
SET roles = ARRAY[role::TEXT] 
WHERE roles IS NULL OR array_length(roles, 1) IS NULL;

-- Step 3: Set default for new users
ALTER TABLE users ALTER COLUMN roles SET DEFAULT ARRAY['client']::TEXT[];

-- Step 4: Add index for performance
CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles);

-- Step 5: Verify migration
SELECT 
    id, 
    email, 
    first_name, 
    last_name, 
    role as old_role, 
    roles as new_roles 
FROM users;

-- Migration: Add multi-role support to users table
-- Run this on your deployed database

-- Step 1: Add the new roles column (array type)
ALTER TABLE users ADD COLUMN roles TEXT[];

-- Step 2: Migrate existing role data to the new roles array
UPDATE users SET roles = ARRAY[role::TEXT];

-- Step 3: Drop the old role column (after confirming migration worked)
-- Note: We'll keep this commented out for safety - uncomment after verifying
-- ALTER TABLE users DROP COLUMN role;

-- Step 4: Set default for new users
ALTER TABLE users ALTER COLUMN roles SET DEFAULT ARRAY['client']::TEXT[];

-- Step 5: Add index for efficient role queries
CREATE INDEX idx_users_roles ON users USING GIN(roles);

-- Step 6: Drop the old role index (if it exists)
DROP INDEX IF EXISTS idx_users_role;

-- Verification query - check that migration worked
SELECT id, email, first_name, last_name, role, roles FROM users;

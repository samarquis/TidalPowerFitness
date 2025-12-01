-- Migration 002: Add multi-role support and demo mode flag
-- Adds columns needed by User model and DemoUserController

-- Step 1: Add roles column (array type for multi-role support)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS roles TEXT[];

-- Step 2: Add demo mode flag
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_demo_mode_enabled BOOLEAN NOT NULL DEFAULT FALSE;

-- Step 3: Clean up existing demo users (fresh start)
-- This ensures only properly flagged demo users exist after migration
DELETE FROM users WHERE email LIKE '%@demo.com';

-- Step 4: Backfill roles array from existing role column
-- Only update rows where roles is NULL (idempotent)
UPDATE users
SET roles = ARRAY[role::TEXT]
WHERE roles IS NULL;

-- Step 5: Set default for new users
ALTER TABLE users
ALTER COLUMN roles SET DEFAULT ARRAY['client']::TEXT[];

-- Step 6: Add index for efficient role queries (GIN index for array containment)
CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles);

-- Step 7: Add partial index for demo mode queries (only indexes demo users)
CREATE INDEX IF NOT EXISTS idx_users_demo_mode ON users(is_demo_mode_enabled)
WHERE is_demo_mode_enabled = true;

-- Verification query (commented out for production)
-- SELECT id, email, first_name, last_name, role, roles, is_demo_mode_enabled
-- FROM users LIMIT 5;

-- Migration 010: Refactor roles to a strict user_roles table
-- This follows the roadmap item "Migrate from role column to strict user_roles table"

-- Step 1: Create the user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role)
);

-- Step 2: Migrate data from users.roles array to user_roles table
-- We use UNNEST to turn the array into rows
INSERT INTO user_roles (user_id, role)
SELECT id, unnest(roles)::user_role
FROM users
WHERE roles IS NOT NULL AND array_length(roles, 1) > 0
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Backfill from singular role column if roles array was empty
INSERT INTO user_roles (user_id, role)
SELECT id, role
FROM users
WHERE (roles IS NULL OR array_length(roles, 1) = 0)
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Step 5: (Optional) We keep the roles and role columns for now to avoid breaking existing queries
-- but we should eventually remove them or replace them with a view/generated column.
-- For now, we'll just leave them and update the model to sync.

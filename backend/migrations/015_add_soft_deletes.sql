-- Migration: Add soft delete support
-- Description: Adds deleted_at column to main tables

ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE workout_templates ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Create indexes for performance on soft deletes
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_classes_deleted_at ON classes(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_packages_deleted_at ON packages(deleted_at) WHERE deleted_at IS NULL;

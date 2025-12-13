-- Optional Performance Optimization Migration
-- This migration adds indexes to improve query performance for trainer-client viewing feature
-- Run this if you notice slow queries when viewing client lists or workout history

-- Add index on class_participants for faster trainer-client lookups
CREATE INDEX IF NOT EXISTS idx_class_participants_user_status 
ON class_participants(user_id, status);

-- Add index on classes for faster instructor lookups
CREATE INDEX IF NOT EXISTS idx_classes_instructor 
ON classes(instructor_id);

-- Add index on session_participants for faster client workout history
CREATE INDEX IF NOT EXISTS idx_session_participants_client 
ON session_participants(client_id);

-- Add composite index for trainer-client relationship queries
CREATE INDEX IF NOT EXISTS idx_class_participants_class_user 
ON class_participants(class_id, user_id);

-- Verify indexes were created
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

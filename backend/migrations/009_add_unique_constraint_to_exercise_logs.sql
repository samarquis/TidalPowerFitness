-- Migration: Add unique constraint to exercise_logs to support UPSERT
-- This prevents duplicate logs for the same set and allows real-time updates

-- 1. Remove any potential duplicates first (keep the latest)
DELETE FROM exercise_logs a USING exercise_logs b
WHERE a.id < b.id 
  AND a.session_exercise_id = b.session_exercise_id 
  AND a.client_id = b.client_id 
  AND a.set_number = b.set_number;

-- 2. Add the unique constraint
ALTER TABLE exercise_logs 
ADD CONSTRAINT exercise_logs_session_exercise_set_unique 
UNIQUE (session_exercise_id, client_id, set_number);

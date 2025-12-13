-- Migration: Add target_date to class_participants
-- This enables users to book specific instances of a class (e.g. specific dates)

-- 1. Add target_date column
ALTER TABLE class_participants ADD COLUMN IF NOT EXISTS target_date DATE;

-- 2. Populate target_date for existing records (default to booking date to ensure data integrity)
UPDATE class_participants SET target_date = booking_date::date WHERE target_date IS NULL;

-- 3. Drop old unique constraint (allows multiple bookings for same class if dates differ)
-- Constraint name might vary, trying standard naming conventions
ALTER TABLE class_participants DROP CONSTRAINT IF EXISTS class_participants_class_id_user_id_status_key;
-- Also try the explicit name if defined differently in previous migrations (it wasn't explicitly named)

-- 4. Add new unique constraint
-- We want to prevent booking the EXACT SAME class on the EXACT SAME date twice (if active/confirmed)
ALTER TABLE class_participants ADD CONSTRAINT class_participants_session_unique UNIQUE (class_id, user_id, target_date, status);

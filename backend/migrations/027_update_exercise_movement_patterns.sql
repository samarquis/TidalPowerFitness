-- Migration 027: Update exercise movement patterns
-- Remove 'Legs' from the allowed values and reclassify existing leg exercises as Push or Pull

-- First, remove the existing check constraint
-- We need to find the name of the constraint first, or try a common pattern
-- In PostgreSQL, we can often just DROP and ADD if we know it was created inline, 
-- but a more robust way is to use the table name + column name + 'check'
DO $$ 
BEGIN
    ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_movement_pattern_check;
END $$;

-- Add new constraint without 'Legs'
ALTER TABLE exercises ADD CONSTRAINT exercises_movement_pattern_check 
CHECK (movement_pattern IN ('Push', 'Pull', 'Static', 'None'));

-- Reclassify 'Legs' exercises
UPDATE exercises SET movement_pattern = 'Push' WHERE name ILIKE '%Squat%';
UPDATE exercises SET movement_pattern = 'Push' WHERE name ILIKE '%Leg Press%';
UPDATE exercises SET movement_pattern = 'Push' WHERE name ILIKE '%Lunge%';
UPDATE exercises SET movement_pattern = 'Pull' WHERE name ILIKE '%Deadlift%';

-- Ensure other common exercises are correctly flagged if they were missed
UPDATE exercises SET movement_pattern = 'Push' WHERE movement_pattern = 'Legs'; -- Fallback for any remaining 'Legs'

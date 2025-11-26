-- Add days_of_week column to classes table
ALTER TABLE classes ADD COLUMN IF NOT EXISTS days_of_week INTEGER[];

-- Migrate existing data: copy day_of_week to days_of_week array
UPDATE classes SET days_of_week = ARRAY[day_of_week] WHERE days_of_week IS NULL;

-- Make day_of_week nullable since we'll use days_of_week going forward
ALTER TABLE classes ALTER COLUMN day_of_week DROP NOT NULL;

-- Phase 2: Enhanced Exercise Library (Migration 018)
-- Supports secondary muscle group mapping and instructional images

-- Add image_url to exercises for better visuals
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

-- Create junction table for secondary muscle groups
CREATE TABLE IF NOT EXISTS exercise_secondary_muscles (
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    body_focus_id UUID NOT NULL REFERENCES body_focus_areas(id) ON DELETE CASCADE,
    PRIMARY KEY (exercise_id, body_focus_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_exercise_secondary_muscles_ex ON exercise_secondary_muscles(exercise_id);

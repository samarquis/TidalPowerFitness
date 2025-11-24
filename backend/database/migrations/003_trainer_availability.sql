-- Migration: Add trainer_availability table
-- This allows trainers to set recurring weekly availability slots

CREATE TABLE IF NOT EXISTS trainer_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trainer_id, day_of_week, start_time)
);

CREATE INDEX IF NOT EXISTS idx_trainer_availability_trainer ON trainer_availability(trainer_id);

COMMENT ON TABLE trainer_availability IS 'Stores recurring weekly availability slots for trainers';
COMMENT ON COLUMN trainer_availability.day_of_week IS '0=Sunday, 1=Monday, ..., 6=Saturday';

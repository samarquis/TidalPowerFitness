-- Migration: Add attendee_count to class_participants
-- Description: Allow users to book a class for multiple people (e.g. self + friends)

-- Add attendee_count column
ALTER TABLE class_participants ADD COLUMN IF NOT EXISTS attendee_count INTEGER NOT NULL DEFAULT 1 CHECK (attendee_count > 0);

-- Update credits_used to be at least attendee_count
-- Usually credits_used = attendee_count

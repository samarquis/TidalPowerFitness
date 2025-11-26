-- Migration: Create class_participants table for booking system
-- This table tracks which users have booked which classes

CREATE TABLE IF NOT EXISTS class_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    credits_used INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(class_id, user_id, status) -- Prevent duplicate active bookings
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_class_participants_user ON class_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_class_participants_class ON class_participants(class_id);
CREATE INDEX IF NOT EXISTS idx_class_participants_status ON class_participants(status);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_class_participants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER class_participants_updated_at
    BEFORE UPDATE ON class_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_class_participants_updated_at();

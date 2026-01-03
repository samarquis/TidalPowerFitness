-- Add tracking_number to changelogs
ALTER TABLE changelogs ADD COLUMN tracking_number VARCHAR(50);

-- Create index for tracking number search
CREATE INDEX IF NOT EXISTS idx_changelogs_tracking_number ON changelogs(tracking_number);

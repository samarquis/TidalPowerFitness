-- Migration 030: Create site_feedback table
-- Stores user feedback, bug reports, and feature requests

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedback_type') THEN
        CREATE TYPE feedback_type AS ENUM ('bug', 'feature', 'review');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedback_status') THEN
        CREATE TYPE feedback_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS site_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type feedback_type NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    github_issue_url VARCHAR(500),
    github_issue_number INTEGER,
    status feedback_status DEFAULT 'open',
    metadata JSONB, -- Capture browser/OS info if available
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_site_feedback_user ON site_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_site_feedback_status ON site_feedback(status);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_site_feedback_updated_at ON site_feedback;
CREATE TRIGGER update_site_feedback_updated_at BEFORE UPDATE ON site_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

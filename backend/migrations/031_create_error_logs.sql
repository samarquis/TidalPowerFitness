-- Migration 031: Create error_logs table for automated crash reporting
-- This enables "Vault Sentry" logic to track and deduplicate system errors

CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fingerprint VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 hash of message + location
    message TEXT NOT NULL,
    stack_trace TEXT,
    url VARCHAR(500),
    component_name VARCHAR(100), -- For frontend errors
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_role VARCHAR(50),
    browser_info JSONB,
    occurrence_count INTEGER DEFAULT 1,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    github_issue_url VARCHAR(500),
    github_issue_number INTEGER,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup by fingerprint during ingestion
CREATE INDEX IF NOT EXISTS idx_error_logs_fingerprint ON error_logs(fingerprint);
CREATE INDEX IF NOT EXISTS idx_error_logs_last_seen ON error_logs(last_seen);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);

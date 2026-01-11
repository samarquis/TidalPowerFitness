-- Migration 029: Create processed_webhooks table for idempotency
-- This prevents the same webhook event from being processed multiple times

CREATE TABLE IF NOT EXISTS processed_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(255) UNIQUE NOT NULL,
    provider VARCHAR(50) NOT NULL, -- e.g., 'square'
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup during webhook receipt
CREATE INDEX idx_processed_webhooks_event_id ON processed_webhooks(event_id);

-- Update documentation reference if it exists
-- The docs mentioned payment_transactions, let's keep that in mind for future logging

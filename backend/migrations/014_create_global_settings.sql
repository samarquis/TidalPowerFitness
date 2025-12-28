-- Migration: Create global settings table
-- Description: Centralized configuration management

CREATE TABLE IF NOT EXISTS global_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Seed initial settings
INSERT INTO global_settings (key, value, description) VALUES
('site_name', '"Tidal Power Fitness"', 'The name of the application'),
('default_class_price_cents', '1200', 'Default price for a single class in cents'),
('maintenance_mode', 'false', 'Enable/disable maintenance mode globally'),
('support_email', '"support@tidalpowerfitness.com"', 'Main contact email for support'),
('currency', '"USD"', 'System currency code'),
('booking_window_days', '14', 'How many days in advance clients can book classes')
ON CONFLICT (key) DO NOTHING;

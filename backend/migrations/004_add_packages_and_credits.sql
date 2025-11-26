
-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL, -- Price in cents
    credit_count INTEGER NOT NULL DEFAULT 0,
    duration_days INTEGER, -- NULL means no expiration
    type VARCHAR(50) NOT NULL CHECK (type IN ('one_time', 'subscription')),
    stripe_product_id VARCHAR(255), -- Keeping generic for external payment ID
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
    total_credits INTEGER NOT NULL,
    remaining_credits INTEGER NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add credit_cost to classes table
ALTER TABLE classes 
ADD COLUMN IF NOT EXISTS credit_cost INTEGER DEFAULT 1;

-- Seed initial packages based on requirements
INSERT INTO packages (name, description, price_cents, credit_count, duration_days, type) VALUES 
('Dive Deep 16-Pack', '16 Class Pack', 14400, 16, 30, 'one_time'),
('The Tidal 12', '12 Class Pack', 12000, 12, 30, 'one_time'),
('The Surge 4-Pack', '4 Class Pack', 4000, 4, 30, 'one_time'), -- Estimating price based on others, user didn't specify but implied
('Full Tide - Unlimited', 'Unlimited Group Classes', 19800, 999, 30, 'subscription'), -- Using 999 as proxy for unlimited for now, or logic will handle
('Tidal Energy 12', '12 Classes/Month Subscription', 12000, 12, 30, 'subscription'),
('The Weekly Routine', '4 Classes/Month Subscription', 4400, 4, 30, 'subscription'),
('Personal Training Monthly', 'Personal Training Subscription', 28000, 4, 30, 'subscription'); -- Assuming 4 sessions? User said "with Lisa $280"


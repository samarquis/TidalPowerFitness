-- Add new achievement types
INSERT INTO achievements (name, description, icon_url, criteria_type, criteria_value) VALUES
('First Class Booked', 'Book your first class', '🎟️', 'bookings_count', 1),
('Class Regular', 'Book 10 classes', '📆', 'bookings_count', 10),
('Credit Loaded', 'Purchase a package with 10 or more credits', '💳', 'purchased_credits', 10)
ON CONFLICT DO NOTHING;

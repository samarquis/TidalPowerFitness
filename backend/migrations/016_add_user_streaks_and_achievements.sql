-- Add streak columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_workout_date DATE;

-- Add new streak-related achievements
INSERT INTO achievements (name, description, icon_url, criteria_type, criteria_value) VALUES
('Streak Starter', 'Maintain a 3-day workout streak', '[STREAK_3]', 'daily_streak', 3),
('On Fire', 'Maintain a 7-day workout streak', '[STREAK_7]', 'daily_streak', 7),
('Unstoppable', 'Maintain a 30-day workout streak', '[STREAK_30]', 'daily_streak', 30),
('Weekly Warrior', 'Work out every week for 4 weeks', '[WEEKLY_4]', 'weekly_streak', 4)
ON CONFLICT DO NOTHING;

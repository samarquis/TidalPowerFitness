-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    criteria_type VARCHAR(50) NOT NULL, -- e.g., 'total_workouts', 'max_weight', 'streak'
    criteria_value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Seed initial achievements
INSERT INTO achievements (name, description, icon_url, criteria_type, criteria_value) VALUES
('First Steps', 'Complete your first workout', '🎯', 'total_workouts', 1),
('Regular', 'Complete 10 workouts', '🔥', 'total_workouts', 10),
('Dedicated', 'Complete 50 workouts', '💪', 'total_workouts', 50),
('Century Club', 'Complete 100 workouts', '🏆', 'total_workouts', 100),
('Heavy Lifter', 'Log a set with 225lbs or more', '🏋️', 'max_weight', 225),
('Beast Mode', 'Log a set with 315lbs or more', '🦍', 'max_weight', 315);

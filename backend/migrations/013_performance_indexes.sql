-- Migration: Add performance indexes
-- Description: Improve query performance for frequent lookups

-- 1. Class Participants indexes
CREATE INDEX IF NOT EXISTS idx_class_participants_target_date ON class_participants(target_date);
CREATE INDEX IF NOT EXISTS idx_class_participants_class_date ON class_participants(class_id, target_date);
CREATE INDEX IF NOT EXISTS idx_class_participants_user_status ON class_participants(user_id, status);

-- 2. User Credits indexes
CREATE INDEX IF NOT EXISTS idx_user_credits_user_active ON user_credits(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_credits_expiration ON user_credits(expires_at) WHERE is_active = true;

-- 3. Additional Workout Session indexes
CREATE INDEX IF NOT EXISTS idx_workout_sessions_trainer_date ON workout_sessions(trainer_id, session_date);

-- 4. Cart indexes (if not already existing from 004)
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

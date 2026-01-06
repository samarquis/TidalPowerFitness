-- Optimize historical performance lookups
CREATE INDEX IF NOT EXISTS idx_exercise_logs_client_id ON exercise_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_session_exercise_id ON exercise_logs(session_exercise_id);
CREATE INDEX IF NOT EXISTS idx_session_exercises_exercise_id ON session_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_session_date ON workout_sessions(session_date DESC);

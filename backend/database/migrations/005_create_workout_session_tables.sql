-- Create workout_sessions table
CREATE TABLE IF NOT EXISTS workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    template_id UUID REFERENCES workout_templates(id) ON DELETE SET NULL,
    workout_type_id UUID REFERENCES workout_types(id) ON DELETE SET NULL,
    session_date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    notes TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create session_participants table (junction table for many-to-many)
CREATE TABLE IF NOT EXISTS session_participants (
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id, client_id)
);

-- Create session_exercises table (ordered list of exercises in a session)
CREATE TABLE IF NOT EXISTS session_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_in_session INTEGER NOT NULL,
    planned_sets INTEGER,
    planned_reps INTEGER,
    planned_weight_lbs DECIMAL(10, 2),
    rest_seconds INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create session_body_focus table (junction table)
CREATE TABLE IF NOT EXISTS session_body_focus (
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    body_focus_id UUID NOT NULL REFERENCES body_focus_areas(id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, body_focus_id)
);

-- Create exercise_logs table (actual performance data)
CREATE TABLE IF NOT EXISTS exercise_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_exercise_id UUID NOT NULL REFERENCES session_exercises(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    reps_completed INTEGER,
    weight_used_lbs DECIMAL(10, 2),
    duration_seconds INTEGER,
    distance_miles DECIMAL(10, 2),
    rest_taken_seconds INTEGER,
    rpe INTEGER, -- Rate of Perceived Exertion (1-10)
    form_rating INTEGER, -- 1-5 stars
    notes TEXT,
    logged_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Who entered the data (trainer or client)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_workout_sessions_trainer_date ON workout_sessions(trainer_id, session_date);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_class ON workout_sessions(class_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_client ON exercise_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_session_exercise ON exercise_logs(session_exercise_id);

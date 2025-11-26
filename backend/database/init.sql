-- Tidal Power Fitness Database Initialization Script
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('client', 'trainer', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'client',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trainer profiles table
CREATE TABLE trainer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    specialties TEXT[],
    certifications TEXT[],
    years_experience INTEGER,
    profile_image_url VARCHAR(500),
    acuity_calendar_id VARCHAR(100),
    is_accepting_clients BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    acuity_appointment_id VARCHAR(100) UNIQUE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_type VARCHAR(100) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status appointment_status DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    square_payment_id VARCHAR(100) UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forms table
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    form_type VARCHAR(50) NOT NULL,
    form_data JSONB NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    instructor_name VARCHAR(200),
    day_of_week INTEGER, -- 0=Sunday, 1=Monday, ... (Legacy, use days_of_week)
    days_of_week INTEGER[], -- Array of days (0-6)
    start_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    max_capacity INTEGER DEFAULT 20,
    price_cents INTEGER DEFAULT 1200, -- $12.00 default
    is_active BOOLEAN DEFAULT true,
    acuity_appointment_type_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- WORKOUT TRACKING SYSTEM TABLES
-- ============================================

-- Workout types reference table
CREATE TABLE workout_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Body focus areas reference table
CREATE TABLE body_focus_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise library
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    workout_type_id UUID REFERENCES workout_types(id),
    primary_muscle_group UUID REFERENCES body_focus_areas(id),
    equipment_required VARCHAR(100),
    difficulty_level VARCHAR(20),
    video_url VARCHAR(255),
    instructions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout templates (reusable workout plans)
CREATE TABLE workout_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    workout_type_id UUID REFERENCES workout_types(id),
    estimated_duration_minutes INTEGER,
    difficulty_level VARCHAR(20),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Template exercises (junction table)
CREATE TABLE template_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id),
    order_in_template INTEGER NOT NULL,
    suggested_sets INTEGER,
    suggested_reps INTEGER,
    suggested_weight_lbs DECIMAL(6,2),
    suggested_rest_seconds INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Template body focus (junction table)
CREATE TABLE template_body_focus (
    template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
    body_focus_id UUID NOT NULL REFERENCES body_focus_areas(id),
    PRIMARY KEY (template_id, body_focus_id)
);

-- Workout sessions (actual workout instances)
CREATE TABLE workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES users(id),
    class_id UUID REFERENCES classes(id),
    template_id UUID REFERENCES workout_templates(id),
    workout_type_id UUID REFERENCES workout_types(id),
    session_date DATE NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    notes TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session participants (junction table)
CREATE TABLE session_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id),
    attended BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, client_id)
);

-- Session body focus (junction table)
CREATE TABLE session_body_focus (
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    body_focus_id UUID NOT NULL REFERENCES body_focus_areas(id),
    PRIMARY KEY (session_id, body_focus_id)
);

-- Session exercises (exercises in a specific session)
CREATE TABLE session_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id),
    order_in_session INTEGER NOT NULL,
    planned_sets INTEGER,
    planned_reps INTEGER,
    planned_weight_lbs DECIMAL(6,2),
    rest_seconds INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise logs (individual set performance tracking)
CREATE TABLE exercise_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_exercise_id UUID NOT NULL REFERENCES session_exercises(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id),
    set_number INTEGER NOT NULL,
    reps_completed INTEGER,
    weight_used_lbs DECIMAL(6,2),
    duration_seconds INTEGER,
    distance_miles DECIMAL(6,2),
    rest_taken_seconds INTEGER,
    rpe SMALLINT,
    form_rating SMALLINT,
    notes TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logged_by UUID REFERENCES users(id)
);

-- Client progress metrics (body measurements)
CREATE TABLE client_progress_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id),
    log_date DATE NOT NULL,
    weight_lbs DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,2),
    muscle_mass_lbs DECIMAL(5,2),
    chest_inches DECIMAL(4,2),
    waist_inches DECIMAL(4,2),
    hips_inches DECIMAL(4,2),
    bicep_inches DECIMAL(4,2),
    thigh_inches DECIMAL(4,2),
    photo_url VARCHAR(255),
    notes TEXT,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personal records tracking (automatic PR detection)
CREATE TABLE personal_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id),
    exercise_id UUID NOT NULL REFERENCES exercises(id),
    record_type VARCHAR(20) NOT NULL, -- 'max_weight', 'max_reps', 'max_volume'
    value DECIMAL(8,2) NOT NULL,
    achieved_at TIMESTAMP NOT NULL,
    exercise_log_id UUID REFERENCES exercise_logs(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, exercise_id, record_type)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_trainer_profiles_user_id ON trainer_profiles(user_id);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_trainer_id ON appointments(trainer_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_forms_user_id ON forms(user_id);
CREATE INDEX idx_forms_form_type ON forms(form_type);
CREATE INDEX idx_classes_day_of_week ON classes(day_of_week);
CREATE INDEX idx_classes_instructor_id ON classes(instructor_id);
CREATE INDEX idx_classes_is_active ON classes(is_active);
CREATE INDEX idx_classes_category ON classes(category);

-- Workout tracking indexes
CREATE INDEX idx_exercises_workout_type ON exercises(workout_type_id);
CREATE INDEX idx_exercises_muscle_group ON exercises(primary_muscle_group);
CREATE INDEX idx_exercises_active ON exercises(is_active);
CREATE INDEX idx_workout_templates_trainer ON workout_templates(trainer_id);
CREATE INDEX idx_workout_templates_type ON workout_templates(workout_type_id);
CREATE INDEX idx_template_exercises_template ON template_exercises(template_id);
CREATE INDEX idx_template_exercises_order ON template_exercises(template_id, order_in_template);
CREATE INDEX idx_workout_sessions_trainer ON workout_sessions(trainer_id);
CREATE INDEX idx_workout_sessions_class ON workout_sessions(class_id);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(session_date);
CREATE INDEX idx_session_participants_session ON session_participants(session_id);
CREATE INDEX idx_session_participants_client ON session_participants(client_id);
CREATE INDEX idx_session_exercises_session ON session_exercises(session_id);
CREATE INDEX idx_session_exercises_order ON session_exercises(session_id, order_in_session);
CREATE INDEX idx_exercise_logs_session_exercise ON exercise_logs(session_exercise_id);
CREATE INDEX idx_exercise_logs_client ON exercise_logs(client_id);
CREATE INDEX idx_exercise_logs_date ON exercise_logs(logged_at);
CREATE INDEX idx_progress_metrics_client ON client_progress_metrics(client_id);
CREATE INDEX idx_progress_metrics_date ON client_progress_metrics(log_date);
CREATE INDEX idx_personal_records_client ON personal_records(client_id);
CREATE INDEX idx_personal_records_exercise ON personal_records(exercise_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainer_profiles_updated_at BEFORE UPDATE ON trainer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Workout tracking triggers
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at BEFORE UPDATE ON workout_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at BEFORE UPDATE ON workout_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

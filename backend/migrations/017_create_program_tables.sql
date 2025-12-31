-- Phase 2: Structured Programming (Migration 017)
-- Supports multi-week routines and client assignments

-- Programs table: Defines the high-level training plan
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_weeks INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Program Templates table: Junction table mapping templates to days/weeks
CREATE TABLE IF NOT EXISTS program_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    day_number INTEGER NOT NULL, -- 1 to 7
    order_in_day INTEGER DEFAULT 1,
    UNIQUE(program_id, week_number, day_number, order_in_day)
);

-- Program Assignments table: Tracks specific client progress
CREATE TABLE IF NOT EXISTS program_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    current_week INTEGER DEFAULT 1,
    current_day INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX idx_programs_trainer ON programs(trainer_id);
CREATE INDEX idx_program_templates_program ON program_templates(program_id);
CREATE INDEX idx_program_assignments_client ON program_assignments(client_id);
CREATE INDEX idx_program_assignments_status ON program_assignments(status);

-- Link workout_sessions to program_assignments
ALTER TABLE workout_sessions ADD COLUMN IF NOT EXISTS program_assignment_id UUID REFERENCES program_assignments(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_workout_sessions_program_assignment ON workout_sessions(program_assignment_id);

-- Add triggers for updated_at
CREATE OR REPLACE TRIGGER update_programs_modtime
    BEFORE UPDATE ON programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_program_assignments_modtime
    BEFORE UPDATE ON program_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

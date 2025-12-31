-- Phase 3: Multi-trainer Collaborative Programs (Migration 021)
-- Allows trainers to share and co-edit programs

CREATE TABLE IF NOT EXISTS program_collaborators (
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    can_edit BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (program_id, trainer_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_program_collaborators_trainer ON program_collaborators(trainer_id);

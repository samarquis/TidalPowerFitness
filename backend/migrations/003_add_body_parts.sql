
-- Create body_parts table
CREATE TABLE IF NOT EXISTS body_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add body_part_id to body_focus_areas
ALTER TABLE body_focus_areas 
ADD COLUMN IF NOT EXISTS body_part_id UUID REFERENCES body_parts(id) ON DELETE SET NULL;

-- Seed initial body parts
INSERT INTO body_parts (name, description) VALUES 
('Upper Body', 'Chest, Back, Shoulders, Arms'),
('Lower Body', 'Legs, Glutes'),
('Core', 'Abs, Obliques, Lower Back'),
('Full Body', 'Compound movements involving multiple major muscle groups')
ON CONFLICT (name) DO NOTHING;

-- Map existing body focus areas to body parts (Best effort mapping)
-- Upper Body
UPDATE body_focus_areas SET body_part_id = (SELECT id FROM body_parts WHERE name = 'Upper Body') 
WHERE name IN ('Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Traps', 'Lats');

-- Lower Body
UPDATE body_focus_areas SET body_part_id = (SELECT id FROM body_parts WHERE name = 'Lower Body') 
WHERE name IN ('Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Adductors', 'Abductors');

-- Core
UPDATE body_focus_areas SET body_part_id = (SELECT id FROM body_parts WHERE name = 'Core') 
WHERE name IN ('Abs', 'Obliques', 'Lower Back');

-- Full Body / Cardio
UPDATE body_focus_areas SET body_part_id = (SELECT id FROM body_parts WHERE name = 'Full Body') 
WHERE name IN ('Full Body', 'Cardio');

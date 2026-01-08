-- Seed Challenges and Programs for UI Review
-- 2026-01-08

-- Insert some active challenges
INSERT INTO challenges (trainer_id, name, description, start_date, end_date, type, goal_value, is_public)
VALUES 
((SELECT id FROM users WHERE roles @> ARRAY['trainer']::TEXT[] LIMIT 1), 
 'January Juggernaut', 'Lift a total of 100,000 lbs this month to earn the Iron Titan badge!', 
 '2026-01-01', '2026-01-31', 'total_volume', 100000, true),
((SELECT id FROM users WHERE roles @> ARRAY['trainer']::TEXT[] LIMIT 1), 
 'Consistency King', 'Complete 15 workouts in 30 days.', 
 '2026-01-01', '2026-01-30', 'total_workouts', 15, true),
((SELECT id FROM users WHERE roles @> ARRAY['trainer']::TEXT[] LIMIT 1), 
 'Squat PR Pursuit', 'Hit a new 1-rep max on Squats.', 
 '2026-01-05', '2026-01-20', 'max_weight', 1, true);

-- Insert a sample program
INSERT INTO programs (trainer_id, name, description, total_weeks, is_public)
VALUES
((SELECT id FROM users WHERE roles @> ARRAY['trainer']::TEXT[] LIMIT 1),
 'Tsunami Foundation 4-Week', 'A comprehensive 4-week program designed to build core strength and metabolic conditioning.',
 4, true);

-- Link some templates to the program (using whatever templates exist)
INSERT INTO program_templates (program_id, template_id, week_number, day_number)
SELECT 
    (SELECT id FROM programs WHERE name = 'Tsunami Foundation 4-Week'),
    id,
    1,
    1
FROM workout_templates 
LIMIT 1;

INSERT INTO program_templates (program_id, template_id, week_number, day_number)
SELECT 
    (SELECT id FROM programs WHERE name = 'Tsunami Foundation 4-Week'),
    id,
    1,
    3
FROM workout_templates 
OFFSET 1 LIMIT 1;

-- If no templates existed to link, this next part will just fail silently or do nothing
-- Assign the program to our primary admin/test user Scott
INSERT INTO program_assignments (client_id, program_id, trainer_id, start_date, status)
SELECT 
    (SELECT id FROM users WHERE email = 'samarquis4@gmail.com'),
    (SELECT id FROM programs WHERE name = 'Tsunami Foundation 4-Week'),
    (SELECT id FROM users WHERE roles @> ARRAY['trainer']::TEXT[] LIMIT 1),
    CURRENT_DATE,
    'active'
ON CONFLICT DO NOTHING;

-- Add movement_pattern to exercises
ALTER TABLE exercises ADD COLUMN movement_pattern VARCHAR(20) CHECK (movement_pattern IN ('Push', 'Pull', 'Legs', 'Static', 'None'));

-- Update existing exercises based on names
UPDATE exercises SET movement_pattern = 'Push' WHERE name IN ('Bench Press', 'Shoulder Press');
UPDATE exercises SET movement_pattern = 'Pull' WHERE name IN ('Pull-ups', 'Dumbbell Rows', 'Bicep Curls');
UPDATE exercises SET movement_pattern = 'Legs' WHERE name IN ('Barbell Squat', 'Deadlift', 'Lunges', 'Leg Press');
UPDATE exercises SET movement_pattern = 'Static' WHERE name IN ('Plank', 'Crunches', 'Russian Twists');
UPDATE exercises SET movement_pattern = 'None' WHERE name IN ('Running', 'Rowing', 'Jump Rope');

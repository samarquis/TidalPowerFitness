-- Seed data for development and testing
-- Run this after init.sql

-- Insert admin users
-- Scott Marquis - Primary Admin (password: admin123 - hashed with bcrypt)
INSERT INTO users (email, password_hash, first_name, last_name, role, roles, phone) VALUES
('samarquis4@gmail.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Scott', 'Marquis', 'admin', ARRAY['admin'], '555-0001'),
('admin@tidalpower.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Admin', 'User', 'admin', ARRAY['admin'], '555-0100');

-- Insert sample trainers
INSERT INTO users (email, password_hash, first_name, last_name, role, roles, phone) VALUES
('john.smith@tidalpower.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'John', 'Smith', 'trainer', ARRAY['trainer'], '555-0101'),
('sarah.johnson@tidalpower.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Sarah', 'Johnson', 'trainer', ARRAY['trainer'], '555-0102'),
('mike.williams@tidalpower.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Mike', 'Williams', 'trainer', ARRAY['trainer'], '555-0103');

-- Insert sample clients
INSERT INTO users (email, password_hash, first_name, last_name, role, roles, phone) VALUES
('client1@example.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Jane', 'Doe', 'client', ARRAY['client'], '555-0201'),
('client2@example.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Bob', 'Anderson', 'client', ARRAY['client'], '555-0202');

-- Create trainer profiles
INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients)
SELECT 
    id,
    'Certified personal trainer specializing in strength training and athletic performance.',
    ARRAY['Strength Training', 'Athletic Performance', 'Nutrition'],
    ARRAY['NASM-CPT', 'CSCS'],
    8,
    true
FROM users WHERE email = 'john.smith@tidalpower.com';

INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients)
SELECT 
    id,
    'Expert in functional fitness and injury rehabilitation with a holistic approach.',
    ARRAY['Functional Fitness', 'Rehabilitation', 'Mobility'],
    ARRAY['ACE-CPT', 'FMS Level 2'],
    6,
    true
FROM users WHERE email = 'sarah.johnson@tidalpower.com';

INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients)
SELECT 
    id,
    'Former competitive athlete focused on high-intensity training and sports conditioning.',
    ARRAY['HIIT', 'Sports Conditioning', 'Weight Loss'],
    ARRAY['ISSA-CPT', 'Precision Nutrition Level 1'],
    5,
    true
FROM users WHERE email = 'mike.williams@tidalpower.com';

-- Insert sample appointments
INSERT INTO appointments (client_id, trainer_id, appointment_type, scheduled_at, duration_minutes, status)
SELECT 
    (SELECT id FROM users WHERE email = 'client1@example.com'),
    (SELECT id FROM users WHERE email = 'john.smith@tidalpower.com'),
    'Personal Training Session',
    CURRENT_TIMESTAMP + INTERVAL '2 days',
    60,
    'scheduled';

INSERT INTO appointments (client_id, trainer_id, appointment_type, scheduled_at, duration_minutes, status)
SELECT 
    (SELECT id FROM users WHERE email = 'client2@example.com'),
    (SELECT id FROM users WHERE email = 'sarah.johnson@tidalpower.com'),
    'Initial Consultation',
    CURRENT_TIMESTAMP + INTERVAL '3 days',
    30,
    'scheduled';

-- Insert sample classes based on Acuity schedule
INSERT INTO classes (name, description, category, instructor_name, day_of_week, start_time, duration_minutes, max_capacity, price_cents, acuity_appointment_type_id) VALUES
('Barre w/ Michelle', 'A low-impact, full-body workout using a ballet barre for support. It focuses on small, high-repetition movements and isometric holds to build muscular endurance, sculpt lean muscle, and improve flexibility.', 'Barre', 'Michelle', 1, '18:00:00', 45, 12, 1200, '83401674'),
('Tsunami Strength w/ Lisa', 'Increase your strength and improve cardiovascular fitness with this circuit class. You''ll move through a variety of timed stations using free weights and your own bodyweight to challenge every major muscle group.', 'Circuits', 'Lisa', 3, '17:30:00', 45, 4, 1200, '83397040'),
('Power Bounce w/ Kalee', 'Get ready for a super fun and effective workout! In this Power Rebounding class, you''ll use a mini-trampoline to get a heart-pumping, full-body sweat without the joint stress of high-impact exercises.', 'Power Bounce', 'Kalee', 5, '09:00:00', 45, 5, 1200, '83401870'),
('Vinyasa Yoga w/ Edna', 'Join us on the mat for a joyful Vinyasa experience, blending mindful movement with good vibes. This class is an invitation for everyone to explore their practice with a sense of curiosity and playfulness.', 'Yoga', 'Edna', 2, '18:30:00', 45, 10, 1200, '85964720'),
('GLOW Pound w/ Michelle', 'Unleash your inner rockstar! A dynamic, fun, and high-energy workout. This is a full-body cardio jam session that will make you feel amazing.', 'Pop up', 'Michelle', 5, '19:00:00', 45, 12, 1000, '84715151'),
('Zumba w/ Tamara', 'Ditch the workout and join the party! This is a high-energy, feel-good session combining red-hot international rhythms (Salsa, Merengue, Hip-Hop, and more) with easy-to-follow moves for a total body workout.', 'Pop up', 'Tamara', 6, '10:00:00', 45, 8, 1000, '85964992');

-- ============================================
-- WORKOUT TRACKING SEED DATA
-- ============================================

-- Insert workout types
INSERT INTO workout_types (name, description) VALUES
('Strength', 'Resistance training to build muscle and strength'),
('Cardio', 'Cardiovascular exercises to improve endurance'),
('HIIT', 'High-Intensity Interval Training'),
('Yoga', 'Flexibility and mindfulness exercises'),
('Stretching', 'Flexibility and recovery exercises'),
('Plyometrics', 'Explosive power training'),
('Circuit', 'Mixed exercise circuits');

-- Insert body focus areas
INSERT INTO body_focus_areas (name, description) VALUES
('Legs', 'Quadriceps, hamstrings, calves, glutes'),
('Arms', 'Biceps, triceps, forearms'),
('Back', 'Upper back, lower back, lats'),
('Core', 'Abs, obliques, lower back'),
('Chest', 'Pectorals'),
('Shoulders', 'Deltoids, rotator cuff'),
('Full Body', 'Compound movements targeting multiple muscle groups');

-- Insert sample exercises
INSERT INTO exercises (name, description, workout_type_id, primary_muscle_group, equipment_required, difficulty_level, instructions) VALUES
-- Leg exercises
('Barbell Squat', 'Compound lower body exercise targeting quads, glutes, and core', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Legs'), 'Barbell', 'Intermediate', 'Stand with feet shoulder-width apart, bar on upper back. Lower hips back and down, keeping chest up. Drive through heels to return to start.'),
('Deadlift', 'Full body compound lift emphasizing posterior chain', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Full Body'), 'Barbell', 'Advanced', 'Stand with feet hip-width apart, grip bar. Keep back straight, drive through heels to lift bar. Lower with control.'),
('Lunges', 'Single leg strength and balance exercise', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Legs'), 'Bodyweight', 'Beginner', 'Step forward with one leg, lower hips until both knees bent at 90 degrees. Push back to start.'),
('Leg Press', 'Machine-based quad and glute exercise', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Legs'), 'Machine', 'Beginner', 'Sit in machine, feet on platform. Push platform away by extending legs. Lower with control.'),

-- Upper body exercises
('Bench Press', 'Upper body push exercise for chest and triceps', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Chest'), 'Barbell', 'Intermediate', 'Lie on bench, grip bar slightly wider than shoulders. Lower bar to chest, press back up.'),
('Pull-ups', 'Bodyweight back and bicep exercise', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Back'), 'Pull-up Bar', 'Intermediate', 'Hang from bar with overhand grip. Pull body up until chin over bar. Lower with control.'),
('Dumbbell Rows', 'Back exercise for lats and rhomboids', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Back'), 'Dumbbells', 'Beginner', 'Bend at hips, one hand on bench. Pull dumbbell to hip, squeezing shoulder blade. Lower with control.'),
('Shoulder Press', 'Overhead pressing for deltoids', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Shoulders'), 'Dumbbells', 'Beginner', 'Stand or sit, dumbbells at shoulders. Press overhead until arms extended. Lower with control.'),
('Bicep Curls', 'Isolation exercise for biceps', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Arms'), 'Dumbbells', 'Beginner', 'Stand with dumbbells at sides. Curl weights to shoulders, keeping elbows stationary. Lower with control.'),

-- Core exercises
('Plank', 'Core stability and endurance exercise', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Core'), 'Bodyweight', 'Beginner', 'Hold push-up position on forearms, body straight from head to heels. Engage core, hold position.'),
('Crunches', 'Abdominal isolation exercise', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Core'), 'Bodyweight', 'Beginner', 'Lie on back, knees bent. Lift shoulders off ground, contracting abs. Lower with control.'),
('Russian Twists', 'Oblique and core rotation exercise', (SELECT id FROM workout_types WHERE name='Strength'), (SELECT id FROM body_focus_areas WHERE name='Core'), 'Bodyweight', 'Intermediate', 'Sit with knees bent, lean back slightly. Rotate torso side to side, touching ground beside hips.'),

-- Cardio exercises
('Running', 'Cardiovascular endurance exercise', (SELECT id FROM workout_types WHERE name='Cardio'), (SELECT id FROM body_focus_areas WHERE name='Full Body'), 'Treadmill', 'Beginner', 'Maintain steady pace, proper running form. Adjust speed and incline as needed.'),
('Rowing', 'Full body cardio and strength exercise', (SELECT id FROM workout_types WHERE name='Cardio'), (SELECT id FROM body_focus_areas WHERE name='Full Body'), 'Rowing Machine', 'Intermediate', 'Push with legs, pull with arms in coordinated motion. Maintain steady rhythm.'),
('Jump Rope', 'High-intensity cardio exercise', (SELECT id FROM workout_types WHERE name='Cardio'), (SELECT id FROM body_focus_areas WHERE name='Full Body'), 'Jump Rope', 'Beginner', 'Jump over rope with both feet, maintaining rhythm. Keep jumps low and controlled.');

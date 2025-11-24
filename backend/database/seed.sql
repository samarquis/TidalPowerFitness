-- Seed data for development and testing
-- Run this after init.sql

-- Insert admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (email, password_hash, first_name, last_name, role, phone) VALUES
('admin@titanpower.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Admin', 'User', 'admin', '555-0100');

-- Insert sample trainers
INSERT INTO users (email, password_hash, first_name, last_name, role, phone) VALUES
('john.smith@titanpower.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'John', 'Smith', 'trainer', '555-0101'),
('sarah.johnson@titanpower.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Sarah', 'Johnson', 'trainer', '555-0102'),
('mike.williams@titanpower.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Mike', 'Williams', 'trainer', '555-0103');

-- Insert sample clients
INSERT INTO users (email, password_hash, first_name, last_name, role, phone) VALUES
('client1@example.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Jane', 'Doe', 'client', '555-0201'),
('client2@example.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Bob', 'Anderson', 'client', '555-0202');

-- Create trainer profiles
INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients)
SELECT 
    id,
    'Certified personal trainer specializing in strength training and athletic performance.',
    ARRAY['Strength Training', 'Athletic Performance', 'Nutrition'],
    ARRAY['NASM-CPT', 'CSCS'],
    8,
    true
FROM users WHERE email = 'john.smith@titanpower.com';

INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients)
SELECT 
    id,
    'Expert in functional fitness and injury rehabilitation with a holistic approach.',
    ARRAY['Functional Fitness', 'Rehabilitation', 'Mobility'],
    ARRAY['ACE-CPT', 'FMS Level 2'],
    6,
    true
FROM users WHERE email = 'sarah.johnson@titanpower.com';

INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients)
SELECT 
    id,
    'Former competitive athlete focused on high-intensity training and sports conditioning.',
    ARRAY['HIIT', 'Sports Conditioning', 'Weight Loss'],
    ARRAY['ISSA-CPT', 'Precision Nutrition Level 1'],
    5,
    true
FROM users WHERE email = 'mike.williams@titanpower.com';

-- Insert sample appointments
INSERT INTO appointments (client_id, trainer_id, appointment_type, scheduled_at, duration_minutes, status)
SELECT 
    (SELECT id FROM users WHERE email = 'client1@example.com'),
    (SELECT id FROM users WHERE email = 'john.smith@titanpower.com'),
    'Personal Training Session',
    CURRENT_TIMESTAMP + INTERVAL '2 days',
    60,
    'scheduled';

INSERT INTO appointments (client_id, trainer_id, appointment_type, scheduled_at, duration_minutes, status)
SELECT 
    (SELECT id FROM users WHERE email = 'client2@example.com'),
    (SELECT id FROM users WHERE email = 'sarah.johnson@titanpower.com'),
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

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

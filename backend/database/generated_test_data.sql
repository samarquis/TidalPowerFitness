
-- Ensure Scott Marquis (admin) exists

INSERT INTO users (email, password_hash, first_name, last_name, role, phone)
VALUES ('samarquis4@gmail.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Scott', 'Marquis', 'admin', '555-0001')
ON CONFLICT (email) DO NOTHING;


-- Generated Test Users and Trainer Profiles
INSERT INTO users (email, password_hash, first_name, last_name, role, phone) VALUES
('denver.randleman0@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Denver', 'Randleman', 'trainer', '555-6918'),
('jennifer.kale1@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Jennifer', 'Kale', 'trainer', '555-9330'),
('beetlejuice.ghost2@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Beetlejuice', 'Ghost', 'client', '555-9837'),
('monica.geller3@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Monica', 'Geller', 'client', '555-9431'),
('tashi.duncan4@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Tashi', 'Duncan', 'trainer', '555-1431'),
('rachel.green5@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Rachel', 'Green', 'client', '555-2635'),
('david.webster6@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'David', 'Webster', 'trainer', '555-9010'),
('robert.sink7@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Robert', 'Sink', 'trainer', '555-6492'),
('carwood.lipton8@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Carwood', 'Lipton', 'trainer', '555-8405'),
('adar.orc9@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Adar', 'Orc', 'trainer', '555-0641'),
('jessi.ngatikaura10@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Jessi', 'Ngatikaura', 'client', '555-5340'),
('miranda.mcwhorter11@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Miranda', 'McWhorter', 'client', '555-0030'),
('joey.tribbiani12@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Joey', 'Tribbiani', 'client', '555-2738'),
('moana.waialiki13@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Moana', 'Waialiki', 'client', '555-4055'),
('taylor.paul14@test.com', '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Taylor', 'Paul', 'client', '555-9866');

INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients) VALUES
((SELECT id FROM users WHERE email = 'denver.randleman0@test.com'), 'Tertius vitiosus usus bis supplanto stabilis conscendo cimentarius argumentum caste. Abbas quam ubi attollo sollicito universe suffragium bis combibo. Eos demonstro magnam deporto audeo reprehenderit color minus.', '["HIIT"]', '["ISSA-CPT"]', 15, false),
((SELECT id FROM users WHERE email = 'jennifer.kale1@test.com'), 'Cibus sollers corona virtus. Coaegresco distinctio vae contra tremo denuncio paens sto. At utrimque uter aequitas sollers.', '["Rehabilitation","HIIT","Cardio"]', '["CrossFit Level 1","ISSA-CPT"]', 8, false),
((SELECT id FROM users WHERE email = 'tashi.duncan4@test.com'), 'In sunt patria aut aggero. Tristis acquiro conatus est. Terebro depromo spero arbitro.', '["HIIT","Cardio","Nutrition"]', '["ACE-CPT"]', 8, false),
((SELECT id FROM users WHERE email = 'david.webster6@test.com'), 'Synagoga sumo attonbitus via pax. Somnus nobis tenus animi. Tactus a anser celer excepturi comburo nulla vir deludo eum.', '["Rehabilitation"]', '["NASM-CPT"]', 4, true),
((SELECT id FROM users WHERE email = 'robert.sink7@test.com'), 'Comes correptius conqueror virga defero spiculum. Adsidue stella coepi. Contego sit summa quibusdam ago.', '["HIIT"]', '["CrossFit Level 1","ACE-CPT"]', 6, false),
((SELECT id FROM users WHERE email = 'carwood.lipton8@test.com'), 'Teneo bellum amplitudo temptatio vel amplitudo occaecati. Sopor vacuus beneficium tremo. Trado clamo alveus tantum.', '["Yoga","Nutrition"]', '["ISSA-CPT","ACE-CPT"]', 3, true),
((SELECT id FROM users WHERE email = 'adar.orc9@test.com'), 'Asporto angustus dignissimos capitulus delectus civis vomica. Capio vero cumque capio amita spoliatio assentator summisse. Copia dicta fugiat inventore trado acerbitas minima consuasor depereo vitium.', '["HIIT","Cardio","Rehabilitation"]', '["ISSA-CPT"]', 4, true);


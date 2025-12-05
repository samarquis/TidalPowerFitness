-- Generated Test Class & Workout Session Data

-- Data for client: Rachel Green


-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '128ebb3d-eaf4-4dd6-8969-173e47c67143';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-08', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '65369b0a-d65b-4687-808d-bbefdff32ae5';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-11-21', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '04916c16-b282-41e8-aac4-16adc721e7e1';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-16', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('5d2144f9-4ab1-49ca-bd01-3a25cc6d0e2a', session_id_var, exercise_id_var, 1, 3, 10, 232);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('5d2144f9-4ab1-49ca-bd01-3a25cc6d0e2a', client_id_var, 1, 10, 184, client_id_var),
            ('5d2144f9-4ab1-49ca-bd01-3a25cc6d0e2a', client_id_var, 2, 9, 206, client_id_var),
            ('5d2144f9-4ab1-49ca-bd01-3a25cc6d0e2a', client_id_var, 3, 11, 186, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('650c182b-777a-40d9-aa57-9ae1672181da', session_id_var, exercise_id_var, 2, 3, 10, 121);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('650c182b-777a-40d9-aa57-9ae1672181da', client_id_var, 1, 11, 113, client_id_var),
            ('650c182b-777a-40d9-aa57-9ae1672181da', client_id_var, 2, 8, 228, client_id_var),
            ('650c182b-777a-40d9-aa57-9ae1672181da', client_id_var, 3, 12, 217, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('c30a62b9-feae-48aa-92fe-72bbbd83afbe', session_id_var, exercise_id_var, 3, 3, 10, 150);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('c30a62b9-feae-48aa-92fe-72bbbd83afbe', client_id_var, 1, 12, 205, client_id_var),
            ('c30a62b9-feae-48aa-92fe-72bbbd83afbe', client_id_var, 2, 10, 143, client_id_var),
            ('c30a62b9-feae-48aa-92fe-72bbbd83afbe', client_id_var, 3, 11, 102, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('17954033-9913-422c-9a06-6a3235befaed', session_id_var, exercise_id_var, 4, 3, 10, 205);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('17954033-9913-422c-9a06-6a3235befaed', client_id_var, 1, 12, 166, client_id_var),
            ('17954033-9913-422c-9a06-6a3235befaed', client_id_var, 2, 10, 120, client_id_var),
            ('17954033-9913-422c-9a06-6a3235befaed', client_id_var, 3, 9, 96, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('596dab89-3fec-462f-869a-bc13c937eaf5', session_id_var, exercise_id_var, 5, 3, 10, 227);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('596dab89-3fec-462f-869a-bc13c937eaf5', client_id_var, 1, 8, 198, client_id_var),
            ('596dab89-3fec-462f-869a-bc13c937eaf5', client_id_var, 2, 11, 144, client_id_var),
            ('596dab89-3fec-462f-869a-bc13c937eaf5', client_id_var, 3, 8, 201, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '59111c56-c5d7-4f82-beaf-2544eb85f776';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-26', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('a34f425b-a718-4d9b-86e0-596d64e62950', session_id_var, exercise_id_var, 1, 3, 10, 170);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('a34f425b-a718-4d9b-86e0-596d64e62950', client_id_var, 1, 8, 194, client_id_var),
            ('a34f425b-a718-4d9b-86e0-596d64e62950', client_id_var, 2, 8, 185, client_id_var),
            ('a34f425b-a718-4d9b-86e0-596d64e62950', client_id_var, 3, 8, 84, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('d9f38774-ac27-4dad-a604-727e980541da', session_id_var, exercise_id_var, 2, 3, 10, 130);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('d9f38774-ac27-4dad-a604-727e980541da', client_id_var, 1, 9, 232, client_id_var),
            ('d9f38774-ac27-4dad-a604-727e980541da', client_id_var, 2, 9, 57, client_id_var),
            ('d9f38774-ac27-4dad-a604-727e980541da', client_id_var, 3, 10, 119, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('67e30be9-18a5-48eb-a518-818f60d2edd3', session_id_var, exercise_id_var, 3, 3, 10, 213);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('67e30be9-18a5-48eb-a518-818f60d2edd3', client_id_var, 1, 8, 249, client_id_var),
            ('67e30be9-18a5-48eb-a518-818f60d2edd3', client_id_var, 2, 11, 235, client_id_var),
            ('67e30be9-18a5-48eb-a518-818f60d2edd3', client_id_var, 3, 11, 224, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('0f732771-9629-417b-89dd-1378d33eab51', session_id_var, exercise_id_var, 4, 3, 10, 61);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('0f732771-9629-417b-89dd-1378d33eab51', client_id_var, 1, 9, 215, client_id_var),
            ('0f732771-9629-417b-89dd-1378d33eab51', client_id_var, 2, 12, 224, client_id_var),
            ('0f732771-9629-417b-89dd-1378d33eab51', client_id_var, 3, 10, 237, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('0911704e-e84b-4e7f-bafe-22c306f116b1', session_id_var, exercise_id_var, 5, 3, 10, 246);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('0911704e-e84b-4e7f-bafe-22c306f116b1', client_id_var, 1, 11, 104, client_id_var),
            ('0911704e-e84b-4e7f-bafe-22c306f116b1', client_id_var, 2, 12, 83, client_id_var),
            ('0911704e-e84b-4e7f-bafe-22c306f116b1', client_id_var, 3, 11, 121, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '3e203011-f0b4-4bd0-b88c-879764be87ea';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-25', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '5bd8e560-d11f-4422-82a7-078949720c54';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-29', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '04166cb7-e89d-4019-8302-4d9d3317b450';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-27', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '6fc6e47e-be4d-476d-b089-895cc5214747';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-06', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '430bcafc-9dbe-4abe-9bfa-f21bcfbc08a5';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-22', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '8c7e072e-eb24-4410-97f6-0a54c1e6dd73';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-14', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'f5f492f9-7157-4b20-973c-f5932a9f85e8';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-28', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'bfd07b11-6754-4df9-bcde-af079f1b8cb0';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-11-02', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'cf80f96f-0195-4225-8cf7-f2ece7981f96';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-08', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '32b649f5-734d-4673-91dc-54899b94ca73';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-31', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('239257c6-99b7-4101-9ab4-9fb48b673ddb', session_id_var, exercise_id_var, 1, 3, 10, 106);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('239257c6-99b7-4101-9ab4-9fb48b673ddb', client_id_var, 1, 9, 73, client_id_var),
            ('239257c6-99b7-4101-9ab4-9fb48b673ddb', client_id_var, 2, 10, 59, client_id_var),
            ('239257c6-99b7-4101-9ab4-9fb48b673ddb', client_id_var, 3, 10, 117, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('05135836-0a86-400f-9edd-10d90e54b8b3', session_id_var, exercise_id_var, 2, 3, 10, 224);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('05135836-0a86-400f-9edd-10d90e54b8b3', client_id_var, 1, 9, 214, client_id_var),
            ('05135836-0a86-400f-9edd-10d90e54b8b3', client_id_var, 2, 12, 249, client_id_var),
            ('05135836-0a86-400f-9edd-10d90e54b8b3', client_id_var, 3, 12, 202, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('41064c99-9d53-4068-8fe5-f203eb81de4b', session_id_var, exercise_id_var, 3, 3, 10, 223);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('41064c99-9d53-4068-8fe5-f203eb81de4b', client_id_var, 1, 10, 165, client_id_var),
            ('41064c99-9d53-4068-8fe5-f203eb81de4b', client_id_var, 2, 10, 220, client_id_var),
            ('41064c99-9d53-4068-8fe5-f203eb81de4b', client_id_var, 3, 10, 124, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('6ebf21f7-5ba9-4a7a-939b-21c6d611f157', session_id_var, exercise_id_var, 4, 3, 10, 93);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('6ebf21f7-5ba9-4a7a-939b-21c6d611f157', client_id_var, 1, 12, 101, client_id_var),
            ('6ebf21f7-5ba9-4a7a-939b-21c6d611f157', client_id_var, 2, 11, 146, client_id_var),
            ('6ebf21f7-5ba9-4a7a-939b-21c6d611f157', client_id_var, 3, 8, 179, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('b6d891dc-7ec2-4239-b491-ad8e9919a154', session_id_var, exercise_id_var, 5, 3, 10, 217);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('b6d891dc-7ec2-4239-b491-ad8e9919a154', client_id_var, 1, 12, 88, client_id_var),
            ('b6d891dc-7ec2-4239-b491-ad8e9919a154', client_id_var, 2, 12, 247, client_id_var),
            ('b6d891dc-7ec2-4239-b491-ad8e9919a154', client_id_var, 3, 8, 233, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'c0c15898-778a-4f2a-9b2a-4536bff983dd';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'rachel.green0@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-14', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle

-- Data for client: Monica Geller


-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '2985c959-00c0-43bd-908d-a8a4d24412d2';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-03-01', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '4a6e9194-2f51-489f-975c-4256e42559ec';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-07', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'c0a390a8-16fa-4584-b88e-337db274fe0f';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-23', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('94efa648-c574-4395-b79c-04b9ab0484e3', session_id_var, exercise_id_var, 1, 3, 10, 239);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('94efa648-c574-4395-b79c-04b9ab0484e3', client_id_var, 1, 9, 205, client_id_var),
            ('94efa648-c574-4395-b79c-04b9ab0484e3', client_id_var, 2, 9, 240, client_id_var),
            ('94efa648-c574-4395-b79c-04b9ab0484e3', client_id_var, 3, 8, 50, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('6fbf3fb7-47c1-4ddb-ad02-3fd9f3a4bb5a', session_id_var, exercise_id_var, 2, 3, 10, 95);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('6fbf3fb7-47c1-4ddb-ad02-3fd9f3a4bb5a', client_id_var, 1, 10, 222, client_id_var),
            ('6fbf3fb7-47c1-4ddb-ad02-3fd9f3a4bb5a', client_id_var, 2, 12, 173, client_id_var),
            ('6fbf3fb7-47c1-4ddb-ad02-3fd9f3a4bb5a', client_id_var, 3, 10, 199, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('759633d8-630b-41be-878d-e93c0ca8b35a', session_id_var, exercise_id_var, 3, 3, 10, 112);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('759633d8-630b-41be-878d-e93c0ca8b35a', client_id_var, 1, 11, 74, client_id_var),
            ('759633d8-630b-41be-878d-e93c0ca8b35a', client_id_var, 2, 9, 183, client_id_var),
            ('759633d8-630b-41be-878d-e93c0ca8b35a', client_id_var, 3, 11, 76, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('4b629fc1-a492-478a-9e0d-fddf7334b167', session_id_var, exercise_id_var, 4, 3, 10, 148);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('4b629fc1-a492-478a-9e0d-fddf7334b167', client_id_var, 1, 8, 219, client_id_var),
            ('4b629fc1-a492-478a-9e0d-fddf7334b167', client_id_var, 2, 12, 95, client_id_var),
            ('4b629fc1-a492-478a-9e0d-fddf7334b167', client_id_var, 3, 12, 221, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('c31eb51e-dfba-4d46-b4c9-6643c0eceaea', session_id_var, exercise_id_var, 5, 3, 10, 207);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('c31eb51e-dfba-4d46-b4c9-6643c0eceaea', client_id_var, 1, 12, 66, client_id_var),
            ('c31eb51e-dfba-4d46-b4c9-6643c0eceaea', client_id_var, 2, 10, 142, client_id_var),
            ('c31eb51e-dfba-4d46-b4c9-6643c0eceaea', client_id_var, 3, 11, 141, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '74045f4a-6b92-4b99-97c4-f7571cdb5aef';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-02', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '0aee1d86-35fe-4799-9532-fc0f8e71c2c3';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-16', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '2fa8b9d1-509c-4f58-8a0a-fb1cdb3b6782';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-02-22', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '9820b939-cdc5-4da1-bda1-decfe9fd25f5';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-08', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('5b72f630-77f4-4071-bc56-d2408e5b820b', session_id_var, exercise_id_var, 1, 3, 10, 175);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('5b72f630-77f4-4071-bc56-d2408e5b820b', client_id_var, 1, 10, 117, client_id_var),
            ('5b72f630-77f4-4071-bc56-d2408e5b820b', client_id_var, 2, 9, 124, client_id_var),
            ('5b72f630-77f4-4071-bc56-d2408e5b820b', client_id_var, 3, 8, 78, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('ac4589ba-cff8-42af-b600-6b7cebd05cd5', session_id_var, exercise_id_var, 2, 3, 10, 99);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('ac4589ba-cff8-42af-b600-6b7cebd05cd5', client_id_var, 1, 11, 159, client_id_var),
            ('ac4589ba-cff8-42af-b600-6b7cebd05cd5', client_id_var, 2, 9, 250, client_id_var),
            ('ac4589ba-cff8-42af-b600-6b7cebd05cd5', client_id_var, 3, 8, 230, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('ad16e794-b49b-4896-80cf-6d021d3cb3ca', session_id_var, exercise_id_var, 3, 3, 10, 207);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('ad16e794-b49b-4896-80cf-6d021d3cb3ca', client_id_var, 1, 10, 193, client_id_var),
            ('ad16e794-b49b-4896-80cf-6d021d3cb3ca', client_id_var, 2, 12, 158, client_id_var),
            ('ad16e794-b49b-4896-80cf-6d021d3cb3ca', client_id_var, 3, 11, 174, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('e823ff05-466d-4af5-b49c-73bea97936f9', session_id_var, exercise_id_var, 4, 3, 10, 54);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('e823ff05-466d-4af5-b49c-73bea97936f9', client_id_var, 1, 11, 245, client_id_var),
            ('e823ff05-466d-4af5-b49c-73bea97936f9', client_id_var, 2, 10, 177, client_id_var),
            ('e823ff05-466d-4af5-b49c-73bea97936f9', client_id_var, 3, 9, 102, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('7d494eb1-22b2-48f7-b51c-16c2dd909192', session_id_var, exercise_id_var, 5, 3, 10, 237);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('7d494eb1-22b2-48f7-b51c-16c2dd909192', client_id_var, 1, 8, 242, client_id_var),
            ('7d494eb1-22b2-48f7-b51c-16c2dd909192', client_id_var, 2, 11, 124, client_id_var),
            ('7d494eb1-22b2-48f7-b51c-16c2dd909192', client_id_var, 3, 11, 88, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '765f791b-e451-4fdb-bbf5-fea9f3b3db87';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-26', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'ba313aae-9de2-479e-9cda-018e6083df01';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-27', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'd9bf8c9a-fc49-457c-b9ec-3b4dae7d67b8';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'fe7c822b-e015-4c26-86ba-e64d24dd6289';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-22', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '8afc11c6-7eda-4f0a-ac25-e6302ff89243';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-03', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'ca444bf5-2df9-4029-b102-c008bdee7db0';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-06', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('eb1ea064-4a60-4648-a268-5dda21d5afc8', session_id_var, exercise_id_var, 1, 3, 10, 87);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('eb1ea064-4a60-4648-a268-5dda21d5afc8', client_id_var, 1, 9, 242, client_id_var),
            ('eb1ea064-4a60-4648-a268-5dda21d5afc8', client_id_var, 2, 11, 222, client_id_var),
            ('eb1ea064-4a60-4648-a268-5dda21d5afc8', client_id_var, 3, 12, 156, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('e187a1fa-466a-4416-9e54-97a3e430ca93', session_id_var, exercise_id_var, 2, 3, 10, 172);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('e187a1fa-466a-4416-9e54-97a3e430ca93', client_id_var, 1, 9, 87, client_id_var),
            ('e187a1fa-466a-4416-9e54-97a3e430ca93', client_id_var, 2, 8, 146, client_id_var),
            ('e187a1fa-466a-4416-9e54-97a3e430ca93', client_id_var, 3, 9, 159, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('716d896d-b44f-4f49-bcf5-f04b0f6b54c8', session_id_var, exercise_id_var, 3, 3, 10, 202);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('716d896d-b44f-4f49-bcf5-f04b0f6b54c8', client_id_var, 1, 8, 218, client_id_var),
            ('716d896d-b44f-4f49-bcf5-f04b0f6b54c8', client_id_var, 2, 10, 198, client_id_var),
            ('716d896d-b44f-4f49-bcf5-f04b0f6b54c8', client_id_var, 3, 8, 111, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('d0155241-d442-49fe-8b62-bcde82d8c27e', session_id_var, exercise_id_var, 4, 3, 10, 102);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('d0155241-d442-49fe-8b62-bcde82d8c27e', client_id_var, 1, 8, 113, client_id_var),
            ('d0155241-d442-49fe-8b62-bcde82d8c27e', client_id_var, 2, 9, 178, client_id_var),
            ('d0155241-d442-49fe-8b62-bcde82d8c27e', client_id_var, 3, 9, 102, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('694b37e6-f272-4d63-b65c-9e9cd70a56c1', session_id_var, exercise_id_var, 5, 3, 10, 150);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('694b37e6-f272-4d63-b65c-9e9cd70a56c1', client_id_var, 1, 11, 141, client_id_var),
            ('694b37e6-f272-4d63-b65c-9e9cd70a56c1', client_id_var, 2, 10, 190, client_id_var),
            ('694b37e6-f272-4d63-b65c-9e9cd70a56c1', client_id_var, 3, 11, 54, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '9e4ae16f-255f-49e3-a711-382dc537f4b8';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-02-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'c6297494-26a3-4f60-9eb9-ef85a6637963';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'monica.geller1@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-22', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle

-- Data for client: Phoebe Buffay


-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'cd853466-824f-4423-849b-133539534b6f';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-25', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('83c97ed9-3f27-4beb-b179-bfc11c5a742a', session_id_var, exercise_id_var, 1, 3, 10, 109);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('83c97ed9-3f27-4beb-b179-bfc11c5a742a', client_id_var, 1, 11, 170, client_id_var),
            ('83c97ed9-3f27-4beb-b179-bfc11c5a742a', client_id_var, 2, 9, 242, client_id_var),
            ('83c97ed9-3f27-4beb-b179-bfc11c5a742a', client_id_var, 3, 10, 181, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('00310219-9b1a-4b90-b969-89f9c427e014', session_id_var, exercise_id_var, 2, 3, 10, 79);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('00310219-9b1a-4b90-b969-89f9c427e014', client_id_var, 1, 11, 114, client_id_var),
            ('00310219-9b1a-4b90-b969-89f9c427e014', client_id_var, 2, 8, 197, client_id_var),
            ('00310219-9b1a-4b90-b969-89f9c427e014', client_id_var, 3, 11, 241, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('68c1da06-48a5-4bff-8abc-34a688a98940', session_id_var, exercise_id_var, 3, 3, 10, 195);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('68c1da06-48a5-4bff-8abc-34a688a98940', client_id_var, 1, 11, 196, client_id_var),
            ('68c1da06-48a5-4bff-8abc-34a688a98940', client_id_var, 2, 12, 67, client_id_var),
            ('68c1da06-48a5-4bff-8abc-34a688a98940', client_id_var, 3, 12, 132, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('bbbdbd3d-3512-4a9e-a29a-f753c37a9046', session_id_var, exercise_id_var, 4, 3, 10, 74);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('bbbdbd3d-3512-4a9e-a29a-f753c37a9046', client_id_var, 1, 11, 188, client_id_var),
            ('bbbdbd3d-3512-4a9e-a29a-f753c37a9046', client_id_var, 2, 12, 71, client_id_var),
            ('bbbdbd3d-3512-4a9e-a29a-f753c37a9046', client_id_var, 3, 12, 126, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('22318f28-d170-4d81-842d-79b80d4a7f33', session_id_var, exercise_id_var, 5, 3, 10, 57);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('22318f28-d170-4d81-842d-79b80d4a7f33', client_id_var, 1, 8, 52, client_id_var),
            ('22318f28-d170-4d81-842d-79b80d4a7f33', client_id_var, 2, 9, 166, client_id_var),
            ('22318f28-d170-4d81-842d-79b80d4a7f33', client_id_var, 3, 10, 142, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'e48c4fd4-12e1-44a5-90fb-1c7480279d7f';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-26', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '9f7ca958-c0b9-431c-ac39-b3998a89b63a';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-06', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'e0913439-bca5-4e74-b571-8b1853830dd6';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-09', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('63ec4f60-1b2a-476b-abf2-83890eb683f1', session_id_var, exercise_id_var, 1, 3, 10, 91);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('63ec4f60-1b2a-476b-abf2-83890eb683f1', client_id_var, 1, 10, 172, client_id_var),
            ('63ec4f60-1b2a-476b-abf2-83890eb683f1', client_id_var, 2, 11, 154, client_id_var),
            ('63ec4f60-1b2a-476b-abf2-83890eb683f1', client_id_var, 3, 10, 93, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('f64db989-403a-45f2-8e05-bb05e5ca55ab', session_id_var, exercise_id_var, 2, 3, 10, 220);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('f64db989-403a-45f2-8e05-bb05e5ca55ab', client_id_var, 1, 12, 102, client_id_var),
            ('f64db989-403a-45f2-8e05-bb05e5ca55ab', client_id_var, 2, 9, 172, client_id_var),
            ('f64db989-403a-45f2-8e05-bb05e5ca55ab', client_id_var, 3, 11, 82, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('6d9b4b16-e956-4b8e-a8a6-b9caad9eb45e', session_id_var, exercise_id_var, 3, 3, 10, 134);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('6d9b4b16-e956-4b8e-a8a6-b9caad9eb45e', client_id_var, 1, 12, 108, client_id_var),
            ('6d9b4b16-e956-4b8e-a8a6-b9caad9eb45e', client_id_var, 2, 12, 145, client_id_var),
            ('6d9b4b16-e956-4b8e-a8a6-b9caad9eb45e', client_id_var, 3, 9, 99, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('cc3d4908-9d4d-4d7b-bf95-ce5d4a7b5b75', session_id_var, exercise_id_var, 4, 3, 10, 239);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('cc3d4908-9d4d-4d7b-bf95-ce5d4a7b5b75', client_id_var, 1, 9, 180, client_id_var),
            ('cc3d4908-9d4d-4d7b-bf95-ce5d4a7b5b75', client_id_var, 2, 12, 232, client_id_var),
            ('cc3d4908-9d4d-4d7b-bf95-ce5d4a7b5b75', client_id_var, 3, 9, 117, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('ce8d5242-d28e-4273-aac8-6862c6f8a440', session_id_var, exercise_id_var, 5, 3, 10, 182);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('ce8d5242-d28e-4273-aac8-6862c6f8a440', client_id_var, 1, 8, 191, client_id_var),
            ('ce8d5242-d28e-4273-aac8-6862c6f8a440', client_id_var, 2, 11, 130, client_id_var),
            ('ce8d5242-d28e-4273-aac8-6862c6f8a440', client_id_var, 3, 12, 227, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '12d6cd3d-0ae9-4581-bff1-9b373c2c6b84';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-13', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'edbd0921-6196-4903-9427-d6a341f636de';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-02-17', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'a6a7af8f-379f-49c9-ac55-cec71d29aa4d';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-07', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('8296e812-da04-4a69-a658-0c667240f557', session_id_var, exercise_id_var, 1, 3, 10, 103);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('8296e812-da04-4a69-a658-0c667240f557', client_id_var, 1, 12, 163, client_id_var),
            ('8296e812-da04-4a69-a658-0c667240f557', client_id_var, 2, 11, 177, client_id_var),
            ('8296e812-da04-4a69-a658-0c667240f557', client_id_var, 3, 8, 184, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('f941c9f7-64ee-48ec-8be9-20fb01bfc095', session_id_var, exercise_id_var, 2, 3, 10, 89);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('f941c9f7-64ee-48ec-8be9-20fb01bfc095', client_id_var, 1, 10, 110, client_id_var),
            ('f941c9f7-64ee-48ec-8be9-20fb01bfc095', client_id_var, 2, 11, 131, client_id_var),
            ('f941c9f7-64ee-48ec-8be9-20fb01bfc095', client_id_var, 3, 10, 126, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('88ee930b-948b-4d4a-bd25-52a6ad9f13e3', session_id_var, exercise_id_var, 3, 3, 10, 134);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('88ee930b-948b-4d4a-bd25-52a6ad9f13e3', client_id_var, 1, 10, 128, client_id_var),
            ('88ee930b-948b-4d4a-bd25-52a6ad9f13e3', client_id_var, 2, 11, 181, client_id_var),
            ('88ee930b-948b-4d4a-bd25-52a6ad9f13e3', client_id_var, 3, 9, 94, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('248b1724-a615-4a5c-9f87-665866cb2dbb', session_id_var, exercise_id_var, 4, 3, 10, 81);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('248b1724-a615-4a5c-9f87-665866cb2dbb', client_id_var, 1, 10, 171, client_id_var),
            ('248b1724-a615-4a5c-9f87-665866cb2dbb', client_id_var, 2, 10, 126, client_id_var),
            ('248b1724-a615-4a5c-9f87-665866cb2dbb', client_id_var, 3, 8, 186, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('d8824152-c330-4698-8c77-5392724bb710', session_id_var, exercise_id_var, 5, 3, 10, 119);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('d8824152-c330-4698-8c77-5392724bb710', client_id_var, 1, 10, 152, client_id_var),
            ('d8824152-c330-4698-8c77-5392724bb710', client_id_var, 2, 10, 158, client_id_var),
            ('d8824152-c330-4698-8c77-5392724bb710', client_id_var, 3, 9, 154, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'cb6fb587-579a-41cd-af1b-c3f841dd2d66';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-26', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'a6837106-0d74-475f-804d-e44e2ced818a';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-11', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '8893b2b6-2704-46ad-8077-243d25000bb8';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-25', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'c08a8718-41b0-4f8e-8916-5860c7f0b1f7';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-11', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'dc671f8c-9b37-4fae-906c-ce7c7c89b583';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-11', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '1ded3d47-95b5-4840-bc45-a5dd94ef2f24';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-08', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('ca2e95e0-3c6c-4930-871a-2bcdbadd79b6', session_id_var, exercise_id_var, 1, 3, 10, 221);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('ca2e95e0-3c6c-4930-871a-2bcdbadd79b6', client_id_var, 1, 8, 96, client_id_var),
            ('ca2e95e0-3c6c-4930-871a-2bcdbadd79b6', client_id_var, 2, 8, 130, client_id_var),
            ('ca2e95e0-3c6c-4930-871a-2bcdbadd79b6', client_id_var, 3, 12, 142, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('43ff164e-7f45-41da-bdcc-a5a3cf549d1c', session_id_var, exercise_id_var, 2, 3, 10, 65);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('43ff164e-7f45-41da-bdcc-a5a3cf549d1c', client_id_var, 1, 12, 172, client_id_var),
            ('43ff164e-7f45-41da-bdcc-a5a3cf549d1c', client_id_var, 2, 12, 161, client_id_var),
            ('43ff164e-7f45-41da-bdcc-a5a3cf549d1c', client_id_var, 3, 10, 197, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('1e13b5c4-d70a-40c3-913d-cd9fc3c6fc09', session_id_var, exercise_id_var, 3, 3, 10, 162);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('1e13b5c4-d70a-40c3-913d-cd9fc3c6fc09', client_id_var, 1, 11, 207, client_id_var),
            ('1e13b5c4-d70a-40c3-913d-cd9fc3c6fc09', client_id_var, 2, 9, 128, client_id_var),
            ('1e13b5c4-d70a-40c3-913d-cd9fc3c6fc09', client_id_var, 3, 11, 120, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('32b9818f-755d-4d7d-95e4-6a7876094374', session_id_var, exercise_id_var, 4, 3, 10, 116);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('32b9818f-755d-4d7d-95e4-6a7876094374', client_id_var, 1, 8, 192, client_id_var),
            ('32b9818f-755d-4d7d-95e4-6a7876094374', client_id_var, 2, 8, 213, client_id_var),
            ('32b9818f-755d-4d7d-95e4-6a7876094374', client_id_var, 3, 10, 124, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('16b63f9c-55e2-41e8-9d73-1ea275429be6', session_id_var, exercise_id_var, 5, 3, 10, 168);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('16b63f9c-55e2-41e8-9d73-1ea275429be6', client_id_var, 1, 9, 241, client_id_var),
            ('16b63f9c-55e2-41e8-9d73-1ea275429be6', client_id_var, 2, 8, 187, client_id_var),
            ('16b63f9c-55e2-41e8-9d73-1ea275429be6', client_id_var, 3, 11, 87, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '23c1d072-5e61-4d3c-a0e0-4c20fb576734';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-08', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '841fcfa7-39b1-4724-95c3-a04eaf328a08';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'phoebe.buffay2@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-03-11', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle

-- Data for client: Joey Tribbiani


-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '355b1c5a-1a6d-4203-8db2-89570bc39044';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-23', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'be3a6c63-f6bd-4173-9f55-94f5f9e4c3c9';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-10', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('d5ad9854-dfce-4e3c-844b-33bd57cc0001', session_id_var, exercise_id_var, 1, 3, 10, 202);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('d5ad9854-dfce-4e3c-844b-33bd57cc0001', client_id_var, 1, 10, 245, client_id_var),
            ('d5ad9854-dfce-4e3c-844b-33bd57cc0001', client_id_var, 2, 8, 89, client_id_var),
            ('d5ad9854-dfce-4e3c-844b-33bd57cc0001', client_id_var, 3, 11, 132, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('71774a47-3c2b-422b-8a9e-084a1415783f', session_id_var, exercise_id_var, 2, 3, 10, 237);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('71774a47-3c2b-422b-8a9e-084a1415783f', client_id_var, 1, 9, 85, client_id_var),
            ('71774a47-3c2b-422b-8a9e-084a1415783f', client_id_var, 2, 8, 234, client_id_var),
            ('71774a47-3c2b-422b-8a9e-084a1415783f', client_id_var, 3, 8, 220, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('c59e5d90-d810-46b6-a131-897b87cc4f30', session_id_var, exercise_id_var, 3, 3, 10, 136);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('c59e5d90-d810-46b6-a131-897b87cc4f30', client_id_var, 1, 8, 79, client_id_var),
            ('c59e5d90-d810-46b6-a131-897b87cc4f30', client_id_var, 2, 12, 233, client_id_var),
            ('c59e5d90-d810-46b6-a131-897b87cc4f30', client_id_var, 3, 9, 165, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('e0f54997-dc1d-4f8e-8ce9-4628320d4186', session_id_var, exercise_id_var, 4, 3, 10, 146);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('e0f54997-dc1d-4f8e-8ce9-4628320d4186', client_id_var, 1, 12, 108, client_id_var),
            ('e0f54997-dc1d-4f8e-8ce9-4628320d4186', client_id_var, 2, 8, 129, client_id_var),
            ('e0f54997-dc1d-4f8e-8ce9-4628320d4186', client_id_var, 3, 12, 216, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('2bf19368-dff3-4750-82db-546f7100cf96', session_id_var, exercise_id_var, 5, 3, 10, 67);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('2bf19368-dff3-4750-82db-546f7100cf96', client_id_var, 1, 8, 186, client_id_var),
            ('2bf19368-dff3-4750-82db-546f7100cf96', client_id_var, 2, 11, 210, client_id_var),
            ('2bf19368-dff3-4750-82db-546f7100cf96', client_id_var, 3, 11, 54, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '5bb7621b-b88d-46ce-91a1-f446aa95ebf8';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '1bd92e04-5568-4964-83b7-bee2caee50ae';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-26', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '335d8c5b-9be9-4c14-a5a2-2b1917d7bb25';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-25', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('455b4b03-bf81-4481-bc74-82cc3b732f1a', session_id_var, exercise_id_var, 1, 3, 10, 224);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('455b4b03-bf81-4481-bc74-82cc3b732f1a', client_id_var, 1, 12, 237, client_id_var),
            ('455b4b03-bf81-4481-bc74-82cc3b732f1a', client_id_var, 2, 8, 154, client_id_var),
            ('455b4b03-bf81-4481-bc74-82cc3b732f1a', client_id_var, 3, 11, 241, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('0b0fb427-89b0-4dd9-a63d-5c88132d9e57', session_id_var, exercise_id_var, 2, 3, 10, 78);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('0b0fb427-89b0-4dd9-a63d-5c88132d9e57', client_id_var, 1, 11, 87, client_id_var),
            ('0b0fb427-89b0-4dd9-a63d-5c88132d9e57', client_id_var, 2, 8, 205, client_id_var),
            ('0b0fb427-89b0-4dd9-a63d-5c88132d9e57', client_id_var, 3, 9, 57, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('26715f8b-1938-494f-90b8-b8bd2d7dc3e1', session_id_var, exercise_id_var, 3, 3, 10, 129);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('26715f8b-1938-494f-90b8-b8bd2d7dc3e1', client_id_var, 1, 8, 146, client_id_var),
            ('26715f8b-1938-494f-90b8-b8bd2d7dc3e1', client_id_var, 2, 11, 202, client_id_var),
            ('26715f8b-1938-494f-90b8-b8bd2d7dc3e1', client_id_var, 3, 9, 136, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('2213e763-1569-4e46-9b12-9c66508e95b1', session_id_var, exercise_id_var, 4, 3, 10, 238);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('2213e763-1569-4e46-9b12-9c66508e95b1', client_id_var, 1, 10, 75, client_id_var),
            ('2213e763-1569-4e46-9b12-9c66508e95b1', client_id_var, 2, 10, 57, client_id_var),
            ('2213e763-1569-4e46-9b12-9c66508e95b1', client_id_var, 3, 8, 53, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('e4b380b8-206f-40d9-8f7c-c2b01cf03280', session_id_var, exercise_id_var, 5, 3, 10, 144);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('e4b380b8-206f-40d9-8f7c-c2b01cf03280', client_id_var, 1, 11, 94, client_id_var),
            ('e4b380b8-206f-40d9-8f7c-c2b01cf03280', client_id_var, 2, 8, 164, client_id_var),
            ('e4b380b8-206f-40d9-8f7c-c2b01cf03280', client_id_var, 3, 11, 165, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'e2a1d1a7-e2c2-46da-9090-aa8bf044c413';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-02-26', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('ae542d83-114d-4577-a056-763c6519ef13', session_id_var, exercise_id_var, 1, 3, 10, 55);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('ae542d83-114d-4577-a056-763c6519ef13', client_id_var, 1, 12, 198, client_id_var),
            ('ae542d83-114d-4577-a056-763c6519ef13', client_id_var, 2, 11, 71, client_id_var),
            ('ae542d83-114d-4577-a056-763c6519ef13', client_id_var, 3, 8, 224, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('45567ebb-52cb-435a-abdb-45953b3bfa43', session_id_var, exercise_id_var, 2, 3, 10, 68);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('45567ebb-52cb-435a-abdb-45953b3bfa43', client_id_var, 1, 9, 200, client_id_var),
            ('45567ebb-52cb-435a-abdb-45953b3bfa43', client_id_var, 2, 11, 155, client_id_var),
            ('45567ebb-52cb-435a-abdb-45953b3bfa43', client_id_var, 3, 9, 236, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('9631b7ae-0053-45e7-b415-d903e3d8d6a4', session_id_var, exercise_id_var, 3, 3, 10, 56);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('9631b7ae-0053-45e7-b415-d903e3d8d6a4', client_id_var, 1, 12, 145, client_id_var),
            ('9631b7ae-0053-45e7-b415-d903e3d8d6a4', client_id_var, 2, 9, 172, client_id_var),
            ('9631b7ae-0053-45e7-b415-d903e3d8d6a4', client_id_var, 3, 11, 132, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('64f18045-3222-427d-bae8-72f9fed1cafd', session_id_var, exercise_id_var, 4, 3, 10, 96);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('64f18045-3222-427d-bae8-72f9fed1cafd', client_id_var, 1, 8, 223, client_id_var),
            ('64f18045-3222-427d-bae8-72f9fed1cafd', client_id_var, 2, 12, 180, client_id_var),
            ('64f18045-3222-427d-bae8-72f9fed1cafd', client_id_var, 3, 9, 150, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('3efe5736-36f1-4f60-8759-5598866b1f7f', session_id_var, exercise_id_var, 5, 3, 10, 171);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('3efe5736-36f1-4f60-8759-5598866b1f7f', client_id_var, 1, 12, 51, client_id_var),
            ('3efe5736-36f1-4f60-8759-5598866b1f7f', client_id_var, 2, 8, 113, client_id_var),
            ('3efe5736-36f1-4f60-8759-5598866b1f7f', client_id_var, 3, 8, 133, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'bd871349-eaf4-4ba6-bb35-2fa6dc5769f7';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-08', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('8b1abf37-9a82-4c54-aff2-a5b877ba68ec', session_id_var, exercise_id_var, 1, 3, 10, 97);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('8b1abf37-9a82-4c54-aff2-a5b877ba68ec', client_id_var, 1, 12, 77, client_id_var),
            ('8b1abf37-9a82-4c54-aff2-a5b877ba68ec', client_id_var, 2, 9, 86, client_id_var),
            ('8b1abf37-9a82-4c54-aff2-a5b877ba68ec', client_id_var, 3, 8, 120, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('7d8856cd-549b-468e-8af8-a712eb7694cc', session_id_var, exercise_id_var, 2, 3, 10, 202);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('7d8856cd-549b-468e-8af8-a712eb7694cc', client_id_var, 1, 8, 133, client_id_var),
            ('7d8856cd-549b-468e-8af8-a712eb7694cc', client_id_var, 2, 12, 77, client_id_var),
            ('7d8856cd-549b-468e-8af8-a712eb7694cc', client_id_var, 3, 9, 60, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('8bfba091-c7f4-4a58-b0ff-e1e499e5df34', session_id_var, exercise_id_var, 3, 3, 10, 69);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('8bfba091-c7f4-4a58-b0ff-e1e499e5df34', client_id_var, 1, 11, 133, client_id_var),
            ('8bfba091-c7f4-4a58-b0ff-e1e499e5df34', client_id_var, 2, 12, 96, client_id_var),
            ('8bfba091-c7f4-4a58-b0ff-e1e499e5df34', client_id_var, 3, 8, 173, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('1c5cb92c-2bb7-420c-838c-1a2dfa07ca37', session_id_var, exercise_id_var, 4, 3, 10, 122);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('1c5cb92c-2bb7-420c-838c-1a2dfa07ca37', client_id_var, 1, 11, 108, client_id_var),
            ('1c5cb92c-2bb7-420c-838c-1a2dfa07ca37', client_id_var, 2, 11, 61, client_id_var),
            ('1c5cb92c-2bb7-420c-838c-1a2dfa07ca37', client_id_var, 3, 12, 195, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('6b86629f-011f-4538-80d6-4392950e0d9c', session_id_var, exercise_id_var, 5, 3, 10, 200);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('6b86629f-011f-4538-80d6-4392950e0d9c', client_id_var, 1, 9, 218, client_id_var),
            ('6b86629f-011f-4538-80d6-4392950e0d9c', client_id_var, 2, 9, 209, client_id_var),
            ('6b86629f-011f-4538-80d6-4392950e0d9c', client_id_var, 3, 8, 81, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'de485c70-f563-437c-94a1-58b92b967131';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-03-07', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '6460f145-8184-4343-b92f-05093d41447b';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-10', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('0dd02dfc-2f81-4bb0-b45f-2223f237fa3f', session_id_var, exercise_id_var, 1, 3, 10, 211);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('0dd02dfc-2f81-4bb0-b45f-2223f237fa3f', client_id_var, 1, 9, 56, client_id_var),
            ('0dd02dfc-2f81-4bb0-b45f-2223f237fa3f', client_id_var, 2, 10, 110, client_id_var),
            ('0dd02dfc-2f81-4bb0-b45f-2223f237fa3f', client_id_var, 3, 10, 206, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('9670d008-5267-4b4b-ab52-fd51309f0800', session_id_var, exercise_id_var, 2, 3, 10, 74);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('9670d008-5267-4b4b-ab52-fd51309f0800', client_id_var, 1, 11, 94, client_id_var),
            ('9670d008-5267-4b4b-ab52-fd51309f0800', client_id_var, 2, 9, 66, client_id_var),
            ('9670d008-5267-4b4b-ab52-fd51309f0800', client_id_var, 3, 12, 239, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('198d199c-f9f1-4aa6-a164-81a0dc24be18', session_id_var, exercise_id_var, 3, 3, 10, 139);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('198d199c-f9f1-4aa6-a164-81a0dc24be18', client_id_var, 1, 11, 137, client_id_var),
            ('198d199c-f9f1-4aa6-a164-81a0dc24be18', client_id_var, 2, 9, 133, client_id_var),
            ('198d199c-f9f1-4aa6-a164-81a0dc24be18', client_id_var, 3, 8, 90, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('bb61c0b6-2eb9-4aa5-a70c-ba0608055e92', session_id_var, exercise_id_var, 4, 3, 10, 61);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('bb61c0b6-2eb9-4aa5-a70c-ba0608055e92', client_id_var, 1, 9, 120, client_id_var),
            ('bb61c0b6-2eb9-4aa5-a70c-ba0608055e92', client_id_var, 2, 11, 125, client_id_var),
            ('bb61c0b6-2eb9-4aa5-a70c-ba0608055e92', client_id_var, 3, 10, 243, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('46fd61a5-b9df-4ef6-975b-d8b76582d8eb', session_id_var, exercise_id_var, 5, 3, 10, 179);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('46fd61a5-b9df-4ef6-975b-d8b76582d8eb', client_id_var, 1, 10, 180, client_id_var),
            ('46fd61a5-b9df-4ef6-975b-d8b76582d8eb', client_id_var, 2, 12, 101, client_id_var),
            ('46fd61a5-b9df-4ef6-975b-d8b76582d8eb', client_id_var, 3, 11, 115, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'b6d6589c-fdc7-4ecc-b619-e06bcad47ff2';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-24', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'f45f5616-a49b-45c5-9188-7f0798326ad4';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-11-07', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('d03d9f0c-230c-4740-9edf-80d7f2a3fa82', session_id_var, exercise_id_var, 1, 3, 10, 58);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('d03d9f0c-230c-4740-9edf-80d7f2a3fa82', client_id_var, 1, 9, 201, client_id_var),
            ('d03d9f0c-230c-4740-9edf-80d7f2a3fa82', client_id_var, 2, 10, 180, client_id_var),
            ('d03d9f0c-230c-4740-9edf-80d7f2a3fa82', client_id_var, 3, 9, 137, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('f77a45b9-ab4a-444b-8dc2-5a0d75870e2a', session_id_var, exercise_id_var, 2, 3, 10, 184);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('f77a45b9-ab4a-444b-8dc2-5a0d75870e2a', client_id_var, 1, 9, 233, client_id_var),
            ('f77a45b9-ab4a-444b-8dc2-5a0d75870e2a', client_id_var, 2, 8, 81, client_id_var),
            ('f77a45b9-ab4a-444b-8dc2-5a0d75870e2a', client_id_var, 3, 12, 144, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('fa3653bd-32ee-44a9-a98c-ca1f437e7c79', session_id_var, exercise_id_var, 3, 3, 10, 190);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('fa3653bd-32ee-44a9-a98c-ca1f437e7c79', client_id_var, 1, 10, 125, client_id_var),
            ('fa3653bd-32ee-44a9-a98c-ca1f437e7c79', client_id_var, 2, 9, 122, client_id_var),
            ('fa3653bd-32ee-44a9-a98c-ca1f437e7c79', client_id_var, 3, 8, 244, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('358d33ee-1659-4221-a2db-7b15ad62040a', session_id_var, exercise_id_var, 4, 3, 10, 133);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('358d33ee-1659-4221-a2db-7b15ad62040a', client_id_var, 1, 11, 183, client_id_var),
            ('358d33ee-1659-4221-a2db-7b15ad62040a', client_id_var, 2, 9, 243, client_id_var),
            ('358d33ee-1659-4221-a2db-7b15ad62040a', client_id_var, 3, 8, 213, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('8631ec17-407b-4d84-bed4-cf60e9fa53d7', session_id_var, exercise_id_var, 5, 3, 10, 211);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('8631ec17-407b-4d84-bed4-cf60e9fa53d7', client_id_var, 1, 10, 114, client_id_var),
            ('8631ec17-407b-4d84-bed4-cf60e9fa53d7', client_id_var, 2, 11, 135, client_id_var),
            ('8631ec17-407b-4d84-bed4-cf60e9fa53d7', client_id_var, 3, 10, 134, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '4494ff38-fc0b-4334-972b-49dd23d2abee';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-11-13', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('3e9bc617-b3ed-4aef-a5c7-9fd63284deb8', session_id_var, exercise_id_var, 1, 3, 10, 145);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('3e9bc617-b3ed-4aef-a5c7-9fd63284deb8', client_id_var, 1, 11, 152, client_id_var),
            ('3e9bc617-b3ed-4aef-a5c7-9fd63284deb8', client_id_var, 2, 8, 118, client_id_var),
            ('3e9bc617-b3ed-4aef-a5c7-9fd63284deb8', client_id_var, 3, 11, 156, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('883e4df6-0f5c-462e-8eba-d98da1f962a2', session_id_var, exercise_id_var, 2, 3, 10, 189);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('883e4df6-0f5c-462e-8eba-d98da1f962a2', client_id_var, 1, 12, 228, client_id_var),
            ('883e4df6-0f5c-462e-8eba-d98da1f962a2', client_id_var, 2, 12, 88, client_id_var),
            ('883e4df6-0f5c-462e-8eba-d98da1f962a2', client_id_var, 3, 9, 239, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('1c6cf975-71b0-4d3d-b022-dec57d8f28f1', session_id_var, exercise_id_var, 3, 3, 10, 228);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('1c6cf975-71b0-4d3d-b022-dec57d8f28f1', client_id_var, 1, 9, 104, client_id_var),
            ('1c6cf975-71b0-4d3d-b022-dec57d8f28f1', client_id_var, 2, 8, 121, client_id_var),
            ('1c6cf975-71b0-4d3d-b022-dec57d8f28f1', client_id_var, 3, 9, 164, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('8dce983e-d974-4415-bd90-b807d5415bec', session_id_var, exercise_id_var, 4, 3, 10, 181);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('8dce983e-d974-4415-bd90-b807d5415bec', client_id_var, 1, 10, 140, client_id_var),
            ('8dce983e-d974-4415-bd90-b807d5415bec', client_id_var, 2, 10, 80, client_id_var),
            ('8dce983e-d974-4415-bd90-b807d5415bec', client_id_var, 3, 9, 235, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('5afa4716-0e5e-4b5a-9756-6e60f8dbaa4e', session_id_var, exercise_id_var, 5, 3, 10, 91);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('5afa4716-0e5e-4b5a-9756-6e60f8dbaa4e', client_id_var, 1, 10, 202, client_id_var),
            ('5afa4716-0e5e-4b5a-9756-6e60f8dbaa4e', client_id_var, 2, 11, 107, client_id_var),
            ('5afa4716-0e5e-4b5a-9756-6e60f8dbaa4e', client_id_var, 3, 12, 133, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '73d1b695-52dc-4f55-9f49-d49656956619';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-24', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '552dff05-865c-4472-8326-aafcc08490cc';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-18', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('461c0367-d3a4-478c-b576-437d4b1ae099', session_id_var, exercise_id_var, 1, 3, 10, 83);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('461c0367-d3a4-478c-b576-437d4b1ae099', client_id_var, 1, 12, 71, client_id_var),
            ('461c0367-d3a4-478c-b576-437d4b1ae099', client_id_var, 2, 11, 91, client_id_var),
            ('461c0367-d3a4-478c-b576-437d4b1ae099', client_id_var, 3, 9, 96, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('2d61f5c8-752e-4f7b-a95a-5d921d2d8867', session_id_var, exercise_id_var, 2, 3, 10, 82);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('2d61f5c8-752e-4f7b-a95a-5d921d2d8867', client_id_var, 1, 11, 160, client_id_var),
            ('2d61f5c8-752e-4f7b-a95a-5d921d2d8867', client_id_var, 2, 11, 77, client_id_var),
            ('2d61f5c8-752e-4f7b-a95a-5d921d2d8867', client_id_var, 3, 9, 197, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('36fb01dd-f322-4bd6-a838-547495d0d07c', session_id_var, exercise_id_var, 3, 3, 10, 104);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('36fb01dd-f322-4bd6-a838-547495d0d07c', client_id_var, 1, 8, 54, client_id_var),
            ('36fb01dd-f322-4bd6-a838-547495d0d07c', client_id_var, 2, 8, 171, client_id_var),
            ('36fb01dd-f322-4bd6-a838-547495d0d07c', client_id_var, 3, 12, 172, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('5889b356-43f6-4e6f-835c-8a3b70e312ff', session_id_var, exercise_id_var, 4, 3, 10, 92);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('5889b356-43f6-4e6f-835c-8a3b70e312ff', client_id_var, 1, 10, 70, client_id_var),
            ('5889b356-43f6-4e6f-835c-8a3b70e312ff', client_id_var, 2, 11, 141, client_id_var),
            ('5889b356-43f6-4e6f-835c-8a3b70e312ff', client_id_var, 3, 9, 92, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('27c5940c-38ee-4c15-873f-9ff142d4a138', session_id_var, exercise_id_var, 5, 3, 10, 149);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('27c5940c-38ee-4c15-873f-9ff142d4a138', client_id_var, 1, 12, 241, client_id_var),
            ('27c5940c-38ee-4c15-873f-9ff142d4a138', client_id_var, 2, 9, 90, client_id_var),
            ('27c5940c-38ee-4c15-873f-9ff142d4a138', client_id_var, 3, 9, 104, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'dc8635d9-0865-4908-a1f2-868efff44c93';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'joey.tribbiani3@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-15', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna

-- Data for client: Chandler Bing


-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '0826f1a2-d6f4-4765-947e-1f3d5febeced';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-07', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('75f3a27c-8d30-410d-9382-55c1a18d9870', session_id_var, exercise_id_var, 1, 3, 10, 107);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('75f3a27c-8d30-410d-9382-55c1a18d9870', client_id_var, 1, 11, 71, client_id_var),
            ('75f3a27c-8d30-410d-9382-55c1a18d9870', client_id_var, 2, 10, 151, client_id_var),
            ('75f3a27c-8d30-410d-9382-55c1a18d9870', client_id_var, 3, 8, 165, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('fa4158ec-f705-43fc-bb3d-7ed913f8aec6', session_id_var, exercise_id_var, 2, 3, 10, 155);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('fa4158ec-f705-43fc-bb3d-7ed913f8aec6', client_id_var, 1, 9, 108, client_id_var),
            ('fa4158ec-f705-43fc-bb3d-7ed913f8aec6', client_id_var, 2, 12, 89, client_id_var),
            ('fa4158ec-f705-43fc-bb3d-7ed913f8aec6', client_id_var, 3, 11, 86, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('5d026be6-cfea-4a66-9935-d975e472a711', session_id_var, exercise_id_var, 3, 3, 10, 198);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('5d026be6-cfea-4a66-9935-d975e472a711', client_id_var, 1, 9, 227, client_id_var),
            ('5d026be6-cfea-4a66-9935-d975e472a711', client_id_var, 2, 10, 122, client_id_var),
            ('5d026be6-cfea-4a66-9935-d975e472a711', client_id_var, 3, 12, 201, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('0243aed7-c069-4354-92bd-79c07b1d1e57', session_id_var, exercise_id_var, 4, 3, 10, 153);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('0243aed7-c069-4354-92bd-79c07b1d1e57', client_id_var, 1, 12, 97, client_id_var),
            ('0243aed7-c069-4354-92bd-79c07b1d1e57', client_id_var, 2, 8, 161, client_id_var),
            ('0243aed7-c069-4354-92bd-79c07b1d1e57', client_id_var, 3, 8, 153, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('5bfdce8e-44a9-4f24-8ddf-3e7ed913a12c', session_id_var, exercise_id_var, 5, 3, 10, 70);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('5bfdce8e-44a9-4f24-8ddf-3e7ed913a12c', client_id_var, 1, 8, 208, client_id_var),
            ('5bfdce8e-44a9-4f24-8ddf-3e7ed913a12c', client_id_var, 2, 11, 69, client_id_var),
            ('5bfdce8e-44a9-4f24-8ddf-3e7ed913a12c', client_id_var, 3, 11, 146, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'ec1b9e96-9130-4d47-8e68-455256afca93';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-31', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'c81736b7-2641-48ea-9f13-cd09b6470549';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-21', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '7eecb4b7-fa17-44be-984f-41bbf7f48be5';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-09', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '2d7cf66a-7306-4555-9fde-0a4a2cacbdfe';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-29', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('cca572f3-bc24-4a24-8b77-4ff02f70c80d', session_id_var, exercise_id_var, 1, 3, 10, 103);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('cca572f3-bc24-4a24-8b77-4ff02f70c80d', client_id_var, 1, 12, 122, client_id_var),
            ('cca572f3-bc24-4a24-8b77-4ff02f70c80d', client_id_var, 2, 9, 192, client_id_var),
            ('cca572f3-bc24-4a24-8b77-4ff02f70c80d', client_id_var, 3, 10, 154, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('ee012a86-778b-40d7-b5f2-73002ed80890', session_id_var, exercise_id_var, 2, 3, 10, 104);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('ee012a86-778b-40d7-b5f2-73002ed80890', client_id_var, 1, 11, 57, client_id_var),
            ('ee012a86-778b-40d7-b5f2-73002ed80890', client_id_var, 2, 12, 73, client_id_var),
            ('ee012a86-778b-40d7-b5f2-73002ed80890', client_id_var, 3, 11, 135, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('09935e85-bbc4-4ea0-a456-3fb9cdb48909', session_id_var, exercise_id_var, 3, 3, 10, 175);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('09935e85-bbc4-4ea0-a456-3fb9cdb48909', client_id_var, 1, 10, 210, client_id_var),
            ('09935e85-bbc4-4ea0-a456-3fb9cdb48909', client_id_var, 2, 9, 122, client_id_var),
            ('09935e85-bbc4-4ea0-a456-3fb9cdb48909', client_id_var, 3, 9, 58, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('4fb83c77-270f-4497-a04f-c7e9ea1256a5', session_id_var, exercise_id_var, 4, 3, 10, 181);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('4fb83c77-270f-4497-a04f-c7e9ea1256a5', client_id_var, 1, 10, 227, client_id_var),
            ('4fb83c77-270f-4497-a04f-c7e9ea1256a5', client_id_var, 2, 9, 118, client_id_var),
            ('4fb83c77-270f-4497-a04f-c7e9ea1256a5', client_id_var, 3, 12, 174, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('a0d9f1de-21c7-44a0-b117-d3bae6b8dd66', session_id_var, exercise_id_var, 5, 3, 10, 143);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('a0d9f1de-21c7-44a0-b117-d3bae6b8dd66', client_id_var, 1, 8, 80, client_id_var),
            ('a0d9f1de-21c7-44a0-b117-d3bae6b8dd66', client_id_var, 2, 12, 132, client_id_var),
            ('a0d9f1de-21c7-44a0-b117-d3bae6b8dd66', client_id_var, 3, 11, 99, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '6f05c24b-8435-4255-bbcc-c2e63d2b046e';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-15', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'a84d41bb-0702-41a0-8f08-e619d98d20ec';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-11-11', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '4fa2b2a6-141e-4553-bd8d-f4cf81eca8d0';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-08', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '824fd405-add3-4d66-8646-439d86ef74a3';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-02-06', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '8503a9ac-fb6a-4937-ae0c-87d7d98750e4';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-16', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('f5635c01-6148-41d9-9cfe-4235a366741d', session_id_var, exercise_id_var, 1, 3, 10, 136);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('f5635c01-6148-41d9-9cfe-4235a366741d', client_id_var, 1, 11, 91, client_id_var),
            ('f5635c01-6148-41d9-9cfe-4235a366741d', client_id_var, 2, 10, 58, client_id_var),
            ('f5635c01-6148-41d9-9cfe-4235a366741d', client_id_var, 3, 11, 84, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('e383e9c5-3c36-4688-8ec8-4f15547e4272', session_id_var, exercise_id_var, 2, 3, 10, 76);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('e383e9c5-3c36-4688-8ec8-4f15547e4272', client_id_var, 1, 9, 177, client_id_var),
            ('e383e9c5-3c36-4688-8ec8-4f15547e4272', client_id_var, 2, 9, 122, client_id_var),
            ('e383e9c5-3c36-4688-8ec8-4f15547e4272', client_id_var, 3, 10, 70, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('8ae79917-d430-4b29-8789-d3c1f6b6dc2e', session_id_var, exercise_id_var, 3, 3, 10, 116);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('8ae79917-d430-4b29-8789-d3c1f6b6dc2e', client_id_var, 1, 11, 214, client_id_var),
            ('8ae79917-d430-4b29-8789-d3c1f6b6dc2e', client_id_var, 2, 11, 79, client_id_var),
            ('8ae79917-d430-4b29-8789-d3c1f6b6dc2e', client_id_var, 3, 8, 239, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('e4a10564-e233-43fd-9d6a-066110617223', session_id_var, exercise_id_var, 4, 3, 10, 159);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('e4a10564-e233-43fd-9d6a-066110617223', client_id_var, 1, 11, 54, client_id_var),
            ('e4a10564-e233-43fd-9d6a-066110617223', client_id_var, 2, 8, 54, client_id_var),
            ('e4a10564-e233-43fd-9d6a-066110617223', client_id_var, 3, 10, 195, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('b557875c-0dfa-41e5-8201-54ad4b638977', session_id_var, exercise_id_var, 5, 3, 10, 91);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('b557875c-0dfa-41e5-8201-54ad4b638977', client_id_var, 1, 11, 182, client_id_var),
            ('b557875c-0dfa-41e5-8201-54ad4b638977', client_id_var, 2, 10, 89, client_id_var),
            ('b557875c-0dfa-41e5-8201-54ad4b638977', client_id_var, 3, 11, 95, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'ec5ae43f-09ad-414d-97c4-f092c00668f5';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '82d2b84b-7186-4783-b804-2fb08c256747';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-11-03', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('def1268b-08c1-4cad-91a0-beed20809836', session_id_var, exercise_id_var, 1, 3, 10, 136);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('def1268b-08c1-4cad-91a0-beed20809836', client_id_var, 1, 11, 94, client_id_var),
            ('def1268b-08c1-4cad-91a0-beed20809836', client_id_var, 2, 9, 58, client_id_var),
            ('def1268b-08c1-4cad-91a0-beed20809836', client_id_var, 3, 10, 78, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('36e63838-4b74-4f9f-959d-d28b261b7ced', session_id_var, exercise_id_var, 2, 3, 10, 102);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('36e63838-4b74-4f9f-959d-d28b261b7ced', client_id_var, 1, 11, 51, client_id_var),
            ('36e63838-4b74-4f9f-959d-d28b261b7ced', client_id_var, 2, 10, 88, client_id_var),
            ('36e63838-4b74-4f9f-959d-d28b261b7ced', client_id_var, 3, 11, 117, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('2b4a153d-a575-4cd5-aa60-6f87f83cd2da', session_id_var, exercise_id_var, 3, 3, 10, 219);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('2b4a153d-a575-4cd5-aa60-6f87f83cd2da', client_id_var, 1, 11, 74, client_id_var),
            ('2b4a153d-a575-4cd5-aa60-6f87f83cd2da', client_id_var, 2, 10, 221, client_id_var),
            ('2b4a153d-a575-4cd5-aa60-6f87f83cd2da', client_id_var, 3, 10, 74, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('530c0cc5-50eb-4856-85d9-0f5b85be31de', session_id_var, exercise_id_var, 4, 3, 10, 247);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('530c0cc5-50eb-4856-85d9-0f5b85be31de', client_id_var, 1, 12, 188, client_id_var),
            ('530c0cc5-50eb-4856-85d9-0f5b85be31de', client_id_var, 2, 12, 216, client_id_var),
            ('530c0cc5-50eb-4856-85d9-0f5b85be31de', client_id_var, 3, 9, 129, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('467aaf59-d0ba-4bc5-9b47-ed92b1b35397', session_id_var, exercise_id_var, 5, 3, 10, 212);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('467aaf59-d0ba-4bc5-9b47-ed92b1b35397', client_id_var, 1, 8, 173, client_id_var),
            ('467aaf59-d0ba-4bc5-9b47-ed92b1b35397', client_id_var, 2, 12, 72, client_id_var),
            ('467aaf59-d0ba-4bc5-9b47-ed92b1b35397', client_id_var, 3, 9, 199, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '21c1624e-494d-4845-bbc2-e375a5d26d1b';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '570d0616-5ca9-4073-a59b-f6fa17478236';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-07', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'b042e17e-0b27-4265-8fae-cd920d75e6d0';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'chandler.bing4@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-04', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna

-- Data for client: Ross Geller


-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '29b2922a-faa7-4a05-ad44-2650832ea22d';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-24', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'd5072bdc-c5d7-4f29-9d28-63eb3c5db863';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-18', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '2e3c2878-85e1-481c-a478-893a8ff808ba';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-28', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'a2d14c37-9987-483a-bd43-29208d2af223';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-12', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'd894ed39-263a-4579-bbc0-9b25774975e9';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-11', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '2df04c9f-7e30-43ef-bced-1c1074a0491d';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('54cc2706-38d9-40f9-8ced-5757db85a61e', session_id_var, exercise_id_var, 1, 3, 10, 124);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('54cc2706-38d9-40f9-8ced-5757db85a61e', client_id_var, 1, 11, 97, client_id_var),
            ('54cc2706-38d9-40f9-8ced-5757db85a61e', client_id_var, 2, 8, 81, client_id_var),
            ('54cc2706-38d9-40f9-8ced-5757db85a61e', client_id_var, 3, 8, 196, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('121910ca-563a-4297-9c41-ba1e26eec4c9', session_id_var, exercise_id_var, 2, 3, 10, 50);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('121910ca-563a-4297-9c41-ba1e26eec4c9', client_id_var, 1, 12, 64, client_id_var),
            ('121910ca-563a-4297-9c41-ba1e26eec4c9', client_id_var, 2, 8, 210, client_id_var),
            ('121910ca-563a-4297-9c41-ba1e26eec4c9', client_id_var, 3, 10, 155, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('b5db4621-a7a7-4bf2-bf65-212c5d1a7293', session_id_var, exercise_id_var, 3, 3, 10, 235);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('b5db4621-a7a7-4bf2-bf65-212c5d1a7293', client_id_var, 1, 9, 177, client_id_var),
            ('b5db4621-a7a7-4bf2-bf65-212c5d1a7293', client_id_var, 2, 10, 147, client_id_var),
            ('b5db4621-a7a7-4bf2-bf65-212c5d1a7293', client_id_var, 3, 9, 127, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('ea356ac1-dd8c-4ef2-8f0c-fb8b0548890a', session_id_var, exercise_id_var, 4, 3, 10, 248);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('ea356ac1-dd8c-4ef2-8f0c-fb8b0548890a', client_id_var, 1, 8, 164, client_id_var),
            ('ea356ac1-dd8c-4ef2-8f0c-fb8b0548890a', client_id_var, 2, 8, 216, client_id_var),
            ('ea356ac1-dd8c-4ef2-8f0c-fb8b0548890a', client_id_var, 3, 8, 131, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('001cedb1-a9bf-4432-91a5-4fcf78313e65', session_id_var, exercise_id_var, 5, 3, 10, 176);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('001cedb1-a9bf-4432-91a5-4fcf78313e65', client_id_var, 1, 10, 141, client_id_var),
            ('001cedb1-a9bf-4432-91a5-4fcf78313e65', client_id_var, 2, 9, 234, client_id_var),
            ('001cedb1-a9bf-4432-91a5-4fcf78313e65', client_id_var, 3, 11, 148, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'e1f104fd-c495-4397-9df0-8f7a68e15a1d';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '9e55979e-2046-4693-af02-8dba6696af9c';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-01', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'ef0bbb08-1877-40e6-8e10-76104d2b9a3a';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-21', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '68d47ae8-fc32-4609-bee3-9ee0fcffb5b3';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-10', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'c77f5235-2f08-48f1-b4f9-fadf835be678';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-08', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'e7c7789a-7cc6-471d-9cc4-c95b55241a72';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '56b5c035-634f-438b-8602-60258fca2380';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-08', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'e8b1d587-2f2f-4fde-9d86-c551070083d0';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-18', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('a7f9bdb5-5fbb-4804-8c6e-dea26a892cba', session_id_var, exercise_id_var, 1, 3, 10, 220);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('a7f9bdb5-5fbb-4804-8c6e-dea26a892cba', client_id_var, 1, 10, 206, client_id_var),
            ('a7f9bdb5-5fbb-4804-8c6e-dea26a892cba', client_id_var, 2, 10, 196, client_id_var),
            ('a7f9bdb5-5fbb-4804-8c6e-dea26a892cba', client_id_var, 3, 10, 117, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('47d983c2-a4a6-419a-9893-164146e5d992', session_id_var, exercise_id_var, 2, 3, 10, 181);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('47d983c2-a4a6-419a-9893-164146e5d992', client_id_var, 1, 8, 72, client_id_var),
            ('47d983c2-a4a6-419a-9893-164146e5d992', client_id_var, 2, 12, 158, client_id_var),
            ('47d983c2-a4a6-419a-9893-164146e5d992', client_id_var, 3, 8, 240, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('6d641e01-6353-446e-a572-edc26e57b7e6', session_id_var, exercise_id_var, 3, 3, 10, 82);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('6d641e01-6353-446e-a572-edc26e57b7e6', client_id_var, 1, 11, 116, client_id_var),
            ('6d641e01-6353-446e-a572-edc26e57b7e6', client_id_var, 2, 11, 155, client_id_var),
            ('6d641e01-6353-446e-a572-edc26e57b7e6', client_id_var, 3, 10, 240, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('78649ee6-9155-4468-97ed-ad208af89d76', session_id_var, exercise_id_var, 4, 3, 10, 158);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('78649ee6-9155-4468-97ed-ad208af89d76', client_id_var, 1, 9, 64, client_id_var),
            ('78649ee6-9155-4468-97ed-ad208af89d76', client_id_var, 2, 9, 55, client_id_var),
            ('78649ee6-9155-4468-97ed-ad208af89d76', client_id_var, 3, 11, 235, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('5e0dbb54-a4e9-480e-b407-5139a535f595', session_id_var, exercise_id_var, 5, 3, 10, 66);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('5e0dbb54-a4e9-480e-b407-5139a535f595', client_id_var, 1, 9, 143, client_id_var),
            ('5e0dbb54-a4e9-480e-b407-5139a535f595', client_id_var, 2, 8, 211, client_id_var),
            ('5e0dbb54-a4e9-480e-b407-5139a535f595', client_id_var, 3, 11, 176, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'cee97c5e-9629-4bdb-980a-599a99c3764f';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'ross.geller5@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-03', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee

-- Data for client: Taylor Paul


-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '736a6907-0e47-479d-9c18-0f048f682f02';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-25', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'c5b08465-b5bc-4b8b-8698-1c76addf8849';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-10', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '10606109-acc2-43d5-849c-8a8dd3454eb2';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-03-08', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '4484fe6f-1628-4496-be7c-23abadce7262';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-02-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '9137bb54-f2f1-4cee-834c-77399a992aed';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-03', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'dcbd6e7e-484d-41b5-873f-2c64ed69c15b';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-11', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('2bc86361-ff6a-40b7-a464-50ad84acff31', session_id_var, exercise_id_var, 1, 3, 10, 230);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('2bc86361-ff6a-40b7-a464-50ad84acff31', client_id_var, 1, 10, 182, client_id_var),
            ('2bc86361-ff6a-40b7-a464-50ad84acff31', client_id_var, 2, 11, 205, client_id_var),
            ('2bc86361-ff6a-40b7-a464-50ad84acff31', client_id_var, 3, 11, 167, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('75dc617f-c1e8-4e5b-a144-27faf54f9647', session_id_var, exercise_id_var, 2, 3, 10, 77);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('75dc617f-c1e8-4e5b-a144-27faf54f9647', client_id_var, 1, 11, 244, client_id_var),
            ('75dc617f-c1e8-4e5b-a144-27faf54f9647', client_id_var, 2, 11, 201, client_id_var),
            ('75dc617f-c1e8-4e5b-a144-27faf54f9647', client_id_var, 3, 10, 250, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('8c7bdf17-fe76-4f0e-bcb1-e3d4619ae761', session_id_var, exercise_id_var, 3, 3, 10, 230);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('8c7bdf17-fe76-4f0e-bcb1-e3d4619ae761', client_id_var, 1, 9, 192, client_id_var),
            ('8c7bdf17-fe76-4f0e-bcb1-e3d4619ae761', client_id_var, 2, 8, 123, client_id_var),
            ('8c7bdf17-fe76-4f0e-bcb1-e3d4619ae761', client_id_var, 3, 11, 109, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('e2e281f0-1208-4808-8a38-46ac8f6699ff', session_id_var, exercise_id_var, 4, 3, 10, 242);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('e2e281f0-1208-4808-8a38-46ac8f6699ff', client_id_var, 1, 12, 133, client_id_var),
            ('e2e281f0-1208-4808-8a38-46ac8f6699ff', client_id_var, 2, 12, 193, client_id_var),
            ('e2e281f0-1208-4808-8a38-46ac8f6699ff', client_id_var, 3, 11, 120, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('f05cf3e7-2bf6-4678-ba7b-e0600f60b640', session_id_var, exercise_id_var, 5, 3, 10, 174);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('f05cf3e7-2bf6-4678-ba7b-e0600f60b640', client_id_var, 1, 9, 219, client_id_var),
            ('f05cf3e7-2bf6-4678-ba7b-e0600f60b640', client_id_var, 2, 12, 187, client_id_var),
            ('f05cf3e7-2bf6-4678-ba7b-e0600f60b640', client_id_var, 3, 11, 200, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '2fec97e7-7d5a-4714-b2f4-a3afec931830';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-17', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'eb22e7e0-1358-41cf-867a-36bc8f6fe0bb';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '95949dfc-35d4-400f-8e62-dfb362b25294';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-03', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '97f56179-d5f4-4b27-ba2e-856cfdd5ea68';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-16', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'ee00fedb-4ae8-49fb-bfb3-3e254134fe73';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-20', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'fd844cf9-4f7b-4f18-84fe-13f9c121812d';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-04', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'b694695e-9e8b-4b9d-9067-b7a3cb7aef81';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-12', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'c61595f6-fb19-442b-b819-1979cf6518b7';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-03-02', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'f1b68d83-5f96-435f-a7f4-a8c659167cf8';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'taylor.paul6@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-11', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('74634fe8-b8e0-4eee-ae61-9f847b27f2f6', session_id_var, exercise_id_var, 1, 3, 10, 174);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('74634fe8-b8e0-4eee-ae61-9f847b27f2f6', client_id_var, 1, 11, 240, client_id_var),
            ('74634fe8-b8e0-4eee-ae61-9f847b27f2f6', client_id_var, 2, 10, 182, client_id_var),
            ('74634fe8-b8e0-4eee-ae61-9f847b27f2f6', client_id_var, 3, 9, 232, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('4aada4c4-2022-4370-a4d0-465aff726181', session_id_var, exercise_id_var, 2, 3, 10, 150);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('4aada4c4-2022-4370-a4d0-465aff726181', client_id_var, 1, 12, 85, client_id_var),
            ('4aada4c4-2022-4370-a4d0-465aff726181', client_id_var, 2, 9, 149, client_id_var),
            ('4aada4c4-2022-4370-a4d0-465aff726181', client_id_var, 3, 11, 189, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('80ce80ea-d1b0-46c8-8af8-8f7526090ef9', session_id_var, exercise_id_var, 3, 3, 10, 60);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('80ce80ea-d1b0-46c8-8af8-8f7526090ef9', client_id_var, 1, 11, 196, client_id_var),
            ('80ce80ea-d1b0-46c8-8af8-8f7526090ef9', client_id_var, 2, 11, 115, client_id_var),
            ('80ce80ea-d1b0-46c8-8af8-8f7526090ef9', client_id_var, 3, 11, 184, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('9954aba0-a3bf-4725-80d4-4c47b3c6a4e2', session_id_var, exercise_id_var, 4, 3, 10, 95);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('9954aba0-a3bf-4725-80d4-4c47b3c6a4e2', client_id_var, 1, 10, 54, client_id_var),
            ('9954aba0-a3bf-4725-80d4-4c47b3c6a4e2', client_id_var, 2, 10, 71, client_id_var),
            ('9954aba0-a3bf-4725-80d4-4c47b3c6a4e2', client_id_var, 3, 12, 157, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('cbd161d0-4d3e-4d06-bf1e-96aa816ff8ce', session_id_var, exercise_id_var, 5, 3, 10, 236);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('cbd161d0-4d3e-4d06-bf1e-96aa816ff8ce', client_id_var, 1, 12, 225, client_id_var),
            ('cbd161d0-4d3e-4d06-bf1e-96aa816ff8ce', client_id_var, 2, 11, 111, client_id_var),
            ('cbd161d0-4d3e-4d06-bf1e-96aa816ff8ce', client_id_var, 3, 11, 55, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa

-- Data for client: Demi Engemann


-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'aa7c80d5-5162-4220-8eaa-56fe1e082732';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-11-10', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '3451ae35-c080-43cb-a917-eb7cf855d32d';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-03', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '01b35854-116d-4401-8b6d-5c65f7559032';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-13', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'ff9d47c8-d834-4fdd-b86e-5410441b68c3';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-13', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '92027721-e397-41ed-8d8a-274d1852d153';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-12', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'bcb0cd4e-fcd7-4092-8cd5-d332b32be156';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-03-07', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '1237b19d-9e21-4cfd-aea3-faf9bcc86a4b';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'c549dca7-41cf-4d9d-ae31-c1f90e065700';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-30', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('a8e69a9b-f418-4485-a535-c925d64e2a0c', session_id_var, exercise_id_var, 1, 3, 10, 141);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('a8e69a9b-f418-4485-a535-c925d64e2a0c', client_id_var, 1, 10, 161, client_id_var),
            ('a8e69a9b-f418-4485-a535-c925d64e2a0c', client_id_var, 2, 11, 225, client_id_var),
            ('a8e69a9b-f418-4485-a535-c925d64e2a0c', client_id_var, 3, 9, 81, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('c9846e7d-20cf-42d4-86ca-227178e266af', session_id_var, exercise_id_var, 2, 3, 10, 88);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('c9846e7d-20cf-42d4-86ca-227178e266af', client_id_var, 1, 9, 243, client_id_var),
            ('c9846e7d-20cf-42d4-86ca-227178e266af', client_id_var, 2, 12, 160, client_id_var),
            ('c9846e7d-20cf-42d4-86ca-227178e266af', client_id_var, 3, 10, 243, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('f1977b9e-c2fc-4dff-8ee6-9b3c88b900b2', session_id_var, exercise_id_var, 3, 3, 10, 211);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('f1977b9e-c2fc-4dff-8ee6-9b3c88b900b2', client_id_var, 1, 12, 134, client_id_var),
            ('f1977b9e-c2fc-4dff-8ee6-9b3c88b900b2', client_id_var, 2, 11, 223, client_id_var),
            ('f1977b9e-c2fc-4dff-8ee6-9b3c88b900b2', client_id_var, 3, 12, 243, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('72cab084-8f9b-4b42-b56e-a25623eb890f', session_id_var, exercise_id_var, 4, 3, 10, 66);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('72cab084-8f9b-4b42-b56e-a25623eb890f', client_id_var, 1, 10, 185, client_id_var),
            ('72cab084-8f9b-4b42-b56e-a25623eb890f', client_id_var, 2, 10, 210, client_id_var),
            ('72cab084-8f9b-4b42-b56e-a25623eb890f', client_id_var, 3, 11, 77, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('ece658be-2b2b-41c1-a593-5984a1ea782c', session_id_var, exercise_id_var, 5, 3, 10, 193);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('ece658be-2b2b-41c1-a593-5984a1ea782c', client_id_var, 1, 9, 141, client_id_var),
            ('ece658be-2b2b-41c1-a593-5984a1ea782c', client_id_var, 2, 9, 103, client_id_var),
            ('ece658be-2b2b-41c1-a593-5984a1ea782c', client_id_var, 3, 12, 191, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '009208f2-9339-47e8-b023-d7696bd17b71';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-11-23', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '083915d6-ba38-4bde-8dbb-dcb275d5dd3c';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-01', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'f2afd2cb-e69c-4cac-8891-433221ac9a80';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-16', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'dffc3d9f-e26a-412b-afad-65f9d71da2e5';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-13', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '0ccd9573-1789-4f82-a1ef-03a93e724111';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-02-27', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'ba09ce05-d390-4ad5-b8ed-99016e89b9e6';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-02', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '515bed8c-7a4b-4e5f-8bc5-ecad734f10a7';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'demi.engemann7@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-28', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna

-- Data for client: Jen Affleck


-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'cd4bc0e8-668c-408b-be2c-b7a386b95230';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-13', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'aef26436-4a65-4dca-bce4-d6b0db0b6305';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-06', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '4e664dc3-ba65-4b38-bcc3-da78709b14dd';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-03', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '1207e6e8-3ed2-4290-b662-1584262e90c9';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-12', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'a4f83969-6455-46d0-b95e-19c0fe0bca21';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-21', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('b9c4c8c0-f6d9-4ce2-b476-f6301c005d1d', session_id_var, exercise_id_var, 1, 3, 10, 90);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('b9c4c8c0-f6d9-4ce2-b476-f6301c005d1d', client_id_var, 1, 10, 131, client_id_var),
            ('b9c4c8c0-f6d9-4ce2-b476-f6301c005d1d', client_id_var, 2, 11, 231, client_id_var),
            ('b9c4c8c0-f6d9-4ce2-b476-f6301c005d1d', client_id_var, 3, 12, 51, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('bbc3c93a-c2d2-48db-85a2-10b47aa2e94b', session_id_var, exercise_id_var, 2, 3, 10, 122);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('bbc3c93a-c2d2-48db-85a2-10b47aa2e94b', client_id_var, 1, 11, 157, client_id_var),
            ('bbc3c93a-c2d2-48db-85a2-10b47aa2e94b', client_id_var, 2, 12, 204, client_id_var),
            ('bbc3c93a-c2d2-48db-85a2-10b47aa2e94b', client_id_var, 3, 9, 186, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('f7488ae5-4d22-4606-ab02-7b1476b93333', session_id_var, exercise_id_var, 3, 3, 10, 229);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('f7488ae5-4d22-4606-ab02-7b1476b93333', client_id_var, 1, 9, 236, client_id_var),
            ('f7488ae5-4d22-4606-ab02-7b1476b93333', client_id_var, 2, 10, 180, client_id_var),
            ('f7488ae5-4d22-4606-ab02-7b1476b93333', client_id_var, 3, 8, 161, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('76468cc4-7a83-4228-94cb-e152891c4e88', session_id_var, exercise_id_var, 4, 3, 10, 160);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('76468cc4-7a83-4228-94cb-e152891c4e88', client_id_var, 1, 11, 74, client_id_var),
            ('76468cc4-7a83-4228-94cb-e152891c4e88', client_id_var, 2, 9, 191, client_id_var),
            ('76468cc4-7a83-4228-94cb-e152891c4e88', client_id_var, 3, 11, 215, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('94babc88-701b-48e3-b456-b3d86119f04f', session_id_var, exercise_id_var, 5, 3, 10, 187);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('94babc88-701b-48e3-b456-b3d86119f04f', client_id_var, 1, 12, 220, client_id_var),
            ('94babc88-701b-48e3-b456-b3d86119f04f', client_id_var, 2, 9, 55, client_id_var),
            ('94babc88-701b-48e3-b456-b3d86119f04f', client_id_var, 3, 8, 101, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '464b149b-a777-4e8c-b7f2-578679de86f4';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-05-18', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '78e7215c-b511-4e4b-93c6-c403d32c9d3d';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-04', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '10514da3-c520-4273-b3f4-c480c6624e82';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-14', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('f39dca01-21de-4434-85fa-180f48bcab74', session_id_var, exercise_id_var, 1, 3, 10, 215);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('f39dca01-21de-4434-85fa-180f48bcab74', client_id_var, 1, 11, 198, client_id_var),
            ('f39dca01-21de-4434-85fa-180f48bcab74', client_id_var, 2, 12, 161, client_id_var),
            ('f39dca01-21de-4434-85fa-180f48bcab74', client_id_var, 3, 11, 68, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('dc25b0d8-7b32-4608-9a44-564fea4c0dd1', session_id_var, exercise_id_var, 2, 3, 10, 127);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('dc25b0d8-7b32-4608-9a44-564fea4c0dd1', client_id_var, 1, 10, 67, client_id_var),
            ('dc25b0d8-7b32-4608-9a44-564fea4c0dd1', client_id_var, 2, 11, 158, client_id_var),
            ('dc25b0d8-7b32-4608-9a44-564fea4c0dd1', client_id_var, 3, 10, 159, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('6f1f57e3-569b-429c-bfe0-49c356dbc829', session_id_var, exercise_id_var, 3, 3, 10, 145);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('6f1f57e3-569b-429c-bfe0-49c356dbc829', client_id_var, 1, 12, 125, client_id_var),
            ('6f1f57e3-569b-429c-bfe0-49c356dbc829', client_id_var, 2, 12, 186, client_id_var),
            ('6f1f57e3-569b-429c-bfe0-49c356dbc829', client_id_var, 3, 8, 127, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('1832e591-0021-4dca-a45a-3f6a1080f8e0', session_id_var, exercise_id_var, 4, 3, 10, 83);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('1832e591-0021-4dca-a45a-3f6a1080f8e0', client_id_var, 1, 8, 165, client_id_var),
            ('1832e591-0021-4dca-a45a-3f6a1080f8e0', client_id_var, 2, 9, 221, client_id_var),
            ('1832e591-0021-4dca-a45a-3f6a1080f8e0', client_id_var, 3, 9, 161, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('ebc862fe-c995-4cb5-adb5-ce33fb6edd5e', session_id_var, exercise_id_var, 5, 3, 10, 172);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('ebc862fe-c995-4cb5-adb5-ce33fb6edd5e', client_id_var, 1, 12, 114, client_id_var),
            ('ebc862fe-c995-4cb5-adb5-ce33fb6edd5e', client_id_var, 2, 10, 159, client_id_var),
            ('ebc862fe-c995-4cb5-adb5-ce33fb6edd5e', client_id_var, 3, 8, 59, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '52fb76fd-51aa-4725-b3cf-78fdbc49f922';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-25', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('469ea9ce-50b4-417b-b978-65b161dce551', session_id_var, exercise_id_var, 1, 3, 10, 113);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('469ea9ce-50b4-417b-b978-65b161dce551', client_id_var, 1, 11, 87, client_id_var),
            ('469ea9ce-50b4-417b-b978-65b161dce551', client_id_var, 2, 8, 245, client_id_var),
            ('469ea9ce-50b4-417b-b978-65b161dce551', client_id_var, 3, 9, 201, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('54ddc62e-87bf-44be-9f48-6d2d255bc787', session_id_var, exercise_id_var, 2, 3, 10, 85);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('54ddc62e-87bf-44be-9f48-6d2d255bc787', client_id_var, 1, 12, 130, client_id_var),
            ('54ddc62e-87bf-44be-9f48-6d2d255bc787', client_id_var, 2, 9, 160, client_id_var),
            ('54ddc62e-87bf-44be-9f48-6d2d255bc787', client_id_var, 3, 11, 123, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('d19495f5-40d9-45c7-b7d9-e5273dc940d3', session_id_var, exercise_id_var, 3, 3, 10, 232);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('d19495f5-40d9-45c7-b7d9-e5273dc940d3', client_id_var, 1, 8, 224, client_id_var),
            ('d19495f5-40d9-45c7-b7d9-e5273dc940d3', client_id_var, 2, 11, 171, client_id_var),
            ('d19495f5-40d9-45c7-b7d9-e5273dc940d3', client_id_var, 3, 10, 158, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('d8392077-3807-4e8b-850e-81d6417b671e', session_id_var, exercise_id_var, 4, 3, 10, 140);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('d8392077-3807-4e8b-850e-81d6417b671e', client_id_var, 1, 10, 166, client_id_var),
            ('d8392077-3807-4e8b-850e-81d6417b671e', client_id_var, 2, 12, 95, client_id_var),
            ('d8392077-3807-4e8b-850e-81d6417b671e', client_id_var, 3, 9, 243, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('8247a8d7-6838-473a-98df-bc9bf19b1a64', session_id_var, exercise_id_var, 5, 3, 10, 145);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('8247a8d7-6838-473a-98df-bc9bf19b1a64', client_id_var, 1, 10, 201, client_id_var),
            ('8247a8d7-6838-473a-98df-bc9bf19b1a64', client_id_var, 2, 12, 205, client_id_var),
            ('8247a8d7-6838-473a-98df-bc9bf19b1a64', client_id_var, 3, 10, 86, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'f0ab6ab3-715a-4f41-86f4-d99383a66652';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-11', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('894d293a-a4d4-4432-a5b3-30bcd955f5b2', session_id_var, exercise_id_var, 1, 3, 10, 175);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('894d293a-a4d4-4432-a5b3-30bcd955f5b2', client_id_var, 1, 11, 210, client_id_var),
            ('894d293a-a4d4-4432-a5b3-30bcd955f5b2', client_id_var, 2, 10, 52, client_id_var),
            ('894d293a-a4d4-4432-a5b3-30bcd955f5b2', client_id_var, 3, 11, 144, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('9151ce83-0708-4aab-a6ce-cca4cbe00653', session_id_var, exercise_id_var, 2, 3, 10, 124);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('9151ce83-0708-4aab-a6ce-cca4cbe00653', client_id_var, 1, 12, 188, client_id_var),
            ('9151ce83-0708-4aab-a6ce-cca4cbe00653', client_id_var, 2, 10, 65, client_id_var),
            ('9151ce83-0708-4aab-a6ce-cca4cbe00653', client_id_var, 3, 11, 72, client_id_var);
    END $$;

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('75bf340d-50f7-4fc7-ad11-338ddec1b9fe', session_id_var, exercise_id_var, 3, 3, 10, 80);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('75bf340d-50f7-4fc7-ad11-338ddec1b9fe', client_id_var, 1, 8, 220, client_id_var),
            ('75bf340d-50f7-4fc7-ad11-338ddec1b9fe', client_id_var, 2, 8, 144, client_id_var),
            ('75bf340d-50f7-4fc7-ad11-338ddec1b9fe', client_id_var, 3, 9, 170, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('15cc5f31-d6a4-4549-85e2-0a16e8fc7a9c', session_id_var, exercise_id_var, 4, 3, 10, 70);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('15cc5f31-d6a4-4549-85e2-0a16e8fc7a9c', client_id_var, 1, 9, 149, client_id_var),
            ('15cc5f31-d6a4-4549-85e2-0a16e8fc7a9c', client_id_var, 2, 9, 242, client_id_var),
            ('15cc5f31-d6a4-4549-85e2-0a16e8fc7a9c', client_id_var, 3, 8, 122, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('77be6e4a-766f-4291-bfd3-93f20337634c', session_id_var, exercise_id_var, 5, 3, 10, 65);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('77be6e4a-766f-4291-bfd3-93f20337634c', client_id_var, 1, 9, 66, client_id_var),
            ('77be6e4a-766f-4291-bfd3-93f20337634c', client_id_var, 2, 9, 238, client_id_var),
            ('77be6e4a-766f-4291-bfd3-93f20337634c', client_id_var, 3, 9, 242, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '6bb3deca-c208-4c4b-9a9b-bf23fa098dc3';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-07', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'daae381f-933f-49df-9bff-06d1e2407e0d';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-07-05', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Deadlift
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Deadlift';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('adcb0716-30b4-4445-835f-543ffdd3559d', session_id_var, exercise_id_var, 1, 3, 10, 118);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('adcb0716-30b4-4445-835f-543ffdd3559d', client_id_var, 1, 11, 227, client_id_var),
            ('adcb0716-30b4-4445-835f-543ffdd3559d', client_id_var, 2, 8, 193, client_id_var),
            ('adcb0716-30b4-4445-835f-543ffdd3559d', client_id_var, 3, 11, 171, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('c0b680a1-416f-48e9-9feb-70b8106b20ef', session_id_var, exercise_id_var, 2, 3, 10, 167);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('c0b680a1-416f-48e9-9feb-70b8106b20ef', client_id_var, 1, 12, 233, client_id_var),
            ('c0b680a1-416f-48e9-9feb-70b8106b20ef', client_id_var, 2, 11, 100, client_id_var),
            ('c0b680a1-416f-48e9-9feb-70b8106b20ef', client_id_var, 3, 10, 91, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('4438693c-86b5-4efc-ad0c-a17bc53c01fe', session_id_var, exercise_id_var, 3, 3, 10, 191);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('4438693c-86b5-4efc-ad0c-a17bc53c01fe', client_id_var, 1, 11, 93, client_id_var),
            ('4438693c-86b5-4efc-ad0c-a17bc53c01fe', client_id_var, 2, 10, 117, client_id_var),
            ('4438693c-86b5-4efc-ad0c-a17bc53c01fe', client_id_var, 3, 11, 89, client_id_var);
    END $$;

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('0eb330e9-f97c-42a5-bbb8-d409158e4eb3', session_id_var, exercise_id_var, 4, 3, 10, 194);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('0eb330e9-f97c-42a5-bbb8-d409158e4eb3', client_id_var, 1, 8, 114, client_id_var),
            ('0eb330e9-f97c-42a5-bbb8-d409158e4eb3', client_id_var, 2, 9, 211, client_id_var),
            ('0eb330e9-f97c-42a5-bbb8-d409158e4eb3', client_id_var, 3, 8, 179, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('9443e895-79b6-494e-809b-5516e514b3fa', session_id_var, exercise_id_var, 5, 3, 10, 85);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('9443e895-79b6-494e-809b-5516e514b3fa', client_id_var, 1, 12, 230, client_id_var),
            ('9443e895-79b6-494e-809b-5516e514b3fa', client_id_var, 2, 9, 221, client_id_var),
            ('9443e895-79b6-494e-809b-5516e514b3fa', client_id_var, 3, 8, 145, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'a943a2ec-d25a-4021-a105-ded7bcf05039';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-10', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '4725f71e-bf11-48f1-9280-c5eb996a89c3';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-25', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'b43c1831-73f4-43a3-bc0d-2f4e67aa9ce9';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jen.affleck8@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-22', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee

-- Data for client: Jessi Ngatikaura


-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '7ed55c56-7814-4c7a-a3e8-e20fcdfc4fc8';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-17', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '9d85295e-e6f6-4cc1-83d2-b1a489e42bba';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-03-12', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '774a103f-3c75-42cd-9bd4-e656a2561626';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-11-28', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '9e58070b-4314-4eea-a938-63228e4f84c3';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-11', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '9e54ec7c-4461-49ca-bc78-9d4fa8046b90';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-01-22', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'c579a336-f87a-4f09-a4c2-b3b0c4b79e40';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-15', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '4a2eb71d-e58a-4e67-9632-e564e924556e';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-11-26', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '95356973-bd57-4f16-b0d1-e1e15946eafe';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-04-10', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'fd10908c-1b09-451c-bc16-6621aa90e2c1';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-02-06', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Shoulder Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Shoulder Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('db75119e-85b0-4db3-8792-f4f2aee2d368', session_id_var, exercise_id_var, 1, 3, 10, 82);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('db75119e-85b0-4db3-8792-f4f2aee2d368', client_id_var, 1, 9, 114, client_id_var),
            ('db75119e-85b0-4db3-8792-f4f2aee2d368', client_id_var, 2, 9, 247, client_id_var),
            ('db75119e-85b0-4db3-8792-f4f2aee2d368', client_id_var, 3, 9, 246, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('1c3b372b-f33c-426a-9458-a20d9c1d8c5e', session_id_var, exercise_id_var, 2, 3, 10, 188);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('1c3b372b-f33c-426a-9458-a20d9c1d8c5e', client_id_var, 1, 8, 217, client_id_var),
            ('1c3b372b-f33c-426a-9458-a20d9c1d8c5e', client_id_var, 2, 10, 137, client_id_var),
            ('1c3b372b-f33c-426a-9458-a20d9c1d8c5e', client_id_var, 3, 10, 120, client_id_var);
    END $$;

    -- Add exercise to session: Bench Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bench Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('4913e3be-e2b5-4571-bf6f-614a3b31b2b9', session_id_var, exercise_id_var, 3, 3, 10, 163);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('4913e3be-e2b5-4571-bf6f-614a3b31b2b9', client_id_var, 1, 12, 233, client_id_var),
            ('4913e3be-e2b5-4571-bf6f-614a3b31b2b9', client_id_var, 2, 9, 114, client_id_var),
            ('4913e3be-e2b5-4571-bf6f-614a3b31b2b9', client_id_var, 3, 12, 69, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('b54c5176-9af5-4293-9940-9f71488e1c4b', session_id_var, exercise_id_var, 4, 3, 10, 162);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('b54c5176-9af5-4293-9940-9f71488e1c4b', client_id_var, 1, 9, 94, client_id_var),
            ('b54c5176-9af5-4293-9940-9f71488e1c4b', client_id_var, 2, 8, 180, client_id_var),
            ('b54c5176-9af5-4293-9940-9f71488e1c4b', client_id_var, 3, 12, 200, client_id_var);
    END $$;

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('d3cff302-8f24-4690-add9-9b4be13da2b9', session_id_var, exercise_id_var, 5, 3, 10, 170);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('d3cff302-8f24-4690-add9-9b4be13da2b9', client_id_var, 1, 11, 94, client_id_var),
            ('d3cff302-8f24-4690-add9-9b4be13da2b9', client_id_var, 2, 12, 74, client_id_var),
            ('d3cff302-8f24-4690-add9-9b4be13da2b9', client_id_var, 3, 11, 164, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'f0af54ce-0928-4c2f-a540-95554ed87e63';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'lewis.nixon11@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-10-09', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Vinyasa Yoga w/ Edna
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '7e122efb-af23-4976-97db-a9e20c595a97';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Vinyasa Yoga w/ Edna';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-12-13', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Vinyasa Yoga w/ Edna



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '4dbddbb4-07ff-4af4-b1a9-dab7373325aa';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-17', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Power Bounce w/ Kalee
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '0b502d2e-ab54-4b8d-8f93-3ce2841cde15';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'herbert.sobel12@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Power Bounce w/ Kalee';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-06-20', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Power Bounce w/ Kalee



-- Session for Barre w/ Michelle
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '827d399c-db3e-49fe-9ea4-cdbd58d5b7f5';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Barre w/ Michelle';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-09-03', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

END $$;
-- End of session for Barre w/ Michelle



-- Session for Tsunami Strength w/ Lisa
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := 'b1ce73b9-32cc-4a1e-9521-0fc76240677b';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = 'jessi.ngatikaura9@test.com';
    SELECT id INTO trainer_id_var FROM users WHERE email = 'richard.winters10@test.com';
    SELECT id INTO class_id_var FROM classes WHERE name = 'Tsunami Strength w/ Lisa';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '2025-08-23', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);

    -- Add exercise to session: Pull-ups
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Pull-ups';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('5e8da5d2-462e-4a8a-a7ff-f3d8f0b6db57', session_id_var, exercise_id_var, 1, 3, 10, 237);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('5e8da5d2-462e-4a8a-a7ff-f3d8f0b6db57', client_id_var, 1, 11, 163, client_id_var),
            ('5e8da5d2-462e-4a8a-a7ff-f3d8f0b6db57', client_id_var, 2, 11, 196, client_id_var),
            ('5e8da5d2-462e-4a8a-a7ff-f3d8f0b6db57', client_id_var, 3, 10, 65, client_id_var);
    END $$;

    -- Add exercise to session: Bicep Curls
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Bicep Curls';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('c260ce10-c878-4ac0-abcd-c92db7e83899', session_id_var, exercise_id_var, 2, 3, 10, 166);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('c260ce10-c878-4ac0-abcd-c92db7e83899', client_id_var, 1, 10, 241, client_id_var),
            ('c260ce10-c878-4ac0-abcd-c92db7e83899', client_id_var, 2, 12, 119, client_id_var),
            ('c260ce10-c878-4ac0-abcd-c92db7e83899', client_id_var, 3, 11, 154, client_id_var);
    END $$;

    -- Add exercise to session: Barbell Squat
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Barbell Squat';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('4a59fe73-7b00-42db-be39-27081aa9324f', session_id_var, exercise_id_var, 3, 3, 10, 245);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('4a59fe73-7b00-42db-be39-27081aa9324f', client_id_var, 1, 10, 198, client_id_var),
            ('4a59fe73-7b00-42db-be39-27081aa9324f', client_id_var, 2, 10, 93, client_id_var),
            ('4a59fe73-7b00-42db-be39-27081aa9324f', client_id_var, 3, 11, 222, client_id_var);
    END $$;

    -- Add exercise to session: Dumbbell Rows
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Dumbbell Rows';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('aeebaa7f-fd59-4142-b57b-8b8a389eeaaf', session_id_var, exercise_id_var, 4, 3, 10, 199);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('aeebaa7f-fd59-4142-b57b-8b8a389eeaaf', client_id_var, 1, 9, 109, client_id_var),
            ('aeebaa7f-fd59-4142-b57b-8b8a389eeaaf', client_id_var, 2, 12, 185, client_id_var),
            ('aeebaa7f-fd59-4142-b57b-8b8a389eeaaf', client_id_var, 3, 10, 165, client_id_var);
    END $$;

    -- Add exercise to session: Leg Press
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = 'Leg Press';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('591963f8-8db0-437b-8ef8-fada3e21bb73', session_id_var, exercise_id_var, 5, 3, 10, 119);

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('591963f8-8db0-437b-8ef8-fada3e21bb73', client_id_var, 1, 8, 189, client_id_var),
            ('591963f8-8db0-437b-8ef8-fada3e21bb73', client_id_var, 2, 9, 151, client_id_var),
            ('591963f8-8db0-437b-8ef8-fada3e21bb73', client_id_var, 3, 10, 154, client_id_var);
    END $$;

END $$;
-- End of session for Tsunami Strength w/ Lisa


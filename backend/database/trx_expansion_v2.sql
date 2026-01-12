-- TRX Exercise Expansion V2 (Robust)
-- Uses dynamic lookup for secondary muscles to prevent null errors

DO $$
DECLARE
    strength_id UUID;
    quads_id UUID;
    glutes_id UUID;
    abs_id UUID;
    obliques_id UUID;
    shoulders_id UUID;
    biceps_id UUID;
    triceps_id UUID;
BEGIN
    -- Get Workout Type IDs
    SELECT id INTO strength_id FROM workout_types WHERE name = 'Strength' LIMIT 1;

    -- Get Primary Muscle IDs
    SELECT id INTO quads_id FROM body_focus_areas WHERE name = 'Quadriceps' LIMIT 1;
    SELECT id INTO glutes_id FROM body_focus_areas WHERE name = 'Glutes' LIMIT 1;
    SELECT id INTO abs_id FROM body_focus_areas WHERE name = 'Abs' LIMIT 1;
    SELECT id INTO obliques_id FROM body_focus_areas WHERE name = 'Obliques' LIMIT 1;
    SELECT id INTO shoulders_id FROM body_focus_areas WHERE name = 'Shoulders' LIMIT 1;
    SELECT id INTO biceps_id FROM body_focus_areas WHERE name = 'Biceps' LIMIT 1;
    SELECT id INTO triceps_id FROM body_focus_areas WHERE name = 'Triceps' LIMIT 1;

    -- Insert Expanded TRX Set
    INSERT INTO exercises (name, description, workout_type_id, primary_muscle_group, equipment_required, difficulty_level, instructions)
    VALUES 
    ('TRX Lunge', 'Single leg suspension lunge/split squat', strength_id, quads_id, 'TRX Suspension Trainer', 'Intermediate', 'Stand facing away from the anchor with one foot suspended in the foot cradle. Lower your body into a lunge, bending both knees to 90 degrees. Push through your front heel to return to the start.'),
    ('TRX Squat Jump', 'Explosive suspension squat', strength_id, quads_id, 'TRX Suspension Trainer', 'Intermediate', 'Stand facing the anchor point, holding handles at chest level. Perform a squat, then explode upwards into a jump, landing softly back into a squat.'),
    ('TRX Pistol Squat', 'Single leg unassisted suspension squat', strength_id, quads_id, 'TRX Suspension Trainer', 'Advanced', 'Stand facing the anchor point, holding the handles. Extend one leg forward and squat down on the standing leg, keeping the extended leg raised. Push through the heel to return to standing.'),
    ('TRX Curtsy Lunge', 'Glute-focused lateral lunge', strength_id, glutes_id, 'TRX Suspension Trainer', 'Intermediate', 'Stand holding the handles. Step one leg backward and across to the opposite side, bending both knees into a curtsy. Return to standing.'),
    ('TRX Glute Bridge', 'Supine suspension glute isolation', strength_id, glutes_id, 'TRX Suspension Trainer', 'Beginner', 'Lie on your back with heels in the foot cradles. Lift your hips off the ground, squeezing your glutes, forming a straight line from shoulders to knees. Lower with control.'),
    ('TRX Pike', 'Advanced core compression', strength_id, abs_id, 'TRX Suspension Trainer', 'Advanced', 'Start in a plank position with feet in the foot cradles. Keeping legs straight, lift your hips towards the ceiling, pulling your feet towards your hands. Lower back to plank.'),
    ('TRX Oblique Crunch', 'Rotational core suspension', strength_id, obliques_id, 'TRX Suspension Trainer', 'Intermediate', 'From a plank position with feet in foot cradles, pull both knees towards one elbow, twisting your torso. Return to plank and repeat on the other side.'),
    ('TRX Side Plank', 'Lateral core stability', strength_id, obliques_id, 'TRX Suspension Trainer', 'Intermediate', 'Place feet in foot cradles. Roll onto one side, supporting your body with one forearm or hand, keeping your body in a straight line. Hold.'),
    ('TRX Ab Rollout', 'Anterior core extension', strength_id, abs_id, 'TRX Suspension Trainer', 'Intermediate', 'Kneel facing the anchor point, holding the handles. Lean forward, extending your arms overhead, allowing your body to stretch. Engage your core to pull yourself back to the starting position.'),
    ('TRX T-Fly', 'Rear delt and mid-back suspension', strength_id, shoulders_id, 'TRX Suspension Trainer', 'Intermediate', 'Stand facing the anchor point, leaning back with straight arms. Pull your arms straight out to the sides to form a "T" shape with your body. Lower with control.'),
    ('TRX Skull Crusher', 'Suspension tricep extension', strength_id, triceps_id, 'TRX Suspension Trainer', 'Intermediate', 'Face away from the anchor point, holding handles with arms extended overhead. Bend your elbows, lowering your hands towards the top of your head. Extend arms to push back up.'),
    ('TRX Hammer Curl', 'Neutral grip suspension bicep curl', strength_id, biceps_id, 'TRX Suspension Trainer', 'Intermediate', 'Stand facing the anchor point, leaning back with arms extended, palms facing each other (neutral grip). Pull your body up by curling your hands towards your shoulders.')
    ON CONFLICT (name) DO NOTHING;

    -- Map Secondary Muscles (Safely)
    -- Pistol Squat -> Glutes
    IF glutes_id IS NOT NULL THEN
        INSERT INTO exercise_secondary_muscles (exercise_id, body_focus_id)
        SELECT e.id, glutes_id FROM exercises e WHERE e.name = 'TRX Pistol Squat'
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Pike -> Shoulders
    IF shoulders_id IS NOT NULL THEN
        INSERT INTO exercise_secondary_muscles (exercise_id, body_focus_id)
        SELECT e.id, shoulders_id FROM exercises e WHERE e.name = 'TRX Pike'
        ON CONFLICT DO NOTHING;
    END IF;

END $$;
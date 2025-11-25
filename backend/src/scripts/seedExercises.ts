import { query } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

const workoutTypes = [
    { name: 'Strength', description: 'Resistance training to build muscle and strength' },
    { name: 'Cardio', description: 'Aerobic exercise to improve cardiovascular health' },
    { name: 'HIIT', description: 'High Intensity Interval Training' },
    { name: 'Yoga', description: 'Flexibility and mindfulness practice' },
    { name: 'Pilates', description: 'Core strength and stability' },
    { name: 'Barre', description: 'Ballet-inspired workout' },
    { name: 'Circuit', description: 'Series of exercises performed in rotation' }
];

const bodyFocusAreas = [
    { name: 'Full Body', description: 'Targets all major muscle groups' },
    { name: 'Upper Body', description: 'Chest, back, shoulders, and arms' },
    { name: 'Lower Body', description: 'Legs, glutes, and calves' },
    { name: 'Core', description: 'Abs and lower back' },
    { name: 'Chest', description: 'Pectoral muscles' },
    { name: 'Back', description: 'Latissimus dorsi, rhomboids, and trapezius' },
    { name: 'Legs', description: 'Quadriceps, hamstrings, and calves' },
    { name: 'Glutes', description: 'Gluteal muscles' },
    { name: 'Shoulders', description: 'Deltoids' },
    { name: 'Arms', description: 'Biceps and triceps' }
];

const exercises = [
    { name: 'Squat', type: 'Strength', focus: 'Legs', difficulty: 'Intermediate' },
    { name: 'Push Up', type: 'Strength', focus: 'Chest', difficulty: 'Beginner' },
    { name: 'Plank', type: 'Strength', focus: 'Core', difficulty: 'Beginner' },
    { name: 'Burpee', type: 'HIIT', focus: 'Full Body', difficulty: 'Advanced' },
    { name: 'Lunge', type: 'Strength', focus: 'Legs', difficulty: 'Beginner' },
    { name: 'Deadlift', type: 'Strength', focus: 'Back', difficulty: 'Advanced' },
    { name: 'Bench Press', type: 'Strength', focus: 'Chest', difficulty: 'Intermediate' },
    { name: 'Mountain Climber', type: 'Cardio', focus: 'Core', difficulty: 'Intermediate' },
    { name: 'Jumping Jack', type: 'Cardio', focus: 'Full Body', difficulty: 'Beginner' },
    { name: 'Bicep Curl', type: 'Strength', focus: 'Arms', difficulty: 'Beginner' }
];

async function seedExercises() {
    try {
        console.log('🌱 Starting exercise seeding...');

        // 1. Seed Workout Types
        console.log('Seeding workout types...');
        const typeMap = new Map();
        for (const type of workoutTypes) {
            const res = await query(
                `INSERT INTO workout_types (name, description) 
                 VALUES ($1, $2) 
                 ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
                 RETURNING id, name`,
                [type.name, type.description]
            );
            typeMap.set(res.rows[0].name, res.rows[0].id);
        }

        // 2. Seed Body Focus Areas
        console.log('Seeding body focus areas...');
        const focusMap = new Map();
        for (const area of bodyFocusAreas) {
            const res = await query(
                `INSERT INTO body_focus_areas (name, description) 
                 VALUES ($1, $2) 
                 ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
                 RETURNING id, name`,
                [area.name, area.description]
            );
            focusMap.set(res.rows[0].name, res.rows[0].id);
        }

        // 3. Seed Exercises
        console.log('Seeding exercises...');
        for (const ex of exercises) {
            const typeId = typeMap.get(ex.type);
            const focusId = focusMap.get(ex.focus);

            if (typeId && focusId) {
                await query(
                    `INSERT INTO exercises (name, workout_type_id, primary_muscle_group, difficulty_level, is_active) 
                     VALUES ($1, $2, $3, $4, true)
                     ON CONFLICT (name) DO NOTHING`,
                    [ex.name, typeId, focusId, ex.difficulty]
                );
            }
        }

        console.log('✅ Exercise seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding exercises:', error);
        process.exit(1);
    }
}

seedExercises();

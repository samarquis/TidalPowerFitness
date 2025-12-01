/**
 * Import exercises from free-exercise-db (yuhonas/free-exercise-db)
 *
 * This script downloads the exercises.json file from GitHub and imports
 * exercises into our database, mapping them to our Body Part > Muscle structure.
 *
 * Data source: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json
 * License: Public Domain (Unlicense)
 */

import { query } from '../config/db';

interface FreeExerciseDBExercise {
    id: string;
    name: string;
    force?: string;
    level?: string; // beginner, intermediate, expert
    mechanic?: string;
    equipment?: string;
    primaryMuscles?: string[];
    secondaryMuscles?: string[];
    instructions?: string[];
    category?: string;
    images?: string[];
}

// Body Parts and their associated muscles
const BODY_PARTS_WITH_MUSCLES = [
    {
        bodyPart: 'Arms',
        muscles: ['Biceps', 'Triceps', 'Forearms']
    },
    {
        bodyPart: 'Chest',
        muscles: ['Chest']
    },
    {
        bodyPart: 'Shoulders',
        muscles: ['Shoulders', 'Traps']
    },
    {
        bodyPart: 'Back',
        muscles: ['Lats', 'Upper Back', 'Lower Back', 'Traps']
    },
    {
        bodyPart: 'Core',
        muscles: ['Abs', 'Obliques']
    },
    {
        bodyPart: 'Legs',
        muscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Abductors', 'Adductors']
    },
    {
        bodyPart: 'Other',
        muscles: ['Neck', 'Full Body']
    }
];

// Mapping from free-exercise-db muscle names to our body_focus_areas
const MUSCLE_MAPPING: Record<string, string> = {
    'biceps': 'Biceps',
    'triceps': 'Triceps',
    'chest': 'Chest',
    'shoulders': 'Shoulders',
    'back': 'Back',
    'lats': 'Lats',
    'traps': 'Traps',
    'forearms': 'Forearms',
    'abdominals': 'Abs',
    'obliques': 'Obliques',
    'quadriceps': 'Quadriceps',
    'hamstrings': 'Hamstrings',
    'glutes': 'Glutes',
    'calves': 'Calves',
    'lower back': 'Lower Back',
    'middle back': 'Upper Back',
    'neck': 'Neck',
    'abductors': 'Abductors',
    'adductors': 'Adductors'
};

// Mapping difficulty levels
const DIFFICULTY_MAPPING: Record<string, string> = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'expert': 'Advanced'
};

async function getMuscleIdByName(muscleName: string): Promise<string | null> {
    const result = await query(
        'SELECT id FROM body_focus_areas WHERE LOWER(name) = LOWER($1)',
        [muscleName]
    );
    return result.rows[0]?.id || null;
}

async function getWorkoutTypeId(category: string): Promise<string | null> {
    // Map category to workout type (you may need to adjust this)
    const categoryMap: Record<string, string> = {
        'strength': 'Strength',
        'stretching': 'Flexibility',
        'plyometrics': 'Cardio',
        'strongman': 'Strength',
        'powerlifting': 'Strength',
        'cardio': 'Cardio',
        'olympic weightlifting': 'Strength'
    };

    const workoutTypeName = categoryMap[category?.toLowerCase() || ''] || 'Strength';

    const result = await query(
        'SELECT id FROM workout_types WHERE LOWER(name) = LOWER($1)',
        [workoutTypeName]
    );
    return result.rows[0]?.id || null;
}

async function ensureWorkoutTypes(): Promise<void> {
    console.log('📋 Ensuring workout types exist...');

    const workoutTypes = [
        { name: 'Strength', description: 'Resistance training to build muscle and strength' },
        { name: 'Cardio', description: 'Aerobic exercise to improve cardiovascular health' },
        { name: 'Flexibility', description: 'Stretching and mobility exercises' },
        { name: 'HIIT', description: 'High Intensity Interval Training' }
    ];

    for (const type of workoutTypes) {
        await query(
            `INSERT INTO workout_types (name, description)
             VALUES ($1, $2)
             ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description`,
            [type.name, type.description]
        );
    }

    console.log('✅ Workout types ready\n');
}

async function ensureBodyPartsAndMuscles(): Promise<void> {
    console.log('💪 Ensuring body parts and muscles exist...');

    for (const { bodyPart, muscles } of BODY_PARTS_WITH_MUSCLES) {
        // Create body part
        const bodyPartResult = await query(
            `INSERT INTO body_parts (name, description)
             VALUES ($1, $2)
             ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [bodyPart, `${bodyPart} exercises`]
        );

        const bodyPartId = bodyPartResult.rows[0].id;

        // Create muscles (body_focus_areas) for this body part
        for (const muscle of muscles) {
            await query(
                `INSERT INTO body_focus_areas (name, description, body_part_id)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (name) DO UPDATE SET body_part_id = EXCLUDED.body_part_id`,
                [muscle, `${muscle} exercises`, bodyPartId]
            );
        }
    }

    console.log('✅ Body parts and muscles ready\n');
}

async function importExercises() {
    console.log('🏋️ Starting exercise import from free-exercise-db...\n');

    try {
        // Step 1: Ensure workout types exist
        await ensureWorkoutTypes();

        // Step 2: Ensure body parts and muscles exist
        await ensureBodyPartsAndMuscles();

        // Step 3: Download exercises from GitHub
        console.log('📥 Downloading exercises.json...');
        const response = await fetch(
            'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
        );

        if (!response.ok) {
            throw new Error(`Failed to download: ${response.statusText}`);
        }

        const exercises: FreeExerciseDBExercise[] = await response.json();
        console.log(`✅ Downloaded ${exercises.length} exercises\n`);

        let imported = 0;
        let skipped = 0;
        let errors = 0;

        for (const exercise of exercises) {
            try {
                // Get primary muscle
                const primaryMuscleName = exercise.primaryMuscles?.[0];
                if (!primaryMuscleName) {
                    skipped++;
                    continue;
                }

                const mappedMuscleName = MUSCLE_MAPPING[primaryMuscleName.toLowerCase()] || primaryMuscleName;
                const muscleId = await getMuscleIdByName(mappedMuscleName);

                if (!muscleId) {
                    console.log(`⚠️  Skipping "${exercise.name}" - muscle "${mappedMuscleName}" not found`);
                    skipped++;
                    continue;
                }

                // Get workout type
                const workoutTypeId = await getWorkoutTypeId(exercise.category || 'strength');

                // Map difficulty
                const difficulty = exercise.level ? DIFFICULTY_MAPPING[exercise.level] || 'Intermediate' : 'Intermediate';

                // Combine instructions into a single string
                const instructions = exercise.instructions?.join('\n\n') || '';

                // Check if exercise already exists
                const existingResult = await query(
                    'SELECT id FROM exercises WHERE LOWER(name) = LOWER($1)',
                    [exercise.name]
                );

                if (existingResult.rows.length > 0) {
                    skipped++;
                    continue;
                }

                // Insert exercise
                await query(
                    `INSERT INTO exercises (
                        name, 
                        description, 
                        workout_type_id, 
                        primary_muscle_group, 
                        equipment_required, 
                        difficulty_level, 
                        instructions
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        exercise.name,
                        `${exercise.mechanic || ''} ${exercise.force || ''}`.trim() || null,
                        workoutTypeId,
                        muscleId,
                        exercise.equipment || null,
                        difficulty,
                        instructions || null
                    ]
                );

                imported++;

                if (imported % 50 === 0) {
                    console.log(`✅ Imported ${imported} exercises...`);
                }

            } catch (error) {
                console.error(`❌ Error importing "${exercise.name}":`, error);
                errors++;
            }
        }

        console.log('\n📊 Import Summary:');
        console.log(`   ✅ Imported: ${imported}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   ❌ Errors: ${errors}`);
        console.log(`   📝 Total: ${exercises.length}`);

    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    importExercises()
        .then(() => {
            console.log('\n✅ Import complete!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Import failed:', error);
            process.exit(1);
        });
}

export default importExercises;

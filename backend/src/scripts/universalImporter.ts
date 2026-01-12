import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { query } from '../config/db';

interface RawExercise {
    id: string;
    name: string;
    force?: string;
    level?: string;
    mechanic?: string;
    equipment?: string;
    primaryMuscles?: string[];
    secondaryMuscles?: string[];
    instructions?: string[];
    category?: string;
}

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

async function getMuscleId(name: string): Promise<string | null> {
    const mappedName = MUSCLE_MAPPING[name.toLowerCase()] || name;
    const result = await query('SELECT id FROM body_focus_areas WHERE LOWER(name) = LOWER($1)', [mappedName]);
    return result.rows[0]?.id || null;
}

async function getWorkoutTypeId(category: string): Promise<string> {
    const map: Record<string, string> = {
        'strength': 'Strength',
        'stretching': 'Flexibility',
        'cardio': 'Cardio'
    };
    const name = map[category.toLowerCase()] || 'Strength';
    const result = await query('SELECT id FROM workout_types WHERE name = $1', [name]);
    return result.rows[0]?.id;
}

async function run() {
    console.log('🌐 Launching Universal Exercise Importer...');
    
    try {
        const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
        const exercises: RawExercise[] = await response.json();
        
        console.log(`📦 Loaded ${exercises.length} raw exercises.`);

        const equipmentTypes = new Set(exercises.map(e => e.equipment));
        console.log('Available Equipment Types:', Array.from(equipmentTypes));

        let imported = 0;
        let updated = 0;

        for (const ex of exercises) {
            // TARGET: TRX / Suspension / Rings or any movement with comprehensive muscle data
            const nameLower = ex.name.toLowerCase();
            const instructionsLower = ex.instructions?.join(' ').toLowerCase() || '';
            
            const isSuspension = ex.equipment?.toLowerCase().includes('suspension') || 
                               ex.equipment?.toLowerCase().includes('rings') ||
                               nameLower.includes('trx') ||
                               nameLower.includes('suspension') ||
                               (ex.equipment?.toLowerCase() === 'body only' && (
                                   nameLower.includes('fallout') || 
                                   nameLower.includes('inverted row') ||
                                   nameLower.includes('knee tuck')
                               ));
            
            if (!isSuspension) continue;

            const primaryId = await getMuscleId(ex.primaryMuscles?.[0] || '');
            if (!primaryId) continue;

            const workoutTypeId = await getWorkoutTypeId(ex.category || 'strength');

            // 1. Upsert Exercise
            const exResult = await query(`
                INSERT INTO exercises (
                    name, description, workout_type_id, primary_muscle_group, 
                    equipment_required, difficulty_level, instructions
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (name) DO UPDATE SET
                    description = EXCLUDED.description,
                    instructions = EXCLUDED.instructions,
                    equipment_required = EXCLUDED.equipment_required
                RETURNING id
            `, [
                ex.name,
                `${ex.mechanic || ''} ${ex.force || ''}`.trim(),
                workoutTypeId,
                primaryId,
                ex.equipment || 'Suspension Straps',
                ex.level ? (ex.level.charAt(0).toUpperCase() + ex.level.slice(1)) : 'Intermediate',
                ex.instructions?.join('\n\n') || ''
            ]);

            const exerciseId = exResult.rows[0].id;

            // 2. Handle Secondary Muscles (New Media-Rich Logic)
            if (ex.secondaryMuscles && ex.secondaryMuscles.length > 0) {
                // Clear existing secondary mappings
                await query('DELETE FROM exercise_secondary_muscles WHERE exercise_id = $1', [exerciseId]);
                
                for (const muscleName of ex.secondaryMuscles) {
                    const secondaryId = await getMuscleId(muscleName);
                    if (secondaryId) {
                        await query(
                            'INSERT INTO exercise_secondary_muscles (exercise_id, body_focus_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                            [exerciseId, secondaryId]
                        );
                    }
                }
            }

            imported++;
            console.log(`✅ ${ex.name} (Suspension)`);
        }

        console.log(`🏁 Import Summary: ${imported} suspension movements processed.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Universal Importer Failed:', err);
        process.exit(1);
    }
}

run();

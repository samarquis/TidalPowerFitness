/**
 * Check the status of exercise import
 * This script helps debug why exercises aren't showing up
 */

import { query } from '../config/db';

async function checkImportStatus() {
    console.log('🔍 Checking import status...\n');

    try {
        // Check body parts
        const bodyParts = await query('SELECT * FROM body_parts ORDER BY name');
        console.log(`✅ Body Parts: ${bodyParts.rows.length} found`);
        bodyParts.rows.forEach((bp: any) => {
            console.log(`   - ${bp.name} (${bp.id})`);
        });

        // Check muscles (body_focus_areas)
        const muscles = await query('SELECT bfa.*, bp.name as body_part_name FROM body_focus_areas bfa LEFT JOIN body_parts bp ON bfa.body_part_id = bp.id ORDER BY bfa.name');
        console.log(`\n✅ Muscle Groups: ${muscles.rows.length} found`);
        muscles.rows.forEach((m: any) => {
            console.log(`   - ${m.name} (${m.id}) - Part: ${m.body_part_name || 'N/A'}`);
        });

        // Check workout types
        const workoutTypes = await query('SELECT * FROM workout_types ORDER BY name');
        console.log(`\n✅ Workout Types: ${workoutTypes.rows.length} found`);
        workoutTypes.rows.forEach((wt: any) => {
            console.log(`   - ${wt.name} (${wt.id})`);
        });

        // Check exercises
        const exercises = await query('SELECT * FROM exercises');
        console.log(`\n📊 Exercises: ${exercises.rows.length} found`);

        if (exercises.rows.length === 0) {
            console.log('\n⚠️  No exercises found! Let\'s check for potential issues...\n');

            // Check if exercises table exists and has correct structure
            const tableInfo = await query(`
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = 'exercises'
                ORDER BY ordinal_position
            `);
            console.log('📋 Exercises table structure:');
            tableInfo.rows.forEach((col: any) => {
                console.log(`   - ${col.column_name}: ${col.data_type}`);
            });
        } else {
            // Sample some exercises
            console.log('\n📝 Sample exercises:');
            const sampleExercises = await query(`
                SELECT e.name, e.difficulty_level, e.equipment_required,
                       bfa.name as muscle_name, wt.name as workout_type_name
                FROM exercises e
                LEFT JOIN body_focus_areas bfa ON e.primary_muscle_group = bfa.id
                LEFT JOIN workout_types wt ON e.workout_type_id = wt.id
                LIMIT 10
            `);
            sampleExercises.rows.forEach((ex: any) => {
                console.log(`   - ${ex.name} | ${ex.muscle_name || 'N/A'} | ${ex.workout_type_name || 'N/A'}`);
            });

            // Count by muscle group
            const countByMuscle = await query(`
                SELECT bfa.name, COUNT(e.id) as exercise_count
                FROM body_focus_areas bfa
                LEFT JOIN exercises e ON e.primary_muscle_group = bfa.id
                GROUP BY bfa.name
                ORDER BY exercise_count DESC
            `);
            console.log('\n📊 Exercises per muscle group:');
            countByMuscle.rows.forEach((row: any) => {
                console.log(`   - ${row.name}: ${row.exercise_count} exercises`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }

    process.exit(0);
}

checkImportStatus();

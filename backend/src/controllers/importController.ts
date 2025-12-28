import { Request, Response } from 'express';
import importExercises from '../scripts/importExercises';
import { query } from '../config/db';
import { AuthenticatedRequest } from '../types/auth'; // Added import

class ImportController {
    // Import exercises from free-exercise-db
    async importExercises(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            console.log('Starting exercise import...');

            // Run the import
            await importExercises();

            res.json({
                success: true,
                message: 'Exercise import completed successfully'
            });
        } catch (error) {
            console.error('Error importing exercises:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to import exercises'
            });
        }
    }

    // Debug endpoint to check import status
    async checkStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // Count body parts
            const bodyPartsResult = await query('SELECT COUNT(*) as count FROM body_parts');
            const bodyPartsCount = parseInt(bodyPartsResult.rows[0].count);

            // Count muscles
            const musclesResult = await query('SELECT COUNT(*) as count FROM body_focus_areas');
            const musclesCount = parseInt(musclesResult.rows[0].count);

            // Count workout types
            const workoutTypesResult = await query('SELECT COUNT(*) as count FROM workout_types');
            const workoutTypesCount = parseInt(workoutTypesResult.rows[0].count);

            // Count exercises
            const exercisesResult = await query('SELECT COUNT(*) as count FROM exercises');
            const exercisesCount = parseInt(exercisesResult.rows[0].count);

            // Get exercises per muscle
            const exercisesPerMuscle = await query(`
                SELECT bfa.name, COUNT(e.id) as exercise_count
                FROM body_focus_areas bfa
                LEFT JOIN exercises e ON e.primary_muscle_group = bfa.id
                GROUP BY bfa.name
                ORDER BY exercise_count DESC
            `);

            // Get sample exercises
            const sampleExercises = await query(`
                SELECT e.name, e.difficulty_level,
                       bfa.name as muscle_name, wt.name as workout_type_name
                FROM exercises e
                LEFT JOIN body_focus_areas bfa ON e.primary_muscle_group = bfa.id
                LEFT JOIN workout_types wt ON e.workout_type_id = wt.id
                LIMIT 5
            `);

            res.json({
                success: true,
                counts: {
                    body_parts: bodyPartsCount,
                    muscles: musclesCount,
                    workout_types: workoutTypesCount,
                    exercises: exercisesCount
                },
                exercises_per_muscle: exercisesPerMuscle.rows,
                sample_exercises: sampleExercises.rows
            });
        } catch (error) {
            console.error('Error checking status:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to check status'
            });
        }
    }
}

export default new ImportController();

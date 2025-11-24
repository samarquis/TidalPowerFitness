import { Request, Response } from 'express';
import Exercise from '../models/Exercise';

class ExerciseController {
    // Get all exercises
    async getExercises(req: Request, res: Response): Promise<void> {
        try {
            const filters = {
                workout_type_id: req.query.workout_type_id as string,
                muscle_group: req.query.muscle_group as string,
                difficulty: req.query.difficulty as string,
                is_active: req.query.is_active === 'true',
                search: req.query.search as string
            };

            const exercises = await Exercise.getAll(filters);
            res.json(exercises);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            res.status(500).json({ error: 'Failed to fetch exercises' });
        }
    }

    // Get exercise by ID
    async getExercise(req: Request, res: Response): Promise<void> {
        try {
            const exercise = await Exercise.getById(req.params.id);

            if (!exercise) {
                res.status(404).json({ error: 'Exercise not found' });
                return;
            }

            res.json(exercise);
        } catch (error) {
            console.error('Error fetching exercise:', error);
            res.status(500).json({ error: 'Failed to fetch exercise' });
        }
    }

    // Create new exercise
    async createExercise(req: Request, res: Response): Promise<void> {
        try {
            const exerciseData = {
                ...req.body,
                created_by: req.user?.id
            };

            const exercise = await Exercise.create(exerciseData);
            res.status(201).json(exercise);
        } catch (error) {
            console.error('Error creating exercise:', error);
            res.status(500).json({ error: 'Failed to create exercise' });
        }
    }

    // Update exercise
    async updateExercise(req: Request, res: Response): Promise<void> {
        try {
            const exercise = await Exercise.update(req.params.id, req.body);

            if (!exercise) {
                res.status(404).json({ error: 'Exercise not found' });
                return;
            }

            res.json(exercise);
        } catch (error) {
            console.error('Error updating exercise:', error);
            res.status(500).json({ error: 'Failed to update exercise' });
        }
    }

    // Delete exercise (soft delete)
    async deleteExercise(req: Request, res: Response): Promise<void> {
        try {
            const success = await Exercise.delete(req.params.id);

            if (!success) {
                res.status(404).json({ error: 'Exercise not found' });
                return;
            }

            res.json({ message: 'Exercise deleted successfully' });
        } catch (error) {
            console.error('Error deleting exercise:', error);
            res.status(500).json({ error: 'Failed to delete exercise' });
        }
    }

    // Get workout types
    async getWorkoutTypes(req: Request, res: Response): Promise<void> {
        try {
            const types = await Exercise.getWorkoutTypes();
            res.json(types);
        } catch (error) {
            console.error('Error fetching workout types:', error);
            res.status(500).json({ error: 'Failed to fetch workout types' });
        }
    }

    // Get body focus areas
    async getBodyFocusAreas(req: Request, res: Response): Promise<void> {
        try {
            const areas = await Exercise.getBodyFocusAreas();
            res.json(areas);
        } catch (error) {
            console.error('Error fetching body focus areas:', error);
            res.status(500).json({ error: 'Failed to fetch body focus areas' });
        }
    }
}

export default new ExerciseController();

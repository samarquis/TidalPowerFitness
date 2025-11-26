import { Request, Response } from 'express';
import Exercise from '../models/Exercise';
import BodyPart from '../models/BodyPart';

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

    // Get body parts
    async getBodyParts(req: Request, res: Response): Promise<void> {
        try {
            const parts = await BodyPart.getAll();
            res.json(parts);
        } catch (error) {
            console.error('Error fetching body parts:', error);
            res.status(500).json({ error: 'Failed to fetch body parts' });
        }
    }

    // Create body focus area
    async createBodyFocusArea(req: Request, res: Response): Promise<void> {
        try {
            const { name, description, body_part_id } = req.body;
            if (!name) {
                res.status(400).json({ error: 'Name is required' });
                return;
            }
            const area = await Exercise.createBodyFocusArea({ name, description, body_part_id });
            res.status(201).json(area);
        } catch (error) {
            console.error('Error creating body focus area:', error);
            res.status(500).json({ error: 'Failed to create body focus area' });
        }
    }

    // Update body focus area
    async updateBodyFocusArea(req: Request, res: Response): Promise<void> {
        try {
            const { name, description, body_part_id } = req.body;
            const area = await Exercise.updateBodyFocusArea(req.params.id, { name, description, body_part_id });
            if (!area) {
                res.status(404).json({ error: 'Body focus area not found' });
                return;
            }
            res.json(area);
        } catch (error) {
            console.error('Error updating body focus area:', error);
            res.status(500).json({ error: 'Failed to update body focus area' });
        }
    }

    // Delete body focus area
    async deleteBodyFocusArea(req: Request, res: Response): Promise<void> {
        try {
            const success = await Exercise.deleteBodyFocusArea(req.params.id);
            if (!success) {
                res.status(404).json({ error: 'Body focus area not found' });
                return;
            }
            res.json({ message: 'Body focus area deleted successfully' });
        } catch (error) {
            console.error('Error deleting body focus area:', error);
            res.status(500).json({ error: 'Failed to delete body focus area' });
        }
    }

    // Create workout type
    async createWorkoutType(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;
            if (!name) {
                res.status(400).json({ error: 'Name is required' });
                return;
            }
            const type = await Exercise.createWorkoutType({ name, description });
            res.status(201).json(type);
        } catch (error) {
            console.error('Error creating workout type:', error);
            res.status(500).json({ error: 'Failed to create workout type' });
        }
    }

    // Update workout type
    async updateWorkoutType(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;
            const type = await Exercise.updateWorkoutType(req.params.id, { name, description });
            if (!type) {
                res.status(404).json({ error: 'Workout type not found' });
                return;
            }
            res.json(type);
        } catch (error) {
            console.error('Error updating workout type:', error);
            res.status(500).json({ error: 'Failed to update workout type' });
        }
    }

    // Delete workout type
    async deleteWorkoutType(req: Request, res: Response): Promise<void> {
        try {
            const success = await Exercise.deleteWorkoutType(req.params.id);
            if (!success) {
                res.status(404).json({ error: 'Workout type not found' });
                return;
            }
            res.json({ message: 'Workout type deleted successfully' });
        } catch (error) {
            console.error('Error deleting workout type:', error);
            res.status(500).json({ error: 'Failed to delete workout type' });
        }
    }
    // Create body part
    async createBodyPart(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;
            if (!name) {
                res.status(400).json({ error: 'Name is required' });
                return;
            }
            const part = await BodyPart.create({ name, description });
            res.status(201).json(part);
        } catch (error) {
            console.error('Error creating body part:', error);
            res.status(500).json({ error: 'Failed to create body part' });
        }
    }

    // Update body part
    async updateBodyPart(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;
            const part = await BodyPart.update(req.params.id, { name, description });
            if (!part) {
                res.status(404).json({ error: 'Body part not found' });
                return;
            }
            res.json(part);
        } catch (error) {
            console.error('Error updating body part:', error);
            res.status(500).json({ error: 'Failed to update body part' });
        }
    }

    // Delete body part
    async deleteBodyPart(req: Request, res: Response): Promise<void> {
        try {
            const success = await BodyPart.delete(req.params.id);
            if (!success) {
                res.status(404).json({ error: 'Body part not found' });
                return;
            }
            res.json({ message: 'Body part deleted successfully' });
        } catch (error) {
            console.error('Error deleting body part:', error);
            res.status(500).json({ error: 'Failed to delete body part' });
        }
    }
}

export default new ExerciseController();

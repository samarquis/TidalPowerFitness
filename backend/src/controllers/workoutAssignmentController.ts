import { Request, Response } from 'express';
import UserModel from '../models/User';
import ClassModel from '../models/Class';
import WorkoutSessionModel from '../models/WorkoutSession';

// Get all clients for assignment
export const getClientsForAssignment = async (req: Request, res: Response) => {
    try {
        const clients = await UserModel.findByRole('client');

        // Return simplified client data
        const clientData = clients.map(client => ({
            id: client.id,
            first_name: client.first_name,
            last_name: client.last_name,
            email: client.email,
            full_name: `${client.first_name} ${client.last_name}`
        }));

        res.json(clientData);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
};

// Get active classes for assignment
export const getClassesForAssignment = async (req: Request, res: Response) => {
    try {
        const { day_of_week } = req.query;

        let classes;
        if (day_of_week !== undefined) {
            // Filter by specific day of week
            classes = await ClassModel.getClassesByDay(parseInt(day_of_week as string));
        } else {
            // Get all active classes
            classes = await ClassModel.getAllClasses(true);
        }

        res.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
};

// Assign workout to class or individual clients
export const assignWorkout = async (req: Request, res: Response) => {
    try {
        const {
            trainer_id,
            session_date,
            start_time,
            template_id,
            workout_type_id,
            class_id,
            participant_ids,
            exercises,
            body_focus_ids,
            notes
        } = req.body;

        // Validation
        if (!trainer_id || !session_date) {
            return res.status(400).json({ error: 'Trainer ID and session date are required' });
        }

        // Must have either class_id or participant_ids
        if (!class_id && (!participant_ids || participant_ids.length === 0)) {
            return res.status(400).json({
                error: 'Must assign to either a class or individual clients'
            });
        }

        // Must have either template_id or exercises
        if (!template_id && (!exercises || exercises.length === 0)) {
            return res.status(400).json({
                error: 'Must provide either a template or custom exercises'
            });
        }

        // Create the workout session
        const session = await WorkoutSessionModel.create({
            trainer_id,
            class_id,
            template_id,
            workout_type_id,
            session_date: new Date(session_date),
            start_time: start_time ? new Date(start_time) : undefined,
            participant_ids: class_id ? undefined : participant_ids,
            exercises,
            body_focus_ids,
            notes
        });

        res.status(201).json({
            message: 'Workout assigned successfully',
            session
        });
    } catch (error) {
        console.error('Error assigning workout:', error);
        res.status(500).json({ error: 'Failed to assign workout' });
    }
};

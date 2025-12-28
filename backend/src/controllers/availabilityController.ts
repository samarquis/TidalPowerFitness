import { Request, Response } from 'express';
import TrainerAvailabilityModel from '../models/TrainerAvailability';
import { AuthenticatedRequest } from '../types/auth'; // Added import

export const getTrainerAvailability = async (req: Request, res: Response) => {
    try {
        const { trainerId } = req.params;
        const availability = await TrainerAvailabilityModel.getByTrainer(trainerId);
        res.status(200).json(availability);
    } catch (error) {
        console.error('Get trainer availability error:', error);
        res.status(500).json({ error: 'Failed to get trainer availability' });
    }
};

export const createAvailability = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { trainer_id, day_of_week, start_time, end_time } = req.body;

        // Validate required fields
        if (!trainer_id || day_of_week === undefined || !start_time || !end_time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate day_of_week range
        if (day_of_week < 0 || day_of_week > 6) {
            return res.status(400).json({ error: 'day_of_week must be between 0 and 6' });
        }

        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
            return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
        }

        // Validate end_time > start_time
        if (start_time >= end_time) {
            return res.status(400).json({ error: 'end_time must be after start_time' });
        }

        // Authorization: only the trainer themselves or an admin can create availability
        if (req.user?.id !== trainer_id && !req.user?.roles?.includes('admin')) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const availability = await TrainerAvailabilityModel.create({
            trainer_id,
            day_of_week,
            start_time,
            end_time
        });

        res.status(201).json(availability);
    } catch (error: any) {
        console.error('Create availability error:', error);
        if (error.message?.includes('conflict')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to create availability' });
    }
};

export const updateAvailability = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { day_of_week, start_time, end_time } = req.body;

        // Validate inputs if provided
        if (day_of_week !== undefined && (day_of_week < 0 || day_of_week > 6)) {
            return res.status(400).json({ error: 'day_of_week must be between 0 and 6' });
        }

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (start_time && !timeRegex.test(start_time)) {
            return res.status(400).json({ error: 'Invalid start_time format. Use HH:MM' });
        }
        if (end_time && !timeRegex.test(end_time)) {
            return res.status(400).json({ error: 'Invalid end_time format. Use HH:MM' });
        }

        const availability = await TrainerAvailabilityModel.update(id, {
            day_of_week,
            start_time,
            end_time
        });

        if (!availability) {
            return res.status(404).json({ error: 'Availability slot not found' });
        }

        res.status(200).json(availability);
    } catch (error: any) {
        console.error('Update availability error:', error);
        if (error.message?.includes('conflict')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update availability' });
    }
};

export const deleteAvailability = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const success = await TrainerAvailabilityModel.delete(id);

        if (!success) {
            return res.status(404).json({ error: 'Availability slot not found' });
        }

        res.status(200).json({ message: 'Availability slot deleted successfully' });
    } catch (error) {
        console.error('Delete availability error:', error);
        res.status(500).json({ error: 'Failed to delete availability' });
    }
};

export default {
    getTrainerAvailability,
    createAvailability,
    updateAvailability,
    deleteAvailability
};

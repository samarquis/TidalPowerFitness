import { Request, Response } from 'express';
import UserModel from '../models/User';

// Get all trainers (for admin dropdown)
export const getTrainers = async (req: Request, res: Response) => {
    try {
        const trainers = await UserModel.findByRole('trainer');

        // Return only necessary fields for the dropdown
        const trainerList = trainers.map(trainer => ({
            id: trainer.id,
            first_name: trainer.first_name,
            last_name: trainer.last_name,
            email: trainer.email,
            full_name: `${trainer.first_name} ${trainer.last_name}`
        }));

        res.json(trainerList);
    } catch (error) {
        console.error('Error fetching trainers:', error);
        res.status(500).json({ error: 'Failed to fetch trainers' });
    }
};

export default {
    getTrainers
};

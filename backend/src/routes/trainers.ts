import express, { Request, Response } from 'express';
import TrainerProfile from '../models/TrainerProfile';
import UserModel from '../models/User';
import { authenticate, authorize } from '../middleware/auth';
import trainerController from '../controllers/trainerController';

const router = express.Router();

// Get all users with trainer role (admin only - for class management dropdown)
router.get('/users', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
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

        res.status(200).json(trainerList);
    } catch (error) {
        console.error('Get trainer users error:', error);
        res.status(500).json({ error: 'Failed to get trainer users' });
    }
});

// Create new trainer (admin only)
router.post('/', authenticate, authorize('admin'), trainerController.createTrainer);

// Get all active trainers (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        // Get all users with trainer role
        const trainerUsers = await UserModel.findByRole('trainer');

        // Build trainer list with profile data where available
        const trainers = await Promise.all(
            trainerUsers.map(async (user) => {
                const profile = await TrainerProfile.findByUserId(user.id);

                if (profile) {
                    // Return full profile with user data
                    return {
                        ...profile,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone
                    };
                } else {
                    // Return basic trainer info with default profile values
                    return {
                        id: `temp-${user.id}`, // Temporary ID to indicate no profile
                        user_id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone,
                        bio: 'Profile not yet completed',
                        specialties: [],
                        certifications: [],
                        years_experience: 0,
                        is_accepting_clients: false,
                        profile_image_url: null,
                        created_at: new Date(),
                        updated_at: new Date()
                    };
                }
            })
        );

        // Filter to only show accepting clients or those with completed profiles
        // Actually, let's show all trainers so Scott appears
        res.status(200).json({ trainers });
    } catch (error) {
        console.error('Get trainers error:', error);
        res.status(500).json({ error: 'Failed to get trainers' });
    }
});

// Get trainer by user ID (public)
router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const trainer = await TrainerProfile.findByUserId(userId);

        if (!trainer) {
            res.status(404).json({ error: 'Trainer not found' });
            return;
        }

        res.status(200).json({ trainer });
    } catch (error) {
        console.error('Get trainer error:', error);
        res.status(500).json({ error: 'Failed to get trainer' });
    }
});

// Update trainer profile (trainer or admin)
router.put('/:userId', authenticate, authorize('trainer', 'admin'), trainerController.updateTrainer);

// Delete trainer profile (admin only)
router.delete('/:userId', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const success = await TrainerProfile.delete(userId);

        if (!success) {
            res.status(404).json({ error: 'Trainer profile not found' });
            return;
        }

        res.status(200).json({ message: 'Trainer profile deleted successfully' });
    } catch (error) {
        console.error('Delete trainer profile error:', error);
        res.status(500).json({ error: 'Failed to delete trainer profile' });
    }
});

export default router;

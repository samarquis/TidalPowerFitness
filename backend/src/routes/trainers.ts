import express, { Request, Response } from 'express';
import TrainerProfile from '../models/TrainerProfile';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get all active trainers (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const trainers = await TrainerProfile.getAllActive();
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
    specialties,
        certifications,
        years_experience,
        profile_image_url,
        acuity_calendar_id,
        is_accepting_clients,
        } = req.body;

const trainer = await TrainerProfile.update(userId, {
    bio,
    specialties,
    certifications,
    years_experience,
    profile_image_url,
    acuity_calendar_id,
    is_accepting_clients,
});

if (!trainer) {
    res.status(404).json({ error: 'Trainer profile not found' });
    return;
}

res.status(200).json({
    message: 'Trainer profile updated successfully',
    trainer,
});
    } catch (error) {
    console.error('Update trainer profile error:', error);
    res.status(500).json({ error: 'Failed to update trainer profile' });
}
});

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

import { Request, Response } from 'express';
import AchievementModel from '../models/Achievement';

class AchievementController {
    // Get all achievements
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const achievements = await AchievementModel.getAll();
            res.json(achievements);
        } catch (error) {
            console.error('Error fetching achievements:', error);
            res.status(500).json({ error: 'Failed to fetch achievements' });
        }
    }

    // Get user's earned achievements
    async getUserAchievements(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;

            // Allow users to see their own achievements, or admins/trainers to see others
            if (req.user?.id !== userId &&
                !req.user?.roles?.includes('admin') &&
                !req.user?.roles?.includes('trainer')) {
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }

            const achievements = await AchievementModel.getByUserId(userId);
            res.json(achievements);
        } catch (error) {
            console.error('Error fetching user achievements:', error);
            res.status(500).json({ error: 'Failed to fetch user achievements' });
        }
    }

    // Check for new achievements (usually internal, but exposed for testing/manual triggers)
    async checkAchievements(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            const { type, value } = req.body;

            if (req.user?.id !== userId && !req.user?.roles?.includes('admin')) {
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }

            const newAwards = await AchievementModel.checkAndAward(userId, type, value);
            res.json({ new_awards: newAwards });
        } catch (error) {
            console.error('Error checking achievements:', error);
            res.status(500).json({ error: 'Failed to check achievements' });
        }
    }
}

export default new AchievementController();

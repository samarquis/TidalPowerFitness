import express from 'express';
import AchievementController from '../controllers/achievementController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes (or authenticated for all users)
router.use(authenticate);

// Get available achievements
router.get('/', AchievementController.getAll);

// Get user's earned achievements
router.get('/:userId', AchievementController.getUserAchievements);

// Check/Trigger achievements (Admin only for manual trigger, or system usage)
router.post('/users/:userId/check', AchievementController.checkAchievements);

export default router;

import express from 'express';
import leaderboardController from '../controllers/leaderboardController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/volume', leaderboardController.getVolumeLeaderboard);
router.get('/attendance', leaderboardController.getAttendanceLeaderboard);
router.get('/exercise/:exerciseId', leaderboardController.getExerciseLeaderboard);

export default router;

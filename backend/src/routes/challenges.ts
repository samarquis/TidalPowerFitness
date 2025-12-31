import express from 'express';
import challengeController from '../controllers/challengeController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', challengeController.getChallenges);
router.get('/:id', challengeController.getChallenge);
router.post('/:id/join', challengeController.joinChallenge);

// Trainer/Admin only
router.post('/', authorize('trainer', 'admin'), challengeController.createChallenge);

export default router;

import express from 'express';
import workoutSessionController from '../controllers/workoutSessionController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// specific client routes (authenticated, self-access check in controller)
router.get('/client/:clientId/history', workoutSessionController.getClientHistory);
router.get('/client/:clientId/stats', workoutSessionController.getClientStats);

// Trainer/Admin only routes
router.use(authorize('trainer', 'admin'));

router.get('/', workoutSessionController.getSessions);
router.get('/:id', workoutSessionController.getSession);
router.get('/:id/logs', workoutSessionController.getSessionLogs);
router.post('/', workoutSessionController.createSession);
router.put('/:id', workoutSessionController.updateSession);
router.post('/:id/publish', workoutSessionController.publishSession);

// Exercise logging
router.post('/log-exercise', workoutSessionController.logExercise);
router.post('/log-exercises/bulk', workoutSessionController.bulkLogExercises);

export default router;

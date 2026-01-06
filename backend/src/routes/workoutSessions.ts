import express from 'express';
import workoutSessionController from '../controllers/workoutSessionController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// specific client routes (authenticated, self-access check in controller)
router.get('/client/:clientId/history', workoutSessionController.getClientHistory);
router.get('/client/:clientId/history/:exerciseId', workoutSessionController.getExerciseHistory);
router.get('/client/:clientId/stats', workoutSessionController.getClientStats);
router.get('/client/:clientId/logs', workoutSessionController.getSessionLogs);

// Shared routes (authenticated)
router.get('/', workoutSessionController.getSessions);
router.get('/:id', workoutSessionController.getSession);
router.put('/:id', workoutSessionController.updateSession);

// Trainer/Admin only routes
router.use(authorize('trainer', 'admin'));

// Create sessions
router.post('/', workoutSessionController.createSession);

// Exercise logging
router.post('/log-exercise', workoutSessionController.logExercise);
router.post('/log-exercises/bulk', workoutSessionController.bulkLogExercises);

// Attendance marking
router.post('/:sessionId/attendance/:clientId', workoutSessionController.markAttendance);

export default router;

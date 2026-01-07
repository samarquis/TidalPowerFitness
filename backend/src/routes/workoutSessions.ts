import express from 'express';
import workoutSessionController from '../controllers/workoutSessionController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, createSessionValidation, bulkLogValidation } from '../middleware/validation';

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

// Create sessions - Allow Clients to start their own workouts
router.post('/', createSessionValidation, validate, workoutSessionController.createSession);

// Exercise logging - Allow Clients to log for themselves
router.post('/log-exercise', workoutSessionController.logExercise);     
router.post('/log-exercises/bulk', bulkLogValidation, validate, workoutSessionController.bulkLogExercises);

// Trainer/Admin only routes
router.use(authorize('trainer', 'admin'));

// Attendance marking
router.post('/:sessionId/attendance/:clientId', workoutSessionController.markAttendance);

export default router;

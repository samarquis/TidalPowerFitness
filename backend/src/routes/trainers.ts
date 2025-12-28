import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import trainerController from '../controllers/trainerController';

const router = express.Router();

// Get all users with trainer role (admin only - for class management dropdown)
router.get('/users', authenticate, authorize('admin'), trainerController.getTrainerUsers);

// Create new trainer (admin only)
router.post('/', authenticate, authorize('admin'), trainerController.createTrainer);

// Get all active trainers (public)
router.get('/', trainerController.getTrainers);

// Get all classes for the logged-in trainer (trainer, admin)
router.get('/my-classes', authenticate, authorize('trainer', 'admin'), trainerController.getMyClasses);

// Get all clients who have attended trainer's classes
router.get('/my-clients', authenticate, authorize('trainer', 'admin'), trainerController.getMyClients);

// Get workout history for a specific client (trainer must have taught them)
router.get('/clients/:clientId/workouts', authenticate, authorize('trainer', 'admin'), trainerController.getClientWorkouts);

// Get trainer by user ID (public)
router.get('/:userId', trainerController.getTrainer);

// Update trainer profile (trainer or admin)
router.put('/:userId', authenticate, authorize('trainer', 'admin'), trainerController.updateTrainer);

// Delete trainer profile (admin only)
router.delete('/:userId', authenticate, authorize('admin'), trainerController.deleteTrainer);

// Attendance report (trainer or admin)
router.get('/reports/attendance', authenticate, authorize('trainer', 'admin'), trainerController.getAttendanceReport);

// Analytics report (trainer or admin)
router.get('/reports/analytics', authenticate, authorize('trainer', 'admin'), trainerController.getTrainerAnalytics);

export default router;

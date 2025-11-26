import express from 'express';
import exerciseController from '../controllers/exerciseController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes - anyone can view exercises
router.get('/', exerciseController.getExercises);
router.get('/workout-types', exerciseController.getWorkoutTypes);
router.get('/body-focus-areas', exerciseController.getBodyFocusAreas);
router.get('/:id', exerciseController.getExercise);

// Trainer/Admin only routes - Exercises
router.post('/', authenticate, authorize('trainer', 'admin'), exerciseController.createExercise);
router.put('/:id', authenticate, authorize('trainer', 'admin'), exerciseController.updateExercise);
router.delete('/:id', authenticate, authorize('admin'), exerciseController.deleteExercise);

// Admin only routes - Body Focus Areas
router.post('/body-focus-areas', authenticate, authorize('admin'), exerciseController.createBodyFocusArea);
router.put('/body-focus-areas/:id', authenticate, authorize('admin'), exerciseController.updateBodyFocusArea);
router.delete('/body-focus-areas/:id', authenticate, authorize('admin'), exerciseController.deleteBodyFocusArea);

// Admin only routes - Workout Types
router.post('/workout-types', authenticate, authorize('admin'), exerciseController.createWorkoutType);
router.put('/workout-types/:id', authenticate, authorize('admin'), exerciseController.updateWorkoutType);
router.delete('/workout-types/:id', authenticate, authorize('admin'), exerciseController.deleteWorkoutType);

export default router;

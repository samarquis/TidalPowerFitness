import express from 'express';
import exerciseController from '../controllers/exerciseController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes - anyone can view exercises
router.get('/', exerciseController.getExercises);
router.get('/workout-types', exerciseController.getWorkoutTypes);
router.get('/body-focus-areas', exerciseController.getBodyFocusAreas);
router.get('/:id', exerciseController.getExercise);

// Trainer/Admin only routes
router.post('/', authenticate, authorize(['trainer', 'admin']), exerciseController.createExercise);
router.put('/:id', authenticate, authorize(['trainer', 'admin']), exerciseController.updateExercise);
router.delete('/:id', authenticate, authorize(['admin']), exerciseController.deleteExercise);

export default router;

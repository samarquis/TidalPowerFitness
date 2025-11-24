const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes - anyone can view exercises
router.get('/', exerciseController.default.getExercises);
router.get('/workout-types', exerciseController.default.getWorkoutTypes);
router.get('/body-focus-areas', exerciseController.default.getBodyFocusAreas);
router.get('/:id', exerciseController.default.getExercise);

// Trainer/Admin only routes
router.post('/', authenticate, authorize('trainer', 'admin'), exerciseController.default.createExercise);
router.put('/:id', authenticate, authorize('trainer', 'admin'), exerciseController.default.updateExercise);
router.delete('/:id', authenticate, authorize('admin'), exerciseController.default.deleteExercise);

module.exports = router;
export default router;

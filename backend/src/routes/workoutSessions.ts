const express = require('express');
const router = express.Router();
const workoutSessionController = require('../controllers/workoutSessionController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require trainer/admin authentication
router.use(authenticate);
router.use(authorize('trainer', 'admin'));

router.get('/', workoutSessionController.default.getSessions);
router.get('/:id', workoutSessionController.default.getSession);
router.post('/', workoutSessionController.default.createSession);
router.post('/:id/publish', workoutSessionController.default.publishSession);

// Exercise logging
router.post('/log-exercise', workoutSessionController.default.logExercise);
router.post('/log-exercises/bulk', workoutSessionController.default.bulkLogExercises);

module.exports = router;
export default router;

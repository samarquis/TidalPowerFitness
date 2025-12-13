const express = require('express');
const router = express.Router();
const workoutSessionController = require('../controllers/workoutSessionController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// specific client routes (authenticated, self-access check in controller)
router.get('/client/:clientId/history', workoutSessionController.default.getClientHistory);
router.get('/client/:clientId/stats', workoutSessionController.default.getClientStats);

// Trainer/Admin only routes
router.use(authorize('trainer', 'admin'));

router.get('/', workoutSessionController.default.getSessions);
router.get('/:id', workoutSessionController.default.getSession);
router.post('/', workoutSessionController.default.createSession);
router.put('/:id', workoutSessionController.default.updateSession);
router.post('/:id/publish', workoutSessionController.default.publishSession);

// Exercise logging
router.post('/log-exercise', workoutSessionController.default.logExercise);
router.post('/log-exercises/bulk', workoutSessionController.default.bulkLogExercises);

module.exports = router;
export default router;

import express from 'express';
import classController from '../controllers/classController';
import { authenticate, authorize } from '../middleware/auth';
import { createClassValidation, validate } from '../middleware/validation';

const router = express.Router();

// Public routes
router.get('/', classController.getClasses);
router.get('/:id', classController.getClass);

// Get attendees for a class (trainers and admins)
router.get('/:id/attendees', authenticate, classController.getClassAttendees);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), createClassValidation, validate, classController.createClass);
router.put('/:id', authenticate, authorize('admin'), classController.updateClass);
router.delete('/:id', authenticate, authorize('admin'), classController.deleteClass);

export default router;


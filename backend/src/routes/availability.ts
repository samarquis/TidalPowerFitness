import express from 'express';
import availabilityController from '../controllers/availabilityController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public route - get trainer availability
router.get('/trainer/:trainerId', availabilityController.getTrainerAvailability);

// Protected routes - trainer/admin only
router.post('/', authenticate, availabilityController.createAvailability);
router.put('/:id', authenticate, availabilityController.updateAvailability);
router.delete('/:id', authenticate, availabilityController.deleteAvailability);

export default router;

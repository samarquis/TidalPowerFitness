import express from 'express';
import importController from '../controllers/importController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Admin only - trigger exercise import
router.post('/exercises', authenticate, authorize('admin'), importController.importExercises);

// Admin only - check import status
router.get('/status', authenticate, authorize('admin'), importController.checkStatus);

export default router;

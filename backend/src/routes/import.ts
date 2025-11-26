import express from 'express';
import importController from '../controllers/importController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Admin only - trigger exercise import
router.post('/exercises', authenticate, authorize('admin'), importController.importExercises);

export default router;

import express from 'express';
import packageController from '../controllers/packageController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', packageController.getPackages);
router.get('/:id', packageController.getPackage);

// Admin only routes
router.post('/', authenticate, authorize('admin'), packageController.createPackage);
router.put('/:id', authenticate, authorize('admin'), packageController.updatePackage);
router.delete('/:id', authenticate, authorize('admin'), packageController.deletePackage);

export default router;

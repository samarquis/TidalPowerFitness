import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as adminController from '../controllers/adminController';

const router = express.Router();

// All admin routes require admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/settings', adminController.getSettings);
router.put('/settings/:key', adminController.updateSetting);

// Reports
router.get('/reports/revenue', authenticate, authorize('admin'), adminController.getRevenueReport);
router.get('/reports/trainer-performance', authenticate, authorize('admin'), adminController.getTrainerPerformanceReport);

export default router;

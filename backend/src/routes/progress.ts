import express from 'express';
import progressController from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Metric logging
router.post('/metrics', progressController.logMetric);
router.get('/metrics', progressController.getMetrics);
router.get('/metrics/:clientId', progressController.getMetrics);

// Personal Records
router.get('/personal-records', progressController.getPersonalRecords);
router.get('/personal-records/:clientId', progressController.getPersonalRecords);

// Volume Trend
router.get('/volume-trend', progressController.getVolumeTrend);
router.get('/volume-trend/:clientId', progressController.getVolumeTrend);

export default router;


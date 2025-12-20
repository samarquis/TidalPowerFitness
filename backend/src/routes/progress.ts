const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Metric logging
router.post('/metrics', progressController.default.logMetric);
router.get('/metrics/:clientId?', progressController.default.getMetrics);

// Personal Records
router.get('/personal-records/:clientId?', progressController.default.getPersonalRecords);

module.exports = router;
export default router;

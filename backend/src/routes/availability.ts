const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { authenticate, authorize } = require('../middleware/auth');

// Public route - get trainer availability
router.get('/trainer/:trainerId', availabilityController.default.getTrainerAvailability);

// Protected routes - trainer/admin only
router.post('/', authenticate, availabilityController.default.createAvailability);
router.put('/:id', authenticate, availabilityController.default.updateAvailability);
router.delete('/:id', authenticate, availabilityController.default.deleteAvailability);

module.exports = router;
export default router;

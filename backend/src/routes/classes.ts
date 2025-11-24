const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', classController.default.getClasses);
router.get('/:id', classController.default.getClass);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), classController.default.createClass);
router.put('/:id', authenticate, authorize('admin'), classController.default.updateClass);
router.delete('/:id', authenticate, authorize('admin'), classController.default.deleteClass);

module.exports = router;
export default router;

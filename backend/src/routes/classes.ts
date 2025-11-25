const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', classController.getClasses);
router.get('/:id', classController.getClass);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), classController.createClass);
router.put('/:id', authenticate, authorize('admin'), classController.updateClass);
router.delete('/:id', authenticate, authorize('admin'), classController.deleteClass);

module.exports = router;
export default router;

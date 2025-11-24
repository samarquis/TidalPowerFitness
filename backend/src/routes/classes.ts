const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', classController.default.getClasses);
router.get('/:id', classController.default.getClass);

// Admin-only routes
router.post('/', authenticateToken, requireRole(['admin']), classController.default.createClass);
router.put('/:id', authenticateToken, requireRole(['admin']), classController.default.updateClass);
router.delete('/:id', authenticateToken, requireRole(['admin']), classController.default.deleteClass);

module.exports = router;
export default router;

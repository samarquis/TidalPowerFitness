const express = require('express');
const router = express.Router();
const workoutTemplateController = require('../controllers/workoutTemplateController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require trainer/admin authentication
router.use(authenticate);
router.use(authorize('trainer', 'admin'));

router.get('/', workoutTemplateController.default.getTemplates);
router.get('/:id', workoutTemplateController.default.getTemplate);
router.post('/', workoutTemplateController.default.createTemplate);
router.post('/:id/copy', workoutTemplateController.default.copyTemplate);
router.delete('/:id', workoutTemplateController.default.deleteTemplate);

module.exports = router;
export default router;

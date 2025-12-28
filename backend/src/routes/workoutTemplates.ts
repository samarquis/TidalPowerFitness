import express from 'express';
import workoutTemplateController from '../controllers/workoutTemplateController';
import { authenticate, authorize } from '../middleware/auth';
import { createTemplateValidation, validate } from '../middleware/validation';

const router = express.Router();

// All routes require trainer/admin authentication
router.use(authenticate);
router.use(authorize('trainer', 'admin'));

router.get('/', workoutTemplateController.getTemplates);
router.get('/:id', workoutTemplateController.getTemplate);
router.post('/', createTemplateValidation, validate, workoutTemplateController.createTemplate);
router.post('/:id/copy', workoutTemplateController.copyTemplate);
router.delete('/:id', workoutTemplateController.deleteTemplate);

export default router;
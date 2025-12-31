import express from 'express';
import programController from '../controllers/programController';
import { authenticate, authorize } from '../middleware/auth';
import { createProgramValidation, assignProgramValidation, validate } from '../middleware/validation';

const router = express.Router();

// Public routes
router.get('/public', programController.getPublicPrograms);

// All other routes require authentication
router.use(authenticate);

// Client-specific route
router.get('/my-active', programController.getMyActiveProgram);
router.get('/active/:clientId', authorize('trainer', 'admin'), programController.getClientActiveProgram);

// Trainer/Admin routes
router.get('/', authorize('trainer', 'admin'), programController.getPrograms);
router.get('/:id', authorize('trainer', 'admin'), programController.getProgram);
router.post('/', authorize('trainer', 'admin'), createProgramValidation, validate, programController.createProgram);
router.post('/assign', authorize('trainer', 'admin'), assignProgramValidation, validate, programController.assignProgram);

// Collaborators
router.post('/:id/collaborators', authorize('trainer', 'admin'), programController.addCollaborator);
router.delete('/:id/collaborators/:trainerId', authorize('trainer', 'admin'), programController.removeCollaborator);

export default router;

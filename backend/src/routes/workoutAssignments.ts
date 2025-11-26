import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
    getClientsForAssignment,
    getClassesForAssignment,
    assignWorkout
} from '../controllers/workoutAssignmentController';

const router = express.Router();

// All routes require trainer authentication
router.use(authenticate);
router.use(authorize('trainer', 'admin'));

// Get clients for assignment
router.get('/clients', getClientsForAssignment);

// Get classes for assignment (optionally filtered by day)
router.get('/classes', getClassesForAssignment);

// Assign workout
router.post('/assign', assignWorkout);

export default router;

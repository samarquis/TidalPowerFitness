import express from 'express';
import { createDemoUsers, deleteDemoUsers, listDemoUsers } from '../controllers/DemoUserController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

// POST /api/demo-users - Create demo users
router.post('/', createDemoUsers);

// GET /api/demo-users - List all demo users
router.get('/', listDemoUsers);

// DELETE /api/demo-users - Delete all demo users
router.delete('/', deleteDemoUsers);

export default router;

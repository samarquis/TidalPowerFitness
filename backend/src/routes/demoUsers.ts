import express from 'express';
import { createDemoUsers, deleteDemoUsers, listDemoUsers } from '../controllers/DemoUserController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

// Chain methods for the root path
router.route('/')
  .post(createDemoUsers)
  .get(listDemoUsers)
  .delete(deleteDemoUsers);

export default router;


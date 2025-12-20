import express from 'express';
import { getChangelogs, createChangelog, updateChangelog, deleteChangelog } from '../controllers/changelogController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Publicly accessible list (shows only published if not admin)
router.get('/', optionalAuth, getChangelogs);

// Admin-only management routes
router.post('/', authenticate, authorize('admin'), createChangelog);
router.put('/:id', authenticate, authorize('admin'), updateChangelog);
router.delete('/:id', authenticate, authorize('admin'), deleteChangelog);

export default router;

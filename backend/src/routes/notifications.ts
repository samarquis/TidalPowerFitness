import express from 'express';
import { authenticate } from '../middleware/auth';
import NotificationService from '../services/NotificationService';

const router = express.Router();

router.use(authenticate);

// Get unread notifications for current user
router.get('/unread', async (req: any, res: any) => {
    try {
        const notifications = await NotificationService.getUnread(req.user.id);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Mark notification as read
router.post('/:id/read', async (req: any, res: any) => {
    try {
        await NotificationService.markAsRead(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

export default router;

import express, { Request, Response } from 'express';
import User from '../models/User';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { role } = req.query;

        let users;
        if (role && typeof role === 'string') {
            users = await User.findByRole(role as 'client' | 'trainer' | 'admin');
        } else {
            // Get all active users
            const clients = await User.findByRole('client');
            const trainers = await User.findByRole('trainer');
            const admins = await User.findByRole('admin');
            users = [...clients, ...trainers, ...admins];
        }

        // Remove password hashes from response
        const sanitizedUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            role: user.role,
            is_active: user.is_active,
            created_at: user.created_at,
        }));

        res.status(200).json({ users: sanitizedUsers });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
        res.status(200).json({ message: 'User deactivated successfully' });
    } catch (error) {
        console.error('Deactivate user error:', error);
        res.status(500).json({ error: 'Failed to deactivate user' });
    }
});

export default router;

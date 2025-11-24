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
    }
});

// Update user role (admin only)
router.patch('/:id/role', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['client', 'trainer', 'admin'].includes(role)) {
            res.status(400).json({ error: 'Invalid role. Must be client, trainer, or admin' });
            return;
        }

        const updatedUser = await User.update(id, { role });

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'User role updated successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                role: updatedUser.role,
                is_active: updatedUser.is_active,
            },
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Toggle user activation (admin only)
router.patch('/:id/activate', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (typeof is_active !== 'boolean') {
            res.status(400).json({ error: 'is_active must be a boolean' });
            return;
        }

        const updatedUser = await User.update(id, { is_active });

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({
            message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                role: updatedUser.role,
                is_active: updatedUser.is_active,
            },
        });
    } catch (error) {
        console.error('Toggle activation error:', error);
        res.status(500).json({ error: 'Failed to toggle user activation' });
    }
});

// Deactivate user (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const success = await User.delete(id);

        if (!success) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User deactivated successfully' });
    } catch (error) {
        console.error('Deactivate user error:', error);
        res.status(500).json({ error: 'Failed to deactivate user' });
    }
});

export default router;

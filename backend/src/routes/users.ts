import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { authenticate, authorize } from '../middleware/auth';
import UserCreditModel from '../models/UserCredit';

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
            roles: user.roles,
            is_active: user.is_active,
            created_at: user.created_at,
        }));

        res.status(200).json({ users: sanitizedUsers });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// Add role to user (admin only)
router.post('/:id/roles', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['client', 'trainer', 'admin'].includes(role)) {
            res.status(400).json({ error: 'Invalid role. Must be client, trainer, or admin' });
            return;
        }

        const updatedUser = await User.addRole(id, role);

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found or role already assigned' });
            return;
        }

        res.status(200).json({
            message: 'Role added successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                roles: updatedUser.roles,
                is_active: updatedUser.is_active,
            },
        });
    } catch (error) {
        console.error('Add role error:', error);
        res.status(500).json({ error: 'Failed to add role' });
    }
});

// Remove role from user (admin only)
router.delete('/:id/roles/:role', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, role } = req.params;

        if (!['client', 'trainer', 'admin'].includes(role)) {
            res.status(400).json({ error: 'Invalid role. Must be client, trainer, or admin' });
            return;
        }

        const updatedUser = await User.removeRole(id, role);

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Prevent removing all roles
        if (updatedUser.roles.length === 0) {
            await User.addRole(id, 'client'); // Add client role back as default
            res.status(400).json({ error: 'Cannot remove all roles. User must have at least one role.' });
            return;
        }

        res.status(200).json({
            message: 'Role removed successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                roles: updatedUser.roles,
                is_active: updatedUser.is_active,
            },
        });
    } catch (error) {
        console.error('Remove role error:', error);
        res.status(500).json({ error: 'Failed to remove role' });
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

// Reset user password (admin only)
router.post('/:id/reset-password', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            res.status(400).json({ error: 'Password must be at least 6 characters long' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const updatedUser = await User.update(id, { password_hash } as any); // Type cast as password_hash is not in UpdateUserInput interface but is in DB

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// Get user credits
router.get('/:id/credits', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Allow users to view their own credits, or admins/trainers to view any
        if (req.user!.id !== id && !req.user!.roles.includes('admin') && !req.user!.roles.includes('trainer')) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        const credits = await UserCreditModel.getUserCredits(id);
        const totalCredits = credits.reduce((sum, credit) => sum + credit.remaining_credits, 0);

        res.status(200).json({
            credits: totalCredits,
            details: credits
        });
    } catch (error) {
        console.error('Get user credits error:', error);
        res.status(500).json({ error: 'Failed to get user credits' });
    }
});

export default router;

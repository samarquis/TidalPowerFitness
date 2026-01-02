import { Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import UserCreditModel from '../models/UserCredit';
import { AuthenticatedRequest } from '../types/auth';

class UserController {
    // Get all users (admin only)
    async getAllUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    }

    // Add role to user (admin only)
    async addUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    }

    // Remove role from user (admin only)
    async removeUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    }

    // Toggle user activation (admin only)
    async toggleUserActivation(req: AuthenticatedRequest, res: Response): Promise<void> {
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
                    roles: updatedUser.roles,
                    is_active: updatedUser.is_active,
                },
            });
        } catch (error) {
            console.error('Toggle activation error:', error);
            res.status(500).json({ error: 'Failed to toggle user activation' });
        }
    }

    // Deactivate user (admin only)
    async deactivateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    }

    // Reset user password (admin only)
    async resetUserPassword(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { password } = req.body;

            if (!password || password.length < 6) {
                res.status(400).json({ error: 'Password must be at least 6 characters long' });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            const updatedUser = await User.update(id, { password_hash } as any);

            if (!updatedUser) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({ error: 'Failed to reset password' });
        }
    }

    // Impersonate user (admin only)
    async impersonateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const adminId = req.user!.id;

            // Prevent impersonating yourself
            if (id === adminId) {
                res.status(400).json({ error: 'Cannot impersonate yourself' });
                return;
            }

            const user = await User.findById(id);

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Generate impersonation token
            const token = generateToken({
                id: user.id,
                userId: user.id,
                email: user.email,
                roles: user.roles,
                is_demo_mode_enabled: false,
                impersonatedBy: adminId
            });

            // Set cookie
            const isProduction = process.env.NODE_ENV === 'production';
            const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';

            res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction && !isLocalhost,
                sameSite: (isProduction && !isLocalhost) ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/',
            });

            res.status(200).json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    roles: user.roles
                }
            });
        } catch (error) {
            console.error('Impersonation error:', error);
            res.status(500).json({ error: 'Failed to impersonate user' });
        }
    }

    // Get user credits
    async getUserCredits(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    }
}

export default new UserController();

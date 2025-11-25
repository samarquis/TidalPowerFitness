import express, { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/password';

const router = express.Router();

// ONE-TIME SETUP: Create Scott as admin
// This endpoint should be removed after first use
router.post('/create-admin', async (req: Request, res: Response): Promise<void> => {
    try {
        const { secret } = req.body;

        // Simple security check
        if (secret !== 'TidalPower2024Setup') {
            res.status(403).json({ error: 'Invalid secret' });
            return;
        }

        // Check if Scott already exists
        const existing = await User.findByEmail('samarquis4@gmail.com');

        if (existing) {
            // Delete existing user first
            await User.delete(existing.id);
            console.log('Deleted existing user');
        }

        // Create new admin user with new password
        const password_hash = await hashPassword('SaSj1996#4');

        const user = await User.create({
            email: 'samarquis4@gmail.com',
            password_hash,
            first_name: 'Scott',
            last_name: 'Marquis',
            role: 'admin',
            phone: '555-0001'
        });

        res.status(201).json({
            message: 'Admin user created successfully',
            user: {
                email: user.email,
                role: user.role
            },
            tempPassword: 'SaSj1996#4'
        });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ error: 'Setup failed' });
    }
});

export default router;

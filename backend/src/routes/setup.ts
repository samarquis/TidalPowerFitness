import express, { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/password';
import { query } from '../config/db';

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
            // Hard delete existing user first
            await User.hardDelete(existing.id);
            console.log('Deleted existing user');
        }

        // Create new admin user with new password
        const password_hash = await hashPassword('SaSj1996#4');

        const user = await User.create({
            email: 'samarquis4@gmail.com',
            password_hash,
            first_name: 'Scott',
            last_name: 'Marquis',
            roles: ['admin'],
            phone: '555-0001'
        });

        res.status(201).json({
            message: 'Admin user created successfully',
            user: {
                email: user.email,
                roles: user.roles
            },
            tempPassword: 'SaSj1996#4'
        });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ error: 'Setup failed' });
    }
});

// ONE-TIME MIGRATION: Add multi-role support
router.post('/migrate-roles', async (req: Request, res: Response): Promise<void> => {
    try {
        const { secret } = req.body;

        // Simple security check
        if (secret !== 'TidalPower2024Setup') {
            res.status(403).json({ error: 'Invalid secret' });
            return;
        }

        const steps: string[] = [];

        // Step 1: Add roles column if it doesn't exist
        try {
            await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS roles TEXT[]');
            steps.push('✅ Added roles column');
        } catch (error) {
            steps.push('⚠️ Roles column may already exist');
        }

        // Step 2: Migrate existing data
        const migrateResult = await query(`
            UPDATE users 
            SET roles = ARRAY[role::TEXT] 
            WHERE roles IS NULL OR array_length(roles, 1) IS NULL
        `);
        steps.push(`✅ Migrated ${migrateResult.rowCount || 0} users to roles array`);

        // Step 3: Set default
        await query(`ALTER TABLE users ALTER COLUMN roles SET DEFAULT ARRAY['client']::TEXT[]`);
        steps.push('✅ Set default roles value');

        // Step 4: Add index
        await query('CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles)');
        steps.push('✅ Created roles index');

        // Step 5: Verify
        const verifyResult = await query('SELECT id, email, first_name, last_name, role, roles FROM users LIMIT 5');
        steps.push(`✅ Verified migration - found ${verifyResult.rows.length} users`);

        res.status(200).json({
            message: 'Migration completed successfully',
            steps,
            sampleUsers: verifyResult.rows.map(u => ({
                email: u.email,
                name: `${u.first_name} ${u.last_name}`,
                oldRole: u.role,
                newRoles: u.roles
            }))
        });
    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({
            error: 'Migration failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;

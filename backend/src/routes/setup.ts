import express, { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/password';
import { query } from '../config/db';

const router = express.Router();
const SETUP_SECRET = 'TidalPower2024Setup';

// Initialize all database tables
router.post('/init-tables', async (req: Request, res: Response) => {
    try {
        const { secret } = req.body;

        if (secret !== SETUP_SECRET) {
            return res.status(403).json({ error: 'Invalid secret' });
        }

        console.log('Initializing database tables...');

        // Create classes table
        await query(`
            CREATE TABLE IF NOT EXISTS classes (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(200) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
                instructor_name VARCHAR(200),
                day_of_week INTEGER NOT NULL,
                start_time TIME NOT NULL,
                duration_minutes INTEGER NOT NULL DEFAULT 45,
                max_capacity INTEGER DEFAULT 20,
                price_cents INTEGER DEFAULT 1200,
                is_active BOOLEAN DEFAULT true,
                acuity_appointment_type_id VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Classes table created');

        // Create trainer_profiles table
        await query(`
            CREATE TABLE IF NOT EXISTS trainer_profiles (
                user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                bio TEXT,
                specialties TEXT[],
                certifications TEXT[],
                years_experience INTEGER,
                profile_image_url TEXT,
                acuity_calendar_id VARCHAR(100),
                is_accepting_clients BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Trainer profiles table created');

        // Create trainer_availability table
        await query(`
            CREATE TABLE IF NOT EXISTS trainer_availability (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(trainer_id, day_of_week, start_time)
            )
        `);
        console.log('✅ Trainer availability table created');

        // Create workout-related tables
        await query(`
            CREATE TABLE IF NOT EXISTS workout_types (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Workout types table created');

        await query(`
            CREATE TABLE IF NOT EXISTS workout_templates (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                workout_type_id UUID REFERENCES workout_types(id) ON DELETE SET NULL,
                estimated_duration_minutes INTEGER,
                difficulty_level VARCHAR(50),
                is_public BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Workout templates table created');

        res.json({
            message: 'Database tables initialized successfully',
            tables: [
                'classes',
                'trainer_profiles',
                'trainer_availability',
                'workout_types',
                'workout_templates'
            ]
        });

    } catch (error: any) {
        console.error('Error initializing tables:', error);
        res.status(500).json({
            error: 'Failed to initialize tables',
            details: error.message
        });
    }
});

// ONE-TIME SETUP: Create Scott as admin
router.post('/create-admin', async (req: Request, res: Response): Promise<void> => {
    try {
        const { secret } = req.body;

        if (secret !== SETUP_SECRET) {
            res.status(403).json({ error: 'Invalid secret' });
            return;
        }

        const existing = await User.findByEmail('samarquis4@gmail.com');

        if (existing) {
            await User.hardDelete(existing.id);
            console.log('Deleted existing user');
        }

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

        if (secret !== SETUP_SECRET) {
            res.status(403).json({ error: 'Invalid secret' });
            return;
        }

        const steps: string[] = [];

        try {
            await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS roles TEXT[]');
            steps.push('✅ Added roles column');
        } catch (error) {
            steps.push('⚠️ Roles column may already exist');
        }

        const migrateResult = await query(`
            UPDATE users 
            SET roles = ARRAY[role::TEXT] 
            WHERE roles IS NULL OR array_length(roles, 1) IS NULL
        `);
        steps.push(`✅ Migrated ${migrateResult.rowCount || 0} users to roles array`);

        await query(`ALTER TABLE users ALTER COLUMN roles SET DEFAULT ARRAY['client']::TEXT[]`);
        steps.push('✅ Set default roles value');

        await query('CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles)');
        steps.push('✅ Created roles index');

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

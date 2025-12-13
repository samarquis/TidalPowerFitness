import express, { Request, Response } from 'express';
import TrainerProfile from '../models/TrainerProfile';
import UserModel from '../models/User';
import { authenticate, authorize } from '../middleware/auth';
import trainerController from '../controllers/trainerController';
import { pool } from '../config/db';

const router = express.Router();

// Get all users with trainer role (admin only - for class management dropdown)
router.get('/users', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
    try {
        const trainers = await UserModel.findByRole('trainer');

        // Return only necessary fields for the dropdown
        const trainerList = trainers.map(trainer => ({
            id: trainer.id,
            first_name: trainer.first_name,
            last_name: trainer.last_name,
            email: trainer.email,
            full_name: `${trainer.first_name} ${trainer.last_name}`
        }));

        res.status(200).json(trainerList);
    } catch (error) {
        console.error('Get trainer users error:', error);
        res.status(500).json({ error: 'Failed to get trainer users' });
    }
});

// Create new trainer (admin only)
router.post('/', authenticate, authorize('admin'), trainerController.createTrainer);

// Get all active trainers (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        // Get all users with trainer role
        const trainerUsers = await UserModel.findByRole('trainer');

        // Build trainer list with profile data where available
        const trainers = await Promise.all(
            trainerUsers.map(async (user) => {
                const profile = await TrainerProfile.findByUserId(user.id);

                if (profile) {
                    // Return full profile with user data
                    return {
                        ...profile,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone
                    };
                } else {
                    // Return basic trainer info with default profile values
                    return {
                        id: `temp-${user.id}`, // Temporary ID to indicate no profile
                        user_id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone,
                        bio: 'Profile not yet completed',
                        specialties: [],
                        certifications: [],
                        years_experience: 0,
                        is_accepting_clients: false,
                        profile_image_url: null,
                        created_at: new Date(),
                        updated_at: new Date()
                    };
                }
            })
        );

        // Filter to only show accepting clients or those with completed profiles
        // Actually, let's show all trainers so Scott appears
        res.status(200).json({ trainers });
    } catch (error) {
        console.error('Get trainers error:', error);
        res.status(500).json({ error: 'Failed to get trainers' });
    }
});

// Get all classes for the logged-in trainer (trainer, admin)
router.get('/my-classes', authenticate, authorize('trainer', 'admin'), trainerController.getMyClasses);

// Get all clients who have attended trainer's classes
router.get('/my-clients', authenticate, authorize('trainer', 'admin'), async (req: any, res: Response): Promise<void> => {
    try {
        const trainerId = req.user.id;

        const result = await pool.query(`
            SELECT DISTINCT
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                COUNT(DISTINCT cp.id) as total_bookings,
                MAX(cp.booking_date) as last_booking_date
            FROM users u
            JOIN class_participants cp ON u.id = cp.user_id
            JOIN classes c ON cp.class_id = c.id
            WHERE c.instructor_id = $1
                AND cp.status = 'confirmed'
            GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone
            ORDER BY MAX(cp.booking_date) DESC
        `, [trainerId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching trainer clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});

// Get workout history for a specific client (trainer must have taught them)
router.get('/clients/:clientId/workouts', authenticate, authorize('trainer', 'admin'), async (req: any, res: Response): Promise<void> => {
    try {
        const trainerId = req.user.id;
        const { clientId } = req.params;

        // Verify trainer has taught this client (skip check for admins)
        if (!req.user.roles.includes('admin')) {
            const accessCheck = await pool.query(`
                SELECT 1 FROM class_participants cp
                JOIN classes c ON cp.class_id = c.id
                WHERE c.instructor_id = $1 AND cp.user_id = $2
                LIMIT 1
            `, [trainerId, clientId]);

            if (accessCheck.rows.length === 0) {
                res.status(403).json({ error: 'You do not have access to this client' });
                return;
            }
        }

        // Get workout sessions where client participated
        const result = await pool.query(`
            SELECT 
                ws.id,
                ws.session_date,
                ws.start_time,
                ws.notes,
                wt.name as workout_type_name,
                c.name as class_name,
                COUNT(DISTINCT se.id) as exercise_count
            FROM workout_sessions ws
            JOIN session_participants sp ON ws.id = sp.session_id
            LEFT JOIN workout_types wt ON ws.workout_type_id = wt.id
            LEFT JOIN classes c ON ws.class_id = c.id
            LEFT JOIN session_exercises se ON ws.id = se.session_id
            WHERE sp.client_id = $1
            GROUP BY ws.id, ws.session_date, ws.start_time, ws.notes, wt.name, c.name
            ORDER BY ws.session_date DESC, ws.start_time DESC
        `, [clientId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching client workouts:', error);
        res.status(500).json({ error: 'Failed to fetch client workouts' });
    }
});

// Get trainer by user ID (public)
router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const trainer = await TrainerProfile.findByUserId(userId);

        if (!trainer) {
            res.status(404).json({ error: 'Trainer not found' });
            return;
        }

        res.status(200).json({ trainer });
    } catch (error) {
        console.error('Get trainer error:', error);
        res.status(500).json({ error: 'Failed to get trainer' });
    }
});

// Update trainer profile (trainer or admin)
router.put('/:userId', authenticate, authorize('trainer', 'admin'), trainerController.updateTrainer);

// Delete trainer profile (admin only)
router.delete('/:userId', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const success = await TrainerProfile.delete(userId);

        if (!success) {
            res.status(404).json({ error: 'Trainer profile not found' });
            return;
        }

        res.status(200).json({ message: 'Trainer profile deleted successfully' });
    } catch (error) {
        console.error('Delete trainer profile error:', error);
        res.status(500).json({ error: 'Failed to delete trainer profile' });
    }
});

export default router;

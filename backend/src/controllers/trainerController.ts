import { Request, Response } from 'express';
import UserModel from '../models/User';
import TrainerProfile from '../models/TrainerProfile';
import { hashPassword } from '../utils/password';
import { AuthenticatedRequest } from '../types/auth';
import { getClassesByInstructorId } from '../models/Class';
import pool from '../config/db';

class TrainerController {
    // Get all users with trainer role (admin only - for class management dropdown)
    async getTrainerUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    }

    // Get all trainers (public view)
    async getTrainers(req: Request, res: Response): Promise<void> {
        try {
            // Get all users with trainer role
            const trainerUsers = await UserModel.findByRole('trainer');

            // Build trainer list with profile data where available
            const trainers = await Promise.all(
                trainerUsers.map(async (user) => {
                    const profile = await TrainerProfile.findByUserId(user.id);

                    if (profile) {
                        return {
                            ...profile,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            phone: user.phone
                        };
                    } else {
                        return {
                            id: `temp-${user.id}`,
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

            res.status(200).json(trainers);
        } catch (error) {
            console.error('Get trainers error:', error);
            res.status(500).json({ error: 'Failed to get trainers' });
        }
    }

    // Create a new trainer (and user if needed)
    async createTrainer(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const {
                email,
                password,
                first_name,
                last_name,
                phone,
                user_id,
                bio,
                specialties,
                certifications,
                years_experience,
                profile_image_url,
                acuity_calendar_id,
                is_accepting_clients
            } = req.body;

            let targetUserId = user_id;

            if (!targetUserId) {
                if (!email || !password || !first_name || !last_name) {
                    res.status(400).json({ error: 'Missing required user fields' });
                    return;
                }

                const existingUser = await UserModel.findByEmail(email);
                if (existingUser) {
                    res.status(400).json({ error: 'User with this email already exists' });
                    return;
                }

                const password_hash = await hashPassword(password);

                const newUser = await UserModel.create({
                    email,
                    password_hash,
                    first_name,
                    last_name,
                    phone,
                    roles: ['trainer']
                });
                targetUserId = newUser.id;
            } else {
                const user = await UserModel.findById(targetUserId);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }

                if (!user.roles.includes('trainer')) {
                    await UserModel.addRole(targetUserId, 'trainer');
                }
            }

            const existingProfile = await TrainerProfile.findByUserId(targetUserId);
            if (existingProfile) {
                res.status(400).json({ error: 'Trainer profile already exists for this user' });
                return;
            }

            const trainerProfile = await TrainerProfile.create({
                user_id: targetUserId,
                bio,
                specialties,
                certifications,
                years_experience,
                profile_image_url,
                acuity_calendar_id,
                is_accepting_clients: is_accepting_clients ?? true
            });

            res.status(201).json({
                message: 'Trainer created successfully',
                trainer: {
                    ...trainerProfile,
                    first_name: first_name || (await UserModel.findById(targetUserId))?.first_name,
                    last_name: last_name || (await UserModel.findById(targetUserId))?.last_name
                }
            });

        } catch (error) {
            console.error('Error creating trainer:', error);
            res.status(500).json({ error: 'Failed to create trainer' });
        }
    }

    // Update trainer profile (and user details)
    async updateTrainer(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const {
                first_name,
                last_name,
                phone,
                bio,
                specialties,
                certifications,
                years_experience,
                profile_image_url,
                acuity_calendar_id,
                is_accepting_clients
            } = req.body;

            if (!req.user?.roles?.includes('admin') && req.user?.id !== userId) {
                res.status(403).json({ error: 'Unauthorized to update this profile' });
                return;
            }

            if (first_name || last_name || phone) {
                await UserModel.update(userId, {
                    first_name,
                    last_name,
                    phone
                });
            }

            const trainer = await TrainerProfile.update(userId, {
                bio,
                specialties,
                certifications,
                years_experience,
                profile_image_url,
                acuity_calendar_id,
                is_accepting_clients
            });

            if (!trainer) {
                const newTrainer = await TrainerProfile.create({
                    user_id: userId,
                    bio,
                    specialties,
                    certifications,
                    years_experience,
                    profile_image_url,
                    acuity_calendar_id,
                    is_accepting_clients: is_accepting_clients ?? true
                });

                const updatedUser = await UserModel.findById(userId);

                res.status(200).json({
                    message: 'Trainer profile created successfully',
                    trainer: {
                        ...newTrainer,
                        first_name: updatedUser?.first_name,
                        last_name: updatedUser?.last_name,
                        email: updatedUser?.email,
                        phone: updatedUser?.phone
                    }
                });
                return;
            }

            const updatedUser = await UserModel.findById(userId);

            res.status(200).json({
                message: 'Trainer updated successfully',
                trainer: {
                    ...trainer,
                    first_name: updatedUser?.first_name,
                    last_name: updatedUser?.last_name,
                    email: updatedUser?.email,
                    phone: updatedUser?.phone
                }
            });

        } catch (error) {
            console.error('Error updating trainer:', error);
            res.status(500).json({ error: 'Failed to update trainer' });
        }
    }

    // Get all classes for the logged-in trainer
    async getMyClasses(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const trainerId = req.user?.id;
            if (!trainerId) {
                res.status(400).json({ error: 'Trainer ID not found in token' });
                return;
            }

            // Fetch classes with real-time attendee counts
            const result = await pool.query(`
                SELECT 
                    c.*,
                    COALESCE(attendee_counts.count, 0)::int as attendee_count
                FROM classes c
                LEFT JOIN (
                    SELECT class_id, SUM(attendee_count) as count
                    FROM class_participants
                    WHERE status = 'confirmed'
                    GROUP BY class_id
                ) attendee_counts ON c.id = attendee_counts.class_id
                WHERE c.instructor_id = $1 AND c.is_active = true
                ORDER BY c.day_of_week, c.start_time
            `, [trainerId]);

            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching trainer classes:', error);
            res.status(500).json({ error: 'Failed to fetch classes' });
        }
    }

    // Get all clients who have attended trainer's classes
    async getMyClients(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const trainerId = req.user!.id;

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
    }

    // Get workout history for a specific client (trainer must have taught them)
    async getClientWorkouts(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const trainerId = req.user!.id;
            const { clientId } = req.params;

            if (!req.user!.roles.includes('admin')) {
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
    }

    // Get trainer by user ID
    async getTrainer(req: Request, res: Response): Promise<void> {
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
    }

    // Delete trainer profile (admin only)
    async deleteTrainer(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    }

    // Get attendance report for a trainer
    async getAttendanceReport(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const trainerId = req.user!.id;
            const { start_date, end_date } = req.query;

            // Default to last 30 days if not provided
            const end = end_date ? new Date(end_date as string) : new Date();
            const start = start_date ? new Date(start_date as string) : new Date();
            if (!start_date) start.setDate(start.getDate() - 30);

            const result = await pool.query(`
                SELECT 
                    c.id as class_id,
                    c.name as class_name,
                    c.start_time,
                    cp.target_date,
                    COUNT(cp.id) as booking_count,
                    SUM(cp.attendee_count) as total_attendees
                FROM classes c
                JOIN class_participants cp ON c.id = cp.class_id
                WHERE c.instructor_id = $1
                    AND cp.status = 'confirmed'
                    AND cp.target_date BETWEEN $2 AND $3
                GROUP BY c.id, c.name, c.start_time, cp.target_date
                ORDER BY cp.target_date DESC, c.start_time DESC
            `, [trainerId, start, end]);

            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching attendance report:', error);
            res.status(500).json({ error: 'Failed to fetch attendance report' });
        }
    }

    // Get analytics for a trainer
    async getTrainerAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const trainerId = req.user!.id;

            // 1. Most popular classes (by average attendance)
            const popularClasses = await pool.query(`
                SELECT 
                    c.name,
                    AVG(cp_count.count) as avg_attendance,
                    COUNT(DISTINCT cp_count.target_date) as session_count
                FROM classes c
                JOIN (
                    SELECT class_id, target_date, SUM(attendee_count) as count
                    FROM class_participants
                    WHERE status = 'confirmed'
                    GROUP BY class_id, target_date
                ) cp_count ON c.id = cp_count.class_id
                WHERE c.instructor_id = $1
                GROUP BY c.id, c.name
                ORDER BY avg_attendance DESC
                LIMIT 5
            `, [trainerId]);

            // 2. Most used exercises
            const popularExercises = await pool.query(`
                SELECT 
                    e.name,
                    COUNT(se.id) as use_count
                FROM exercises e
                JOIN session_exercises se ON e.id = se.exercise_id
                JOIN workout_sessions ws ON se.session_id = ws.id
                WHERE ws.trainer_id = $1
                GROUP BY e.id, e.name
                ORDER BY use_count DESC
                LIMIT 10
            `, [trainerId]);

            res.json({
                popular_classes: popularClasses.rows,
                popular_exercises: popularExercises.rows
            });
        } catch (error) {
            console.error('Error fetching trainer analytics:', error);
            res.status(500).json({ error: 'Failed to fetch analytics' });
        }
    }
}

export default new TrainerController();

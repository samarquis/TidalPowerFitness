import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import WorkoutSession from '../models/WorkoutSession';
import Program from '../models/Program';
import ProgramService from '../services/ProgramService';
import { AchievementService } from '../services/AchievementService';

class WorkoutSessionController {
    // Get all sessions for trainer (or all for admin)
    async getSessions(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const isAdmin = req.user?.roles?.includes('admin');
            const isTrainer = req.user?.roles?.includes('trainer');

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const filters = {
                start_date: req.query.start_date ? new Date(req.query.start_date as string) : undefined,
                end_date: req.query.end_date ? new Date(req.query.end_date as string) : undefined,
                class_id: req.query.class_id as string
            };

            let sessions;
            if (isAdmin) {
                sessions = await WorkoutSession.getAll(filters);
            } else if (isTrainer) {
                sessions = await WorkoutSession.getByTrainer(userId, filters);
            } else {
                // For clients, return their own history
                sessions = await WorkoutSession.getClientHistory(userId);
            }

            res.json(sessions);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            res.status(500).json({ error: 'Failed to fetch sessions' });
        }
    }

    // Get session by ID
    async getSession(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const session = await WorkoutSession.getById(req.params.id);

            if (!session) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }

            res.json(session);
        } catch (error) {
            console.error('Error fetching session:', error);
            res.status(500).json({ error: 'Failed to fetch session' });
        }
    }

    // Create new session
    async createSession(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const sessionData = {
                ...req.body,
                trainer_id: (req.user?.roles?.includes('admin') && req.body.trainer_id)
                    ? req.body.trainer_id
                    : req.user?.id
            };

            const session = await WorkoutSession.create(sessionData);
            res.status(201).json(session);
        } catch (error) {
            console.error('Error creating session:', error);
            res.status(500).json({ error: 'Failed to create session' });
        }
    }

    // Update session
    async updateSession(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;
            const userId = req.user?.id;
            const isAdmin = req.user?.roles?.includes('admin');

            // Fetch session to verify ownership/participation
            const session = await WorkoutSession.getById(id);

            if (!session) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }

            // Check permissions:
            // 1. Admin
            // 2. Trainer who owns the session
            // 3. Client who is a participant in the session
            const isTrainer = session.trainer_id === userId;
            const isParticipant = session.participants?.some((p: any) => p.user_id === userId);

            if (!isAdmin && !isTrainer && !isParticipant) {
                res.status(403).json({
                    error: 'Forbidden - you do not have permission to update this session'
                });
                return;
            }

            const updatedSession = await WorkoutSession.update(id, updates);

            if (!updatedSession) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }

            // --- PROGRAM PROGRESS LOGIC ---
            // If session is being completed (end_time set) and linked to an assignment
            if (updates.end_time && updatedSession.program_assignment_id) {
                try {
                    await ProgramService.advanceClientProgress(updatedSession.program_assignment_id);
                } catch (progError) {
                    console.error('Error advancing program progress:', progError);
                    // Don't fail the whole request, but log the error
                }
            }

            res.json(updatedSession);
        } catch (error) {
            console.error('Error updating session:', error);
            res.status(500).json({ error: 'Failed to update session' });
        }
    }

    // Log exercise set
    async logExercise(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const logData = {
                ...req.body,
                logged_by: req.user?.id
            };

            const log = await WorkoutSession.logExercise(logData);

            // Award achievements after a single log
            if (logData.client_id) {
                AchievementService.checkAndAwardAchievements(logData.client_id);
            }

            res.status(201).json(log);
        } catch (error) {
            console.error('Error logging exercise:', error);
            res.status(500).json({ error: 'Failed to log exercise' });
        }
    }

    // Get logs for a specific session
    async getSessionLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const logs = await WorkoutSession.getSessionLogs(id);
            res.json(logs);
        } catch (error) {
            console.error('Error fetching session logs:', error);
            res.status(500).json({ error: 'Failed to fetch session logs' });
        }
    }

    // Bulk log exercises
    async bulkLogExercises(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { logs } = req.body;

            if (!Array.isArray(logs) || logs.length === 0) {
                res.status(400).json({ error: 'Logs must be a non-empty array' });
                return;
            }

            const results = [];
            for (const logData of logs) {
                const log = await WorkoutSession.logExercise({
                    ...logData,
                    logged_by: req.user?.id
                });
                results.push(log);
            }

            // After all logs are processed, check for achievements for the user.
            const workoutUserId = logs[0]?.client_id;
            if (workoutUserId) {
                AchievementService.checkAndAwardAchievements(workoutUserId);
            }

            res.status(201).json(results);
        } catch (error) {
            console.error('Error bulk logging exercises:', error);
            res.status(500).json({ error: 'Failed to bulk log exercises' });
        }
    }

    // Publish session to clients
    async publishSession(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const success = await WorkoutSession.publish(req.params.id);

            if (!success) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }

            res.json({ message: 'Session published successfully' });
        } catch (error) {
            console.error('Error publishing session:', error);
            res.status(500).json({ error: 'Failed to publish session' });
        }
    }

    // Get exercise history for a client
    async getClientHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const clientId = req.params.clientId;

            // Authorization check: User can only see their own history unless they are trainer/admin
            if (req.user?.id !== clientId &&
                !req.user?.roles?.includes('trainer') &&
                !req.user?.roles?.includes('admin')) {
                res.status(403).json({ error: 'Unauthorized to view this history' });
                return;
            }

            const history = await WorkoutSession.getClientHistory(clientId);
            res.json(history);
        } catch (error) {
            console.error('Error fetching client history:', error);
            res.status(500).json({ error: 'Failed to fetch client history' });
        }
    }

    // Get own history
    async getMyHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const clientId = req.user?.id;
            if (!clientId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const history = await WorkoutSession.getClientHistory(clientId);
            res.json(history);
        } catch (error) {
            console.error('Error fetching my history:', error);
            res.status(500).json({ error: 'Failed to fetch history' });
        }
    }

    // Get specific exercise history for a client
    async getExerciseHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { clientId, exerciseId } = req.params;

            // Authorization check
            if (req.user?.id !== clientId &&
                !req.user?.roles?.includes('trainer') &&
                !req.user?.roles?.includes('admin')) {
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }

            const history = await WorkoutSession.getExerciseHistory(clientId, exerciseId);
            res.json(history);
        } catch (error) {
            console.error('Error fetching exercise history:', error);
            res.status(500).json({ error: 'Failed to fetch exercise history' });
        }
    }

    // Get workout stats for a client
    async getClientStats(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const clientId = req.params.clientId;

            // Authorization check
            if (req.user?.id !== clientId &&
                !req.user?.roles?.includes('trainer') &&
                !req.user?.roles?.includes('admin')) {
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }

            const stats = await WorkoutSession.getClientStats(clientId);
            res.json(stats);
        } catch (error) {
            console.error('Error fetching client stats:', error);
            res.status(500).json({ error: 'Failed to fetch client stats' });
        }
    }

    // Mark attendance for a session participant
    async markAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { sessionId, clientId } = req.params;
            const { attended } = req.body;
            const trainerId = req.user?.id;

            if (typeof attended !== 'boolean') {
                res.status(400).json({ error: 'Attended status must be a boolean' });
                return;
            }

            // TODO: Add authorization check to ensure the logged-in user (trainer) is allowed to mark attendance for this session.

            const updatedParticipant = await WorkoutSession.markAttendance(sessionId, clientId, attended);

            if (!updatedParticipant) {
                res.status(404).json({ error: 'Session participant not found' });
                return;
            }

            // Check for achievements after marking attendance
            if (attended) {
                await AchievementService.checkAndAwardAchievements(clientId);
            }

            res.json(updatedParticipant);

        } catch (error) {
            console.error('Error marking attendance:', error);
            res.status(500).json({ error: 'Failed to mark attendance' });
        }
    }
}

export default new WorkoutSessionController();

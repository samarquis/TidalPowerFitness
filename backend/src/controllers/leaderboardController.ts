import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { query } from '../config/db';

class LeaderboardController {
    /**
     * Get volume-based leaderboard (Sum of Weight * Reps)
     */
    async getVolumeLeaderboard(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { period = 'month' } = req.query; // 'week', 'month', 'year', 'all'
            
            let dateFilter = '';
            if (period === 'week') dateFilter = "AND logged_at >= CURRENT_DATE - INTERVAL '7 days'";
            else if (period === 'month') dateFilter = "AND logged_at >= CURRENT_DATE - INTERVAL '30 days'";
            else if (period === 'year') dateFilter = "AND logged_at >= CURRENT_DATE - INTERVAL '365 days'";

            const sql = `
                SELECT 
                    u.id as user_id,
                    u.first_name,
                    u.last_name,
                    SUM(el.weight_used_lbs * el.reps_completed) as total_volume
                FROM exercise_logs el
                JOIN users u ON el.client_id = u.id
                WHERE el.weight_used_lbs > 0 
                  AND el.reps_completed > 0
                  ${dateFilter}
                GROUP BY u.id, u.first_name, u.last_name
                ORDER BY total_volume DESC
                LIMIT 20
            `;

            const result = await query(sql);
            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching volume leaderboard:', error);
            res.status(500).json({ error: 'Failed to fetch volume leaderboard' });
        }
    }

    /**
     * Get attendance-based leaderboard
     */
    async getAttendanceLeaderboard(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { period = 'month' } = req.query;
            
            let dateFilter = '';
            if (period === 'week') dateFilter = "AND target_date >= CURRENT_DATE - INTERVAL '7 days'";
            else if (period === 'month') dateFilter = "AND target_date >= CURRENT_DATE - INTERVAL '30 days'";
            else if (period === 'year') dateFilter = "AND target_date >= CURRENT_DATE - INTERVAL '365 days'";

            const sql = `
                SELECT 
                    u.id as user_id,
                    u.first_name,
                    u.last_name,
                    COUNT(cp.id) as classes_attended
                FROM class_participants cp
                JOIN users u ON cp.user_id = u.id
                WHERE cp.status = 'confirmed' 
                  AND cp.attended = true
                  ${dateFilter}
                GROUP BY u.id, u.first_name, u.last_name
                ORDER BY classes_attended DESC
                LIMIT 20
            `;

            const result = await query(sql);
            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching attendance leaderboard:', error);
            res.status(500).json({ error: 'Failed to fetch attendance leaderboard' });
        }
    }

    /**
     * Get exercise-specific leaderboard (Max Weight)
     */
    async getExerciseLeaderboard(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { exerciseId } = req.params;
            
            if (!exerciseId) {
                res.status(400).json({ error: 'Exercise ID is required' });
                return;
            }

            const sql = `
                SELECT 
                    u.id as user_id,
                    u.first_name,
                    u.last_name,
                    MAX(el.weight_used_lbs) as max_weight
                FROM exercise_logs el
                JOIN users u ON el.client_id = u.id
                JOIN session_exercises se ON el.session_exercise_id = se.id
                WHERE se.exercise_id = $1
                  AND el.weight_used_lbs > 0
                GROUP BY u.id, u.first_name, u.last_name
                ORDER BY max_weight DESC
                LIMIT 20
            `;

            const result = await query(sql, [exerciseId]);
            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching exercise leaderboard:', error);
            res.status(500).json({ error: 'Failed to fetch exercise leaderboard' });
        }
    }
}

export default new LeaderboardController();

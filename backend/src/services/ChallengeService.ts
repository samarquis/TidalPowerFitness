import { query } from '../config/db';
import ChallengeModel from '../models/Challenge';
import logger from '../utils/logger';

class ChallengeService {
    /**
     * Recalculates and updates progress for all active challenges for a user.
     */
    async updateUserProgress(userId: string): Promise<void> {
        try {
            // 1. Find all active challenges this user is participating in
            const activeChallenges = await query(
                `SELECT c.* 
                 FROM challenges c
                 JOIN challenge_participants cp ON c.id = cp.challenge_id
                 WHERE cp.user_id = $1 AND c.end_date >= CURRENT_DATE`,
                [userId]
            );

            for (const challenge of activeChallenges.rows) {
                let progress = 0;

                // 2. Calculate progress based on challenge type
                if (challenge.type === 'total_workouts') {
                    const res = await query(
                        `SELECT COUNT(*) as count 
                         FROM workout_sessions ws
                         JOIN session_participants sp ON ws.id = sp.session_id
                         WHERE sp.client_id = $1 
                           AND ws.session_date BETWEEN $2 AND $3`,
                        [userId, challenge.start_date, challenge.end_date]
                    );
                    progress = parseInt(res.rows[0].count);
                } else if (challenge.type === 'total_volume') {
                    const res = await query(
                        `SELECT SUM(el.weight_used_lbs * el.reps_completed) as volume
                         FROM exercise_logs el
                         JOIN session_exercises se ON el.session_exercise_id = se.id
                         JOIN workout_sessions ws ON se.session_id = ws.id
                         WHERE el.client_id = $1 
                           AND ws.session_date BETWEEN $2 AND $3`,
                        [userId, challenge.start_date, challenge.end_date]
                    );
                    progress = parseFloat(res.rows[0].volume || 0);
                } else if (challenge.type === 'max_weight') {
                    const res = await query(
                        `SELECT MAX(el.weight_used_lbs) as weight
                         FROM exercise_logs el
                         JOIN session_exercises se ON el.session_exercise_id = se.id
                         JOIN workout_sessions ws ON se.session_id = ws.id
                         WHERE el.client_id = $1 
                           AND ws.session_date BETWEEN $2 AND $3`,
                        [userId, challenge.start_date, challenge.end_date]
                    );
                    progress = parseFloat(res.rows[0].weight || 0);
                }

                // 3. Update the progress in DB
                await ChallengeModel.updateProgress(challenge.id, userId, progress);
            }
        } catch (error) {
            logger.error(`Error updating challenge progress for user ${userId}:`, error);
        }
    }
}

export default new ChallengeService();

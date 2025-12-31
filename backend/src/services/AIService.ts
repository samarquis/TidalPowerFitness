import { query } from '../config/db';
import logger from '../utils/logger';

class AIService {
    /**
     * Recommends exercises for a user based on their recent volume and body focus gaps.
     */
    async recommendExercises(userId: string): Promise<any[]> {
        try {
            // 1. Get volume distribution by body focus in the last 30 days
            const volumeSql = `
                SELECT 
                    bfa.name as focus_area,
                    SUM(el.weight_used_lbs * el.reps_completed) as total_volume
                FROM exercise_logs el
                JOIN session_exercises se ON el.session_exercise_id = se.id
                JOIN exercises e ON se.exercise_id = e.id
                JOIN body_focus_areas bfa ON e.primary_muscle_group = bfa.id
                WHERE el.client_id = $1 
                  AND el.logged_at >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY bfa.name
            `;
            const volumeRes = await query(volumeSql, [userId]);
            const distribution = volumeRes.rows;

            // 2. Identify "under-trained" areas (areas with low or zero volume)
            const allFocusAreas = await query('SELECT name, id FROM body_focus_areas');
            
            const gaps = allFocusAreas.rows.filter(fa => 
                !distribution.find(d => d.focus_area === fa.name)
            );

            // 3. Recommend 3 top-rated or popular exercises from those gaps
            if (gaps.length > 0) {
                const targetAreaId = gaps[0].id;
                const recSql = `
                    SELECT e.*, bfa.name as muscle_group_name
                    FROM exercises e
                    JOIN body_focus_areas bfa ON e.primary_muscle_group = bfa.id
                    WHERE e.primary_muscle_group = $1
                      AND e.is_active = true
                    ORDER BY RANDOM()
                    LIMIT 3
                `;
                const recRes = await query(recSql, [targetAreaId]);
                return recRes.rows;
            }

            // Fallback: Recommend based on least trained area
            if (distribution.length > 0) {
                const leastTrained = [...distribution].sort((a, b) => a.total_volume - b.total_volume)[0];
                const areaRes = await query('SELECT id FROM body_focus_areas WHERE name = $1', [leastTrained.focus_area]);
                const areaId = areaRes.rows[0].id;

                const recSql = `
                    SELECT e.*, bfa.name as muscle_group_name
                    FROM exercises e
                    JOIN body_focus_areas bfa ON e.primary_muscle_group = bfa.id
                    WHERE e.primary_muscle_group = $1
                      AND e.is_active = true
                    ORDER BY RANDOM()
                    LIMIT 3
                `;
                const recRes = await query(recSql, [areaId]);
                return recRes.rows;
            }

            return [];
        } catch (error) {
            logger.error(`Error generating AI recommendations for ${userId}:`, error);
            return [];
        }
    }
}

export default new AIService();

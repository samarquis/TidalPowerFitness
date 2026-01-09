import { query } from '../config/db';
import NotificationService, { NotificationType } from '../services/NotificationService';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon_url: string;
    criteria_type: string;
    criteria_value: number;
    created_at: Date;
}

export interface UserAchievement extends Achievement {
    earned_at: Date;
}

class AchievementModel {
    // Get all available achievements
    async getAll(): Promise<Achievement[]> {
        const result = await query('SELECT * FROM achievements ORDER BY criteria_value ASC');
        return result.rows;
    }

    // Get achievements earned by a user
    async getByUserId(userId: string): Promise<UserAchievement[]> {
        const sql = `
            SELECT a.*, ua.earned_at
            FROM achievements a
            JOIN user_achievements ua ON a.id = ua.achievement_id
            WHERE ua.user_id = $1
            ORDER BY ua.earned_at DESC
        `;
        const result = await query(sql, [userId]);
        return result.rows;
    }

    // Check and award achievements based on stats
    async checkAndAward(userId: string, type: string, value: number): Promise<Achievement[]> {
        // Find unearned achievements that match criteria
        const sql = `
            SELECT a.*
            FROM achievements a
            WHERE a.criteria_type = $1
            AND a.criteria_value <= $2
            AND NOT EXISTS (
                SELECT 1 FROM user_achievements ua 
                WHERE ua.achievement_id = a.id 
                AND ua.user_id = $3
            )
        `;

        const potentialAchievements = await query(sql, [type, value, userId]);
        const newAwards: Achievement[] = [];

        for (const achievement of potentialAchievements.rows) {
            await query(
                'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)',
                [userId, achievement.id]
            );
            newAwards.push(achievement);

            // Send notification for new achievement
            try {
                await NotificationService.notify({
                    user_id: userId,
                    type: NotificationType.ACHIEVEMENT,
                    title: `New Achievement: ${achievement.name}!`,
                    message: achievement.description,
                    delivery_method: 'both' as any // Using 'both' for achievements
                });
            } catch (notifyError) {
                console.error(`Failed to notify user ${userId} of achievement ${achievement.name}:`, notifyError);
            }
        }

        return newAwards;
    }
}

export default new AchievementModel();

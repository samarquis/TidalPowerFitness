import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface UserSubscription {
    id: string;
    user_id: string;
    package_id: string;
    square_subscription_id?: string;
    status: 'active' | 'cancelled' | 'past_due' | 'paused';
    current_period_start?: Date;
    current_period_end?: Date;
    cancel_at_period_end: boolean;
    created_at: Date;
    updated_at: Date;
}

class SubscriptionModel {
    // Get active subscription for user
    async getActiveByUserId(userId: string): Promise<UserSubscription | null> {
        const result: QueryResult = await query(
            `SELECT us.*, p.name as package_name, p.price_cents
             FROM user_subscriptions us
             JOIN packages p ON us.package_id = p.id
             WHERE us.user_id = $1 AND us.status IN ('active', 'past_due')
             ORDER BY us.created_at DESC
             LIMIT 1`,
            [userId]
        );
        return result.rows[0] || null;
    }

    // Create or Update subscription (upsert based on square_subscription_id)
    async upsert(data: Partial<UserSubscription>): Promise<UserSubscription> {
        const {
            user_id,
            package_id,
            square_subscription_id,
            status,
            current_period_start,
            current_period_end,
            cancel_at_period_end
        } = data;

        const result: QueryResult = await query(
            `INSERT INTO user_subscriptions (
                user_id, package_id, square_subscription_id, status, 
                current_period_start, current_period_end, cancel_at_period_end
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (square_subscription_id) 
            DO UPDATE SET 
                status = EXCLUDED.status,
                current_period_start = EXCLUDED.current_period_start,
                current_period_end = EXCLUDED.current_period_end,
                cancel_at_period_end = EXCLUDED.cancel_at_period_end,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *`,
            [
                user_id,
                package_id,
                square_subscription_id,
                status,
                current_period_start,
                current_period_end,
                cancel_at_period_end
            ]
        );

        return result.rows[0];
    }

    // Sync with Square (placeholder for actual API call)
    async updateStatus(squareSubscriptionId: string, status: string): Promise<void> {
        await query(
            'UPDATE user_subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE square_subscription_id = $2',
            [status, squareSubscriptionId]
        );
    }
}

export default new SubscriptionModel();

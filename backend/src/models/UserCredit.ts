import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface UserCredit {
    id: string;
    user_id: string;
    package_id?: string;
    credits_total: number;
    credits_remaining: number;
    purchased_at: Date;
    expires_at?: Date;
    created_at: Date;
    updated_at: Date;
}

class UserCreditModel {
    // Get user's active credits
    async getUserCredits(userId: string): Promise<UserCredit[]> {
        const result: QueryResult = await query(
            `SELECT * FROM user_credits 
             WHERE user_id = $1 
             AND credits_remaining > 0 
             AND (expires_at IS NULL OR expires_at > NOW())
             ORDER BY expires_at ASC`, // Use expiring credits first
            [userId]
        );
        return result.rows;
    }

    // Add credits to user
    async addCredits(userId: string, packageId: string, credits: number, durationDays?: number): Promise<UserCredit> {
        let expiresAt = null;
        if (durationDays) {
            const date = new Date();
            date.setDate(date.getDate() + durationDays);
            expiresAt = date;
        }

        const result: QueryResult = await query(
            `INSERT INTO user_credits (
                user_id, package_id, credits_total, credits_remaining, expires_at
            ) VALUES ($1, $2, $3, $3, $4)
            RETURNING *`,
            [userId, packageId, credits, expiresAt]
        );
        return result.rows[0];
    }

    // Deduct credit from user
    // This logic is complex: we need to find the oldest expiring credit and deduct from it
    async deductCredit(userId: string, amount: number = 1): Promise<boolean> {
        // 1. Get available credits ordered by expiration
        const credits = await this.getUserCredits(userId);

        if (credits.reduce((sum, c) => sum + c.credits_remaining, 0) < amount) {
            return false; // Insufficient funds
        }

        let remainingToDeduct = amount;

        for (const credit of credits) {
            if (remainingToDeduct <= 0) break;

            const deductAmount = Math.min(credit.credits_remaining, remainingToDeduct);

            await query(
                'UPDATE user_credits SET credits_remaining = credits_remaining - $1 WHERE id = $2',
                [deductAmount, credit.id]
            );

            remainingToDeduct -= deductAmount;
        }

        return true;
    }
}

export default new UserCreditModel();

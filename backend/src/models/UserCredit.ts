import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface UserCredit {
    id: string;
    user_id: string;
    package_id?: string;
    total_credits: number;
    remaining_credits: number;
    purchase_date: Date;
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
             AND remaining_credits > 0 
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
                user_id, package_id, total_credits, remaining_credits, expires_at
            ) VALUES ($1, $2, $3, $3, $4)
            RETURNING *`,
            [userId, packageId, credits, expiresAt]
        );
        return result.rows[0];
    }

    // Deduct credit from user
    // This logic is complex: we need to find the oldest expiring credit and deduct from it
    // Hardened with row-level locking (FOR UPDATE) to prevent race conditions
    async deductCredit(userId: string, amount: number = 1, transactionClient?: any): Promise<boolean> {
        const db = transactionClient || { query };
        
        // 1. Get available credits ordered by expiration, with a row lock
        const result: QueryResult = await db.query(
            `SELECT * FROM user_credits 
             WHERE user_id = $1 
             AND remaining_credits > 0 
             AND (expires_at IS NULL OR expires_at > NOW())
             ORDER BY expires_at ASC
             FOR UPDATE`, // Row-level lock
            [userId]
        );
        const credits = result.rows;

        if (credits.reduce((sum, c) => sum + (c.remaining_credits || 0), 0) < amount) {
            return false; // Insufficient funds
        }

        let remainingToDeduct = amount;

        for (const credit of credits) {
            if (remainingToDeduct <= 0) break;

            const deductAmount = Math.min(credit.remaining_credits, remainingToDeduct);

            await db.query(
                'UPDATE user_credits SET remaining_credits = remaining_credits - $1 WHERE id = $2',
                [deductAmount, credit.id]
            );

            remainingToDeduct -= deductAmount;
        }

        return true;
    }
}

export default new UserCreditModel();

import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface Challenge {
    id: string;
    trainer_id: string;
    name: string;
    description?: string;
    start_date: Date;
    end_date: Date;
    type: 'total_volume' | 'total_workouts' | 'max_weight';
    goal_value?: number;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ChallengeParticipant {
    challenge_id: string;
    user_id: string;
    joined_at: Date;
    current_progress: number;
    is_completed: boolean;
}

class ChallengeModel {
    // Get all active/upcoming challenges
    async getAllActive(): Promise<Challenge[]> {
        const result = await query(
            `SELECT c.*, u.first_name || ' ' || u.last_name as trainer_name,
                    COUNT(cp.user_id) as participant_count
             FROM challenges c
             JOIN users u ON c.trainer_id = u.id
             LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id
             WHERE c.end_date >= CURRENT_DATE AND c.is_public = true
             GROUP BY c.id, u.first_name, u.last_name
             ORDER BY c.start_date ASC`
        );
        return result.rows;
    }

    // Get challenge by ID with leaderboard
    async getById(id: string): Promise<any | null> {
        const result = await query(
            `SELECT c.*, u.first_name || ' ' || u.last_name as trainer_name
             FROM challenges c
             JOIN users u ON c.trainer_id = u.id
             WHERE c.id = $1`,
            [id]
        );

        if (result.rows.length === 0) return null;
        const challenge = result.rows[0];

        // Get participants leaderboard
        const participantsResult = await query(
            `SELECT cp.*, u.first_name, u.last_name
             FROM challenge_participants cp
             JOIN users u ON cp.user_id = u.id
             WHERE cp.challenge_id = $1
             ORDER BY cp.current_progress DESC
             LIMIT 50`,
            [id]
        );

        challenge.participants = participantsResult.rows;
        return challenge;
    }

    // Join a challenge
    async join(challengeId: string, userId: string): Promise<void> {
        await query(
            'INSERT INTO challenge_participants (challenge_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [challengeId, userId]
        );
    }

    // Update participant progress
    async updateProgress(challengeId: string, userId: string, progress: number): Promise<void> {
        const challengeResult = await query('SELECT goal_value FROM challenges WHERE id = $1', [challengeId]);
        const goal = parseFloat(challengeResult.rows[0]?.goal_value || 0);
        const isCompleted = goal > 0 && progress >= goal;

        await query(
            `UPDATE challenge_participants 
             SET current_progress = $1, is_completed = $2 
             WHERE challenge_id = $3 AND user_id = $4`,
            [progress, isCompleted, challengeId, userId]
        );
    }

    // Create challenge
    async create(data: Partial<Challenge>): Promise<Challenge> {
        const result = await query(
            `INSERT INTO challenges (trainer_id, name, description, start_date, end_date, type, goal_value, is_public)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [data.trainer_id, data.name, data.description, data.start_date, data.end_date, data.type, data.goal_value, data.is_public ?? true]
        );
        return result.rows[0];
    }
}

export default new ChallengeModel();

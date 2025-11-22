import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface TrainerProfile {
    id: string;
    user_id: string;
    bio?: string;
    specialties?: string[];
    certifications?: string[];
    years_experience?: number;
    profile_image_url?: string;
    acuity_calendar_id?: string;
    is_accepting_clients: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTrainerProfileInput {
    user_id: string;
    bio?: string;
    specialties?: string[];
    certifications?: string[];
    years_experience?: number;
    profile_image_url?: string;
    acuity_calendar_id?: string;
    is_accepting_clients?: boolean;
}

export interface UpdateTrainerProfileInput {
    bio?: string;
    specialties?: string[];
    certifications?: string[];
    years_experience?: number;
    profile_image_url?: string;
    acuity_calendar_id?: string;
    is_accepting_clients?: boolean;
}

class TrainerProfileModel {
    // Create trainer profile
    async create(profileData: CreateTrainerProfileInput): Promise<TrainerProfile> {
        const {
            user_id,
            bio,
            specialties,
            certifications,
            years_experience,
            profile_image_url,
            acuity_calendar_id,
            is_accepting_clients = true
        } = profileData;

        const result: QueryResult = await query(
            `INSERT INTO trainer_profiles 
       (user_id, bio, specialties, certifications, years_experience, profile_image_url, acuity_calendar_id, is_accepting_clients)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [user_id, bio, specialties, certifications, years_experience, profile_image_url, acuity_calendar_id, is_accepting_clients]
        );

        return result.rows[0];
    }

    // Find trainer profile by user ID
    async findByUserId(userId: string): Promise<TrainerProfile | null> {
        const result: QueryResult = await query(
            'SELECT * FROM trainer_profiles WHERE user_id = $1',
            [userId]
        );

        return result.rows[0] || null;
    }

    // Get all active trainers
    async getAllActive(): Promise<TrainerProfile[]> {
        const result: QueryResult = await query(
            `SELECT tp.*, u.first_name, u.last_name, u.email, u.phone
       FROM trainer_profiles tp
       JOIN users u ON tp.user_id = u.id
       WHERE tp.is_accepting_clients = true AND u.is_active = true
       ORDER BY u.first_name, u.last_name`
        );

        return result.rows;
    }

    // Get all trainers (including inactive)
    async getAll(): Promise<TrainerProfile[]> {
        const result: QueryResult = await query(
            `SELECT tp.*, u.first_name, u.last_name, u.email, u.phone
       FROM trainer_profiles tp
       JOIN users u ON tp.user_id = u.id
       WHERE u.is_active = true
       ORDER BY u.first_name, u.last_name`
        );

        return result.rows;
    }

    // Update trainer profile
    async update(userId: string, profileData: UpdateTrainerProfileInput): Promise<TrainerProfile | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(profileData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            return this.findByUserId(userId);
        }

        values.push(userId);
        const result: QueryResult = await query(
            `UPDATE trainer_profiles SET ${fields.join(', ')} WHERE user_id = $${paramCount} RETURNING *`,
            values
        );

        return result.rows[0] || null;
    }

    // Delete trainer profile
    async delete(userId: string): Promise<boolean> {
        const result: QueryResult = await query(
            'DELETE FROM trainer_profiles WHERE user_id = $1',
            [userId]
        );

        return (result.rowCount ?? 0) > 0;
    }
}

export default new TrainerProfileModel();

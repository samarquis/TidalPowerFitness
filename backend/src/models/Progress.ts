import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface ProgressMetric {
    id: string;
    client_id: string;
    log_date: Date;
    weight_lbs?: number;
    body_fat_percentage?: number;
    muscle_mass_lbs?: number;
    chest_inches?: number;
    waist_inches?: number;
    hips_inches?: number;
    bicep_inches?: number;
    thigh_inches?: number;
    photo_url?: string;
    notes?: string;
    recorded_by?: string;
}

export interface PersonalRecord {
    id: string;
    client_id: string;
    exercise_id: string;
    record_type: string; // 'max_weight', 'max_reps', 'max_volume'
    value: number;
    achieved_at: Date;
    exercise_log_id?: string;
    notes?: string;
}

class ProgressModel {
    // Log body measurement
    async logMetric(data: Partial<ProgressMetric>): Promise<ProgressMetric> {
        const result: QueryResult = await query(
            `INSERT INTO client_progress_metrics (
                client_id, log_date, weight_lbs, body_fat_percentage,
                muscle_mass_lbs, chest_inches, waist_inches, hips_inches,
                bicep_inches, thigh_inches, notes, recorded_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [
                data.client_id,
                data.log_date || new Date(),
                data.weight_lbs,
                data.body_fat_percentage,
                data.muscle_mass_lbs,
                data.chest_inches,
                data.waist_inches,
                data.hips_inches,
                data.bicep_inches,
                data.thigh_inches,
                data.notes,
                data.recorded_by || data.client_id
            ]
        );
        return result.rows[0];
    }

    // Get metrics history
    async getMetrics(clientId: string): Promise<ProgressMetric[]> {
        const result: QueryResult = await query(
            `SELECT * FROM client_progress_metrics 
             WHERE client_id = $1 
             ORDER BY log_date DESC`,
            [clientId]
        );
        return result.rows;
    }

    // Get personal records
    async getPersonalRecords(clientId: string): Promise<any[]> {
        const result: QueryResult = await query(
            `SELECT pr.*, e.name as exercise_name
             FROM personal_records pr
             JOIN exercises e ON pr.exercise_id = e.id
             WHERE pr.client_id = $1
             ORDER BY pr.achieved_at DESC`,
            [clientId]
        );
        return result.rows;
    }

    // Check and update PR for an exercise
    async updatePR(clientId: string, exerciseId: string, recordType: string, value: number, achievedAt: Date, logId: string): Promise<void> {
        await query(
            `INSERT INTO personal_records (
                client_id, exercise_id, record_type, value, achieved_at, exercise_log_id
            ) VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (client_id, exercise_id, record_type)
            DO UPDATE SET
                value = EXCLUDED.value,
                achieved_at = EXCLUDED.achieved_at,
                exercise_log_id = EXCLUDED.exercise_log_id,
                created_at = CURRENT_TIMESTAMP
            WHERE EXCLUDED.value > personal_records.value`,
            [clientId, exerciseId, recordType, value, achievedAt, logId]
        );
    }
}

export default new ProgressModel();

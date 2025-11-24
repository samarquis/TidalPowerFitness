import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface TrainerAvailability {
    id: string;
    trainer_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateAvailabilityInput {
    trainer_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

class TrainerAvailabilityModel {
    // Get all availability slots for a trainer
    async getByTrainer(trainerId: string): Promise<TrainerAvailability[]> {
        const result: QueryResult = await query(
            `SELECT * FROM trainer_availability 
             WHERE trainer_id = $1 AND is_active = true 
             ORDER BY day_of_week, start_time`,
            [trainerId]
        );
        return result.rows;
    }

    // Check for conflicting availability slots
    async checkConflict(
        trainerId: string,
        dayOfWeek: number,
        startTime: string,
        endTime: string,
        excludeId?: string
    ): Promise<boolean> {
        let sql = `
            SELECT id FROM trainer_availability
            WHERE trainer_id = $1 
            AND day_of_week = $2
            AND is_active = true
            AND (
                (start_time <= $3 AND end_time > $3)
                OR (start_time < $4 AND end_time >= $4)
                OR (start_time >= $3 AND end_time <= $4)
            )
        `;
        const params: any[] = [trainerId, dayOfWeek, startTime, endTime];

        if (excludeId) {
            sql += ' AND id != $5';
            params.push(excludeId);
        }

        const result: QueryResult = await query(sql, params);
        return result.rows.length > 0;
    }

    // Create new availability slot
    async create(availabilityData: CreateAvailabilityInput): Promise<TrainerAvailability> {
        const { trainer_id, day_of_week, start_time, end_time } = availabilityData;

        // Check for conflicts
        const hasConflict = await this.checkConflict(trainer_id, day_of_week, start_time, end_time);
        if (hasConflict) {
            throw new Error('This time slot conflicts with existing availability');
        }

        const result: QueryResult = await query(
            `INSERT INTO trainer_availability (trainer_id, day_of_week, start_time, end_time)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [trainer_id, day_of_week, start_time, end_time]
        );

        return result.rows[0];
    }

    // Update availability slot
    async update(
        id: string,
        availabilityData: Partial<CreateAvailabilityInput>
    ): Promise<TrainerAvailability | null> {
        // Get existing slot
        const existing = await query('SELECT * FROM trainer_availability WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return null;
        }

        const current = existing.rows[0];
        const updatedData = { ...current, ...availabilityData };

        // Check for conflicts if time/day changed
        if (
            availabilityData.day_of_week !== undefined ||
            availabilityData.start_time !== undefined ||
            availabilityData.end_time !== undefined
        ) {
            const hasConflict = await this.checkConflict(
                updatedData.trainer_id,
                updatedData.day_of_week,
                updatedData.start_time,
                updatedData.end_time,
                id
            );
            if (hasConflict) {
                throw new Error('This time slot conflicts with existing availability');
            }
        }

        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(availabilityData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            return current;
        }

        values.push(id);
        const result: QueryResult = await query(
            `UPDATE trainer_availability 
             SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $${paramCount} 
             RETURNING *`,
            values
        );

        return result.rows[0] || null;
    }

    // Soft delete (deactivate)
    async delete(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'UPDATE trainer_availability SET is_active = false WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    // Hard delete (for cleanup)
    async hardDelete(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'DELETE FROM trainer_availability WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export default new TrainerAvailabilityModel();

import { query } from '../config/db';
import { QueryResult } from 'pg';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
    id: string;
    acuity_appointment_id?: string;
    client_id: string;
    trainer_id: string;
    appointment_type: string;
    scheduled_at: Date;
    duration_minutes: number;
    status: AppointmentStatus;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateAppointmentInput {
    acuity_appointment_id?: string;
    client_id: string;
    trainer_id: string;
    appointment_type: string;
    scheduled_at: Date;
    duration_minutes: number;
    notes?: string;
}

export interface UpdateAppointmentInput {
    appointment_type?: string;
    scheduled_at?: Date;
    duration_minutes?: number;
    status?: AppointmentStatus;
    notes?: string;
}

class AppointmentModel {
    // Create appointment
    async create(appointmentData: CreateAppointmentInput): Promise<Appointment> {
        const {
            acuity_appointment_id,
            client_id,
            trainer_id,
            appointment_type,
            scheduled_at,
            duration_minutes,
            notes
        } = appointmentData;

        const result: QueryResult = await query(
            `INSERT INTO appointments 
       (acuity_appointment_id, client_id, trainer_id, appointment_type, scheduled_at, duration_minutes, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [acuity_appointment_id, client_id, trainer_id, appointment_type, scheduled_at, duration_minutes, notes]
        );

        return result.rows[0];
    }

    // Find appointment by ID
    async findById(id: string): Promise<Appointment | null> {
        const result: QueryResult = await query(
            `SELECT a.*, 
              c.first_name as client_first_name, c.last_name as client_last_name, c.email as client_email,
              t.first_name as trainer_first_name, t.last_name as trainer_last_name, t.email as trainer_email
       FROM appointments a
       JOIN users c ON a.client_id = c.id
       JOIN users t ON a.trainer_id = t.id
       WHERE a.id = $1`,
            [id]
        );

        return result.rows[0] || null;
    }

    // Find appointments by client
    async findByClient(clientId: string, status?: AppointmentStatus): Promise<Appointment[]> {
        let queryText = `
      SELECT a.*, 
             t.first_name as trainer_first_name, t.last_name as trainer_last_name
      FROM appointments a
      JOIN users t ON a.trainer_id = t.id
      WHERE a.client_id = $1
    `;
        const params: any[] = [clientId];

        if (status) {
            queryText += ' AND a.status = $2';
            params.push(status);
        }

        queryText += ' ORDER BY a.scheduled_at DESC';

        const result: QueryResult = await query(queryText, params);
        return result.rows;
    }

    // Find appointments by trainer
    async findByTrainer(trainerId: string, status?: AppointmentStatus): Promise<Appointment[]> {
        let queryText = `
      SELECT a.*, 
             c.first_name as client_first_name, c.last_name as client_last_name, c.email as client_email
      FROM appointments a
      JOIN users c ON a.client_id = c.id
      WHERE a.trainer_id = $1
    `;
        const params: any[] = [trainerId];

        if (status) {
            queryText += ' AND a.status = $2';
            params.push(status);
        }

        queryText += ' ORDER BY a.scheduled_at DESC';

        const result: QueryResult = await query(queryText, params);
        return result.rows;
    }

    // Find upcoming appointments
    async findUpcoming(limit: number = 10): Promise<Appointment[]> {
        const result: QueryResult = await query(
            `SELECT a.*, 
              c.first_name as client_first_name, c.last_name as client_last_name,
              t.first_name as trainer_first_name, t.last_name as trainer_last_name
       FROM appointments a
       JOIN users c ON a.client_id = c.id
       JOIN users t ON a.trainer_id = t.id
       WHERE a.scheduled_at > NOW() AND a.status = 'scheduled'
       ORDER BY a.scheduled_at ASC
       LIMIT $1`,
            [limit]
        );

        return result.rows;
    }

    // Update appointment
    async update(id: string, appointmentData: UpdateAppointmentInput): Promise<Appointment | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(appointmentData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const result: QueryResult = await query(
            `UPDATE appointments SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        return result.rows[0] || null;
    }

    // Update appointment status
    async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment | null> {
        const result: QueryResult = await query(
            'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        return result.rows[0] || null;
    }

    // Delete appointment
    async delete(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'DELETE FROM appointments WHERE id = $1',
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }
}

export default new AppointmentModel();

import { query } from '../config/db';
import { QueryResult } from 'pg';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
    id: string;
    square_payment_id?: string;
    user_id: string;
    appointment_id?: string;
    amount_cents: number;
    currency: string;
    status: PaymentStatus;
    payment_method?: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePaymentInput {
    square_payment_id?: string;
    user_id: string;
    appointment_id?: string;
    amount_cents: number;
    currency?: string;
    payment_method?: string;
    description?: string;
}

export interface UpdatePaymentInput {
    status?: PaymentStatus;
    square_payment_id?: string;
    description?: string;
}

class PaymentModel {
    // Create payment record
    async create(paymentData: CreatePaymentInput): Promise<Payment> {
        const {
            square_payment_id,
            user_id,
            appointment_id,
            amount_cents,
            currency = 'USD',
            payment_method,
            description
        } = paymentData;

        const result: QueryResult = await query(
            `INSERT INTO payments 
       (square_payment_id, user_id, appointment_id, amount_cents, currency, payment_method, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [square_payment_id, user_id, appointment_id, amount_cents, currency, payment_method, description]
        );

        return result.rows[0];
    }

    // Find payment by ID
    async findById(id: string): Promise<Payment | null> {
        const result: QueryResult = await query(
            `SELECT p.*, 
              u.first_name, u.last_name, u.email
       FROM payments p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
            [id]
        );

        return result.rows[0] || null;
    }

    // Find payment by Square payment ID
    async findBySquareId(squarePaymentId: string): Promise<Payment | null> {
        const result: QueryResult = await query(
            'SELECT * FROM payments WHERE square_payment_id = $1',
            [squarePaymentId]
        );

        return result.rows[0] || null;
    }

    // Find payments by user
    async findByUser(userId: string, status?: PaymentStatus): Promise<Payment[]> {
        let queryText = 'SELECT * FROM payments WHERE user_id = $1';
        const params: any[] = [userId];

        if (status) {
            queryText += ' AND status = $2';
            params.push(status);
        }

        queryText += ' ORDER BY created_at DESC';

        const result: QueryResult = await query(queryText, params);
        return result.rows;
    }

    // Find payments by appointment
    async findByAppointment(appointmentId: string): Promise<Payment[]> {
        const result: QueryResult = await query(
            'SELECT * FROM payments WHERE appointment_id = $1 ORDER BY created_at DESC',
            [appointmentId]
        );

        return result.rows;
    }

    // Get payment statistics for a user
    async getUserPaymentStats(userId: string): Promise<{
        total_paid: number;
        total_pending: number;
        payment_count: number;
    }> {
        const result: QueryResult = await query(
            `SELECT 
         SUM(CASE WHEN status = 'completed' THEN amount_cents ELSE 0 END) as total_paid,
         SUM(CASE WHEN status = 'pending' THEN amount_cents ELSE 0 END) as total_pending,
         COUNT(*) as payment_count
       FROM payments
       WHERE user_id = $1`,
            [userId]
        );

        return result.rows[0];
    }

    // Update payment
    async update(id: string, paymentData: UpdatePaymentInput): Promise<Payment | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(paymentData).forEach(([key, value]) => {
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
            `UPDATE payments SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        return result.rows[0] || null;
    }

    // Update payment status
    async updateStatus(id: string, status: PaymentStatus): Promise<Payment | null> {
        const result: QueryResult = await query(
            'UPDATE payments SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        return result.rows[0] || null;
    }

    // Delete payment
    async delete(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'DELETE FROM payments WHERE id = $1',
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }
}

export default new PaymentModel();

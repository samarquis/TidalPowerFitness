import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface Booking {
    id: string;
    class_id: string;
    user_id: string;
    credits_used: number;
    attendee_count: number;
    target_date: string;
    status: 'confirmed' | 'cancelled' | 'attended' | 'no_show';
    created_at: Date;
    updated_at: Date;
    // Joined fields
    class_name?: string;
    start_time?: string;
    day_of_week?: number;
    days_of_week?: number[];
    category?: string;
    duration_minutes?: number;
    instructor_name?: string;
}

class BookingModel {
    // Check if a user has an active booking for a class on a specific date
    async findActiveBooking(classId: string, userId: string, targetDate: string): Promise<Booking | null> {
        const result: QueryResult = await query(
            `SELECT * FROM class_participants 
             WHERE class_id = $1 AND user_id = $2 AND target_date = $3 AND status = 'confirmed'`,
            [classId, userId, targetDate]
        );
        return result.rows[0] || null;
    }

    // Create a new booking
    async create(
        classId: string, 
        userId: string, 
        creditsUsed: number, 
        attendeeCount: number, 
        targetDate: string
    ): Promise<Booking> {
        const result: QueryResult = await query(
            `INSERT INTO class_participants (class_id, user_id, credits_used, attendee_count, target_date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [classId, userId, creditsUsed, attendeeCount, targetDate]
        );
        return result.rows[0];
    }

    // Get total attendee count for a user (for achievements)
    async getTotalAttendeeCount(userId: string): Promise<number> {
        const result: QueryResult = await query(
            `SELECT SUM(attendee_count) as count FROM class_participants 
             WHERE user_id = $1 AND status = 'confirmed'`,
            [userId]
        );
        return parseInt(result.rows[0]?.count || '0', 10);
    }

    // Get all bookings for a user with class details
    async getUserBookings(userId: string): Promise<Booking[]> {
        const result: QueryResult = await query(
            `SELECT 
                cp.*,
                c.name as class_name,
                c.start_time,
                c.day_of_week,
                c.days_of_week,
                c.category,
                c.duration_minutes,
                t.first_name || ' ' || t.last_name as instructor_name
             FROM class_participants cp
             JOIN classes c ON cp.class_id = c.id
             LEFT JOIN users t ON c.instructor_id = t.id
             WHERE cp.user_id = $1
             ORDER BY cp.booking_date DESC`,
            [userId]
        );
        return result.rows;
    }

    // Get a booking by ID
    async getById(id: string): Promise<Booking | null> {
        const result: QueryResult = await query(
            'SELECT * FROM class_participants WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    // Cancel a booking
    async cancel(id: string): Promise<void> {
        await query(
            `UPDATE class_participants 
             SET status = 'cancelled', updated_at = NOW()
             WHERE id = $1`,
            [id]
        );
    }
}

export default new BookingModel();

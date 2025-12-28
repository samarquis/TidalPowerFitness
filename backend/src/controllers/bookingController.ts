import { Request, Response } from 'express';
import pool from '../config/db';
import UserCreditModel from '../models/UserCredit';
import AchievementModel from '../models/Achievement';
import { AuthenticatedRequest } from '../types/auth'; // Added import

class BookingController {
    // Book a class
    async createBooking(req: AuthenticatedRequest, res: Response) {
        try {
            const { class_id, attendee_count = 1 } = req.body;
            const userId = req.user.id;

            if (!class_id) {
                return res.status(400).json({ error: 'Class ID is required' });
            }

            if (attendee_count < 1) {
                return res.status(400).json({ error: 'Attendee count must be at least 1' });
            }

            // 1. Check if user has sufficient credits
            const credits = await UserCreditModel.getUserCredits(userId);
            const totalCredits = credits.reduce((sum, c) => sum + c.remaining_credits, 0);

            if (totalCredits < attendee_count) {
                return res.status(400).json({
                    error: 'Insufficient credits',
                    message: `You need at least ${attendee_count} credits to book this class for ${attendee_count} people. Please purchase more packages.`
                });
            }

            // 2. Check if user already has an active booking for this class on this date
            const targetDate = req.body.target_date || new Date().toISOString().split('T')[0];
            const duplicateCheckSql = `SELECT * FROM class_participants WHERE class_id = $1 AND user_id = $2 AND target_date = $3 AND status = 'confirmed'`;
            const duplicateCheckParams = [class_id, userId, targetDate];

            const existingBooking = await pool.query(duplicateCheckSql, duplicateCheckParams);

            if (existingBooking.rows.length > 0) {
                return res.status(400).json({
                    error: 'Already booked',
                    message: 'You have already booked this class for this date. To change the number of attendees, please cancel and re-book.'
                });
            }

            // 3. Deduct credit
            const deducted = await UserCreditModel.deductCredit(userId, attendee_count);

            if (!deducted) {
                return res.status(500).json({
                    error: 'Failed to deduct credits',
                    message: 'An error occurred while processing your booking.'
                });
            }

            // 4. Create booking
            const result = await pool.query(
                `INSERT INTO class_participants (class_id, user_id, credits_used, attendee_count, target_date)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [class_id, userId, attendee_count, attendee_count, targetDate]
            );

            // 5. Check for Achievements (Bookings Count)
            try {
                const countResult = await pool.query(
                    `SELECT SUM(attendee_count) as count FROM class_participants 
                     WHERE user_id = $1 AND status = 'confirmed'`,
                    [userId]
                );
                const totalAttendees = parseInt(countResult.rows[0].count);

                await AchievementModel.checkAndAward(userId, 'bookings_count', totalAttendees);
            } catch (achError) {
                console.error('Error awarding achievement:', achError);
            }

            // If in demo mode, add credits back
            if (req.user.is_demo_mode_enabled) {
                await UserCreditModel.addCredits(userId, 'demo_package', attendee_count, 365);
            }

            res.status(201).json({
                message: 'Class booked successfully',
                booking: result.rows[0]
            });

        } catch (error: any) {
            console.error('Booking error:', error);
            res.status(500).json({
                error: 'Failed to book class',
                message: error.message
            });
        }
    }

    // Get user's bookings
    async getUserBookings(req: AuthenticatedRequest, res: Response) {
        try {
            const { userId } = req.params;

            // Users can only view their own bookings unless they're admin
            if (req.user.id !== userId && !req.user.roles.includes('admin')) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const result = await pool.query(
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

            res.json(result.rows);
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ error: 'Failed to fetch bookings' });
        }
    }

    // Cancel a booking
    async cancelBooking(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // 1. Get the booking
            const bookingResult = await pool.query(
                'SELECT * FROM class_participants WHERE id = $1',
                [id]
            );

            if (bookingResult.rows.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            const booking = bookingResult.rows[0];

            // 2. Check authorization
            if (booking.user_id !== userId && !req.user.roles.includes('admin')) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // 3. Check if already cancelled
            if (booking.status === 'cancelled') {
                return res.status(400).json({ error: 'Booking already cancelled' });
            }

            // 4. Update booking status to cancelled
            await pool.query(
                `UPDATE class_participants 
                 SET status = 'cancelled', updated_at = NOW()
                 WHERE id = $1`,
                [id]
            );

            // 5. Refund credit to user
            await UserCreditModel.addCredits(
                booking.user_id,
                null as any, // No package ID for refunds
                booking.credits_used,
                30 // 30 day expiration for refunded credits
            );

            res.json({
                message: 'Booking cancelled successfully',
                credits_refunded: booking.credits_used
            });

        } catch (error: any) {
            console.error('Error cancelling booking:', error);
            res.status(500).json({
                error: 'Failed to cancel booking',
                message: error.message
            });
        }
    }
}

export default new BookingController();

import express from 'express';
import { authenticate } from '../middleware/auth';
import pool from '../config/db';
import UserCreditModel from '../models/UserCredit';
import { validateCreateBooking, validateCancelBooking, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// POST /api/bookings - Book a class
router.post('/', authenticate, validateCreateBooking, handleValidationErrors, async (req: any, res) => {
    try {
        const { class_id } = req.body;
        const userId = req.user.id;

        if (!class_id) {
            return res.status(400).json({ error: 'Class ID is required' });
        }

        // 1. Check if user has sufficient credits
        const credits = await UserCreditModel.getUserCredits(userId);
        const totalCredits = credits.reduce((sum, c) => sum + c.remaining_credits, 0);

        if (totalCredits < 1) {
            return res.status(400).json({
                error: 'Insufficient credits',
                message: 'You need at least 1 credit to book a class. Please purchase a package.'
            });
        }

        // 2. Check if user already has an active booking for this class
        const existingBooking = await pool.query(
            `SELECT * FROM class_participants 
             WHERE class_id = $1 AND user_id = $2 AND status = 'confirmed'`,
            [class_id, userId]
        );

        if (existingBooking.rows.length > 0) {
            return res.status(400).json({
                error: 'Already booked',
                message: 'You have already booked this class.'
            });
        }

        // 3. Deduct credit
        const deducted = await UserCreditModel.deductCredit(userId, 1);

        if (!deducted) {
            return res.status(500).json({
                error: 'Failed to deduct credit',
                message: 'An error occurred while processing your booking.'
            });
        }

        // 4. Create booking
        const result = await pool.query(
            `INSERT INTO class_participants (class_id, user_id, credits_used)
             VALUES ($1, $2, 1)
             RETURNING *`,
            [class_id, userId]
        );

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
});

// GET /api/bookings/user/:userId - Get user's bookings
router.get('/user/:userId', authenticate, async (req: any, res) => {
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
                c.category
             FROM class_participants cp
             JOIN classes c ON cp.class_id = c.id
             WHERE cp.user_id = $1
             ORDER BY cp.booking_date DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error: any) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', authenticate, validateCancelBooking, handleValidationErrors, async (req: any, res) => {
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
});

export default router;

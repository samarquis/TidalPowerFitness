import { Request, Response } from 'express';
import pool from '../config/db';
import UserCreditModel from '../models/UserCredit';
import AchievementModel from '../models/Achievement';
import BookingModel from '../models/Booking';
import NotificationService, { NotificationType, DeliveryMethod } from '../services/NotificationService';
import { AuthenticatedRequest } from '../types/auth';

class BookingController {
    // Book a class
    async createBooking(req: AuthenticatedRequest, res: Response) {
        const client = await pool.connect();
        try {
            const { class_id, attendee_count = 1 } = req.body;
            const userId = req.user.id;

            if (!class_id) {
                return res.status(400).json({ error: 'Class ID is required' });
            }

            if (attendee_count < 1) {
                return res.status(400).json({ error: 'Attendee count must be at least 1' });
            }

            await client.query('BEGIN');

            // Fetch class details for the notification later
            const classResult = await client.query('SELECT name, start_time FROM classes WHERE id = $1', [class_id]);
            if (classResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Class not found' });
            }
            const classDetails = classResult.rows[0];

            // 1. Check if user already has an active booking for this class on this date
            const targetDate = req.body.target_date || new Date().toISOString().split('T')[0];
            const existingBooking = await BookingModel.findActiveBooking(class_id, userId, targetDate);

            if (existingBooking) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    error: 'Already booked',
                    message: 'You have already booked this class for this date. To change the number of attendees, please cancel and re-book.'
                });
            }

            // 2. Deduct credit (Hardened with FOR UPDATE inside this transaction)
            const deducted = await UserCreditModel.deductCredit(userId, attendee_count, client);

            if (!deducted) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    error: 'Insufficient credits',
                    message: `You need at least ${attendee_count} credits to book this class.`
                });
            }

            // 3. Create booking
            const booking = await BookingModel.create(class_id, userId, attendee_count, attendee_count, targetDate);

            await client.query('COMMIT');

            // 4. Send Notification (Out-of-transaction)
            try {
                await NotificationService.notify({
                    user_id: userId,
                    type: NotificationType.BOOKING_CONFIRMATION,
                    title: 'Booking Confirmed!',
                    message: `Your booking for ${classDetails.name} on ${targetDate} at ${classDetails.start_time} has been confirmed. ${attendee_count > 1 ? `Attendees: ${attendee_count}` : ''}`,
                    delivery_method: DeliveryMethod.BOTH
                });
            } catch (notifyError) {
                console.error('Failed to send booking notification:', notifyError);
            }

            // 5. Check for Achievements (Bookings Count)
            try {
                const totalAttendees = await BookingModel.getTotalAttendeeCount(userId);
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
                booking
            });

        } catch (error: any) {
            await client.query('ROLLBACK');
            console.error('Booking error:', error);
            res.status(500).json({
                error: 'Failed to book class',
                message: error.message
            });
        } finally {
            client.release();
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

            const bookings = await BookingModel.getUserBookings(userId);
            res.json(bookings);
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
            const booking = await BookingModel.getById(id);

            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            // 2. Check authorization
            if (booking.user_id !== userId && !req.user.roles.includes('admin')) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // 3. Check if already cancelled
            if (booking.status === 'cancelled') {
                return res.status(400).json({ error: 'Booking already cancelled' });
            }

            // 4. Update booking status to cancelled
            await BookingModel.cancel(id);

            // Fetch class details for notification
            // Keeping direct query here for simplicity as getting class name from ID is trivial
            const classResult = await pool.query(
                'SELECT c.name FROM classes c JOIN class_participants cp ON c.id = cp.class_id WHERE cp.id = $1',
                [id]
            );
            const className = classResult.rows[0]?.name || 'a class';

            // Send Notification
            try {
                await NotificationService.notify({
                    user_id: userId,
                    type: NotificationType.BOOKING_CANCELLATION,
                    title: 'Booking Cancelled',
                    message: `Your booking for ${className} on ${booking.target_date} has been cancelled. ${booking.credits_used} credit(s) have been refunded to your account.`,
                    delivery_method: DeliveryMethod.BOTH
                });
            } catch (notifyError) {
                console.error('Failed to send cancellation notification:', notifyError);
            }

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

import express from 'express';
import bookingController from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';
import { createBookingValidation, validate } from '../middleware/validation';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Class reservations and user schedule
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Reserve a spot in a class
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [class_id, target_date]
 *             properties:
 *               class_id: { type: string }
 *               target_date: { type: string, format: date }
 *               attendee_count: { type: integer, default: 1 }
 *     responses:
 *       201: { description: Booking successful }
 *       400: { description: Insufficient credits or already booked }
 */
router.post('/', authenticate, createBookingValidation, validate, bookingController.createBooking);

/**
 * @swagger
 * /bookings/user/{userId}:
 *   get:
 *     summary: Get all bookings for a specific user
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of user bookings }
 */
router.get('/user/:userId', authenticate, bookingController.getUserBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Cancel a class booking and refund credits
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Booking cancelled and credited refunded }
 */
router.delete('/:id', authenticate, bookingController.cancelBooking);

export default router;

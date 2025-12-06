import express from 'express';
import { authenticate } from '../middleware/auth';
import { validateCreateBooking, validateCancelBooking, handleValidationErrors } from '../middleware/validation';
import bookingController from '../controllers/bookingController';

const router = express.Router();

// POST /api/bookings - Book a class
router.post('/', authenticate, validateCreateBooking, handleValidationErrors, bookingController.createBooking);

// GET /api/bookings/user/:userId - Get user's bookings
router.get('/user/:userId', authenticate, bookingController.getUserBookings);

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', authenticate, validateCancelBooking, handleValidationErrors, bookingController.cancelBooking);

export default router;

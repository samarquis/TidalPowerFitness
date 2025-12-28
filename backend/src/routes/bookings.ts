import bookingController from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';
import { createBookingValidation, validate } from '../middleware/validation';

const router = express.Router();

// Book a class
router.post('/', authenticate, createBookingValidation, validate, bookingController.createBooking);

// GET /api/bookings/user/:userId - Get user's bookings
router.get('/user/:userId', authenticate, bookingController.getUserBookings);

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', authenticate, validateCancelBooking, handleValidationErrors, bookingController.cancelBooking);

export default router;

import express, { Request, Response } from 'express';
import { acuityClient } from '../services/acuity';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get available appointment types (public)
router.get('/types', async (req: Request, res: Response): Promise<void> => {
    try {
        const types = await acuityClient.getAppointmentTypes();
        res.status(200).json({ appointmentTypes: types });
    } catch (error) {
        console.error('Get appointment types error:', error);
        res.status(500).json({ error: 'Failed to get appointment types' });
    }
});

// Get available times for booking (public)
router.get('/availability', async (req: Request, res: Response): Promise<void> => {
    try {
        const { appointmentTypeID, calendarID, month } = req.query;

        const availability = await acuityClient.getAvailability({
            appointmentTypeID: Number(appointmentTypeID),
            calendarID: calendarID ? Number(calendarID) : undefined,
            month: month as string,
        });

        res.status(200).json({ availability });
    } catch (error) {
        console.error('Get availability error:', error);
        res.status(500).json({ error: 'Failed to get availability' });
    }
});

// Get user's appointments (authenticated)
router.get('/my-appointments', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        // In production, filter by user's email or ID
        const appointments = await acuityClient.getAppointments({
            minDate: new Date().toISOString().split('T')[0],
        });

        res.status(200).json({ appointments });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ error: 'Failed to get appointments' });
    }
});

// Create appointment (authenticated)
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            appointmentTypeID,
            datetime,
            calendarID,
            firstName,
            lastName,
            email,
            phone,
            notes,
        } = req.body;

        const appointment = await acuityClient.createAppointment({
            appointmentTypeID: Number(appointmentTypeID),
            datetime,
            calendarID: calendarID ? Number(calendarID) : undefined,
            firstName,
            lastName,
            email,
            phone,
            notes,
        });

        res.status(201).json({
            message: 'Appointment created successfully',
            appointment,
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// Cancel appointment (authenticated)
router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await acuityClient.cancelAppointment(id);

        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
});

// Reschedule appointment (authenticated)
router.put('/:id/reschedule', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { datetime } = req.body;

        const appointment = await acuityClient.rescheduleAppointment(id, datetime);

        res.status(200).json({
            message: 'Appointment rescheduled successfully',
            appointment,
        });
    } catch (error) {
        console.error('Reschedule appointment error:', error);
        res.status(500).json({ error: 'Failed to reschedule appointment' });
    }
});

export default router;

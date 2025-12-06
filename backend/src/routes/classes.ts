const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticate, authorize } = require('../middleware/auth');
import pool from '../config/db';

// Public routes
router.get('/', classController.getClasses);
router.get('/:id', classController.getClass);

// Get attendees for a class (trainers and admins)
router.get('/:id/attendees', authenticate, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles || [];

        // Check if user is admin or the instructor of this class
        const classResult = await pool.query(
            'SELECT instructor_id FROM classes WHERE id = $1',
            [id]
        );

        if (classResult.rows.length === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }

        const isAdmin = userRoles.includes('admin');
        const isInstructor = classResult.rows[0].instructor_id === userId;

        if (!isAdmin && !isInstructor && !userRoles.includes('trainer')) {
            return res.status(403).json({ error: 'Not authorized to view attendees' });
        }

        // Get all confirmed attendees for this class
        const result = await pool.query(`
            SELECT 
                cp.id as booking_id,
                cp.user_id,
                cp.status,
                cp.booking_date,
                cp.credits_used,
                u.first_name,
                u.last_name,
                u.email,
                u.phone
            FROM class_participants cp
            JOIN users u ON cp.user_id = u.id
            WHERE cp.class_id = $1 AND cp.status = 'confirmed'
            ORDER BY cp.booking_date DESC
        `, [id]);

        res.json({
            class_id: id,
            attendee_count: result.rows.length,
            attendees: result.rows
        });

    } catch (error: any) {
        console.error('Error fetching class attendees:', error);
        res.status(500).json({ error: 'Failed to fetch attendees' });
    }
});

// Admin-only routes
router.post('/', authenticate, authorize('admin'), classController.createClass);
router.put('/:id', authenticate, authorize('admin'), classController.updateClass);
router.delete('/:id', authenticate, authorize('admin'), classController.deleteClass);

module.exports = router;
export default router;


import { Request, Response } from 'express';
import ClassModel from '../models/Class';
import { AuthenticatedRequest } from '../types/auth';
import pool from '../config/db';

// Get all classes
export const getClasses = async (req: Request, res: Response) => {
    try {
        const { day, category, page, limit } = req.query;

        // If pagination params are provided, use paginated method
        if (page || limit) {
            const paginationParams = {
                page: parseInt(page as string) || 1,
                limit: parseInt(limit as string) || 10
            };
            const result = await ClassModel.getPaginatedClasses(paginationParams);
            return res.json(result);
        }

        let classes;
        if (day !== undefined) {
            classes = await ClassModel.getClassesByDay(parseInt(day as string));
        } else if (category) {
            classes = await ClassModel.getClassesByCategory(category as string);
        } else {
            classes = await ClassModel.getAllClasses();
        }

        res.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
};

// Get single class by ID
export const getClass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const classData = await ClassModel.getClassById(id);

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json(classData);
    } catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({ error: 'Failed to fetch class' });
    }
};

// Create new class (admin only)
export const createClass = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const classData = req.body;

        if (!classData.name || !classData.category || !classData.instructor_name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newClass = await ClassModel.createClass(classData);
        res.status(201).json(newClass);
    } catch (error: any) {
        console.error('Error creating class:', error);
        res.status(500).json({
            error: 'Failed to create class',
            details: error.message
        });
    }
};

// Update class (admin only)
export const updateClass = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const classData = req.body;
        const updatedClass = await ClassModel.updateClass(id, classData);

        if (!updatedClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json(updatedClass);
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ error: 'Failed to update class' });
    }
};

// Delete class (admin only)
export const deleteClass = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await ClassModel.deleteClass(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ error: 'Failed to delete class' });
    }
};

// Get attendees for a class (trainers and admins)
export const getClassAttendees = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const userRoles = req.user!.roles || [];

        const classData = await ClassModel.getClassById(id);

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        const isAdmin = userRoles.includes('admin');
        const isInstructor = classData.instructor_id === userId;

        if (!isAdmin && !isInstructor && !userRoles.includes('trainer')) {
            return res.status(403).json({ error: 'Not authorized to view attendees' });
        }

        const { date } = req.query;
        let queryStr = `
            SELECT 
                cp.id as booking_id,
                cp.user_id,
                cp.status,
                cp.booking_date,
                cp.target_date,
                cp.credits_used,
                u.first_name,
                u.last_name,
                u.email,
                u.phone
            FROM class_participants cp
            JOIN users u ON cp.user_id = u.id
            WHERE cp.class_id = $1 AND cp.status = 'confirmed'
        `;
        const queryParams: any[] = [id];

        if (date) {
            queryStr += ` AND cp.target_date = $2`;
            queryParams.push(date);
        }

        queryStr += ` ORDER BY u.last_name, u.first_name`;

        const result = await pool.query(queryStr, queryParams);

        res.json({
            class_id: id,
            target_date: date || null,
            attendee_count: result.rows.length,
            attendees: result.rows
        });

    } catch (error: any) {
        console.error('Error fetching class attendees:', error);
        res.status(500).json({ error: 'Failed to fetch attendees' });
    }
};

export default {
    getClasses,
    getClass,
    createClass,
    updateClass,
    deleteClass,
    getClassAttendees
};
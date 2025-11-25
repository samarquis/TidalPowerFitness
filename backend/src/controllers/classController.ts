import { Request, Response } from 'express';
import ClassModel from '../models/Class';

// Get all classes
export const getClasses = async (req: Request, res: Response) => {
    try {
        const { day, category } = req.query;

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
export const createClass = async (req: Request, res: Response) => {
    try {
        console.log('Creating class with data:', JSON.stringify(req.body, null, 2));
        const classData = req.body;

        // Validate required fields
        if (!classData.name || !classData.category || !classData.instructor_name) {
            console.error('Missing required fields:', {
                name: !!classData.name,
                category: !!classData.category,
                instructor_name: !!classData.instructor_name
            });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newClass = await ClassModel.createClass(classData);
        console.log('Class created successfully:', newClass.id);
        res.status(201).json(newClass);
    } catch (error: any) {
        console.error('Error creating class:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', error.message);
        res.status(500).json({
            error: 'Failed to create class',
            details: error.message
        });
    }
};

// Update class (admin only)
export const updateClass = async (req: Request, res: Response) => {
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
export const deleteClass = async (req: Request, res: Response) => {
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

export default {
    getClasses,
    getClass,
    createClass,
    updateClass,
    deleteClass
};

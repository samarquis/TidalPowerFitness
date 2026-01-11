import express from 'express';
import classController from '../controllers/classController';
import { authenticate, authorize } from '../middleware/auth';
import { createClassValidation, validate } from '../middleware/validation';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class schedule and management
 */

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: List all active classes
 *     tags: [Classes]
 *     responses:
 *       200: { description: List of classes }
 */
router.get('/', classController.getClasses);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Get class details by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Class details }
 *       404: { description: Class not found }
 */
router.get('/:id', classController.getClass);

/**
 * @swagger
 * /classes/{id}/attendees:
 *   get:
 *     summary: Get list of attendees for a class instance
 *     tags: [Classes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *         description: Specific class instance date
 *     responses:
 *       200: { description: List of attendees }
 */
router.get('/:id/attendees', authenticate, classController.getClassAttendees);

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Create a new recurring class (Admin only)
 *     tags: [Classes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, start_time, days_of_week]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               instructor_id: { type: string }
 *               start_time: { type: string }
 *               days_of_week: { type: array, items: { type: integer } }
 *     responses:
 *       201: { description: Class created }
 */
router.post('/', authenticate, authorize('admin'), createClassValidation, validate, classController.createClass);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Update class details (Admin only)
 *     tags: [Classes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Class updated }
 */
router.put('/:id', authenticate, authorize('admin'), classController.updateClass);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Delete a class (Admin only)
 *     tags: [Classes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Class deleted }
 */
router.delete('/:id', authenticate, authorize('admin'), classController.deleteClass);

export default router;


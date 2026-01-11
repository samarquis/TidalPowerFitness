import express from 'express';
import supportController from '../controllers/supportController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Support
 *   description: User feedback and support requests
 */

/**
 * @swagger
 * /support/report-error:
 *   post:
 *     summary: Automatically report a system error or crash
 *     tags: [Support]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string }
 *               stack_trace: { type: string }
 *               url: { type: string }
 *               component_name: { type: string }
 *     responses:
 *       200: { description: Error recorded }
 */
router.post('/report-error', optionalAuth, supportController.reportError);

/**
 * @swagger
 * /support/feedback:
 *   post:
 *     summary: Submit a bug report or feature request
 *     tags: [Support]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, title, description]
 *             properties:
 *               type: { type: string, enum: [bug, feature, review] }
 *               priority: { type: string, enum: [low, medium, high, urgent] }
 *               title: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Feedback submitted }
 */
router.post('/feedback', authenticate, supportController.submitFeedback);

/**
 * @swagger
 * /support/my-feedback:
 *   get:
 *     summary: Get history of feedback submitted by the current user
 *     tags: [Support]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: List of feedback entries }
 */
router.get('/my-feedback', authenticate, supportController.getMyFeedback);

export default router;

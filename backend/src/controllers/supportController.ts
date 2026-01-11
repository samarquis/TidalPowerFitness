import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import pool from '../config/db';
import GitHubService from '../services/GitHubService';
import NotificationService, { NotificationType, DeliveryMethod } from '../services/NotificationService';
import logger from '../utils/logger';

class SupportController {
    async submitFeedback(req: AuthenticatedRequest, res: Response) {
        const client = await pool.connect();
        try {
            const { type, priority, title, description, metadata } = req.body;
            const userId = req.user.id;
            const userEmail = req.user.email;

            if (!type || !title || !description) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            await client.query('BEGIN');

            // 1. Save to local database
            const localResult = await client.query(
                `INSERT INTO site_feedback (user_id, type, priority, title, description, metadata)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                [userId, type, priority || 'medium', title, description, metadata || {}]
            );
            const feedbackId = localResult.rows[0].id;

            // 2. Create GitHub Issue
            const issueBody = `
**User:** ${userEmail} (ID: ${userId})
**Type:** ${type.toUpperCase()}
**Priority:** ${priority || 'medium'}

**Description:**
${description}

---
*Generated automatically via Tidal Power Fitness Support System*
*Local Record ID: ${feedbackId}*
            `;

            const githubIssue = await GitHubService.createIssue({
                title: `[${type.toUpperCase()}] ${title}`,
                body: issueBody,
                labels: ['user-feedback', type]
            });

            // 3. Update local record with GitHub info if successful
            if (githubIssue) {
                await client.query(
                    'UPDATE site_feedback SET github_issue_url = $1, github_issue_number = $2 WHERE id = $3',
                    [githubIssue.url, githubIssue.number, feedbackId]
                );
            }

            await client.query('COMMIT');

            // 4. Notify Admin (Scott)
            try {
                await NotificationService.notify({
                    user_id: '00000000-0000-0000-0000-000000000000', // Assuming admin notification logic handles this
                    type: NotificationType.ACHIEVEMENT, // Reusing existing type for now
                    title: 'New Site Feedback Received',
                    message: `New ${type} submitted: ${title}. ${githubIssue ? `GitHub Issue #${githubIssue.number}` : ''}`,
                    delivery_method: DeliveryMethod.BOTH
                });
            } catch (notifyError) {
                logger.error('Failed to notify admin of feedback:', notifyError);
            }

            res.status(201).json({
                message: 'Feedback submitted successfully',
                id: feedbackId,
                github_url: githubIssue?.url
            });

        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Support feedback error:', error);
            res.status(500).json({ error: 'Failed to submit feedback' });
        } finally {
            client.release();
        }
    }

    async getMyFeedback(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const result = await pool.query(
                'SELECT * FROM site_feedback WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            );
            res.json(result.rows);
        } catch (error) {
            logger.error('Error fetching user feedback:', error);
            res.status(500).json({ error: 'Failed to fetch feedback history' });
        }
    }
}

export default new SupportController();

import { Request, Response } from 'express';
import Progress from '../models/Progress';
import { AuthenticatedRequest } from '../types/auth'; // Added import

class ProgressController {
    // Log body metric
    async logMetric(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const data = {
                ...req.body,
                client_id: req.user?.id // Log own progress by default
            };
            const metric = await Progress.logMetric(data);
            res.status(201).json(metric);
        } catch (error) {
            console.error('Error logging metric:', error);
            res.status(500).json({ error: 'Failed to log progress metric' });
        }
    }

    // Get metrics history
    async getMetrics(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const clientId = req.params.clientId || req.user?.id;

            // Authorization check
            if (req.user?.id !== clientId && !req.user?.roles?.includes('trainer') && !req.user?.roles?.includes('admin')) {
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }

            const metrics = await Progress.getMetrics(clientId!);
            res.json(metrics);
        } catch (error) {
            console.error('Error fetching metrics:', error);
            res.status(500).json({ error: 'Failed to fetch progress metrics' });
        }
    }

    // Get personal records
    async getPersonalRecords(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const clientId = req.params.clientId || req.user?.id;

            // Authorization check
            if (req.user?.id !== clientId && !req.user?.roles?.includes('trainer') && !req.user?.roles?.includes('admin')) {
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }

            const records = await Progress.getPersonalRecords(clientId!);
            res.json(records);
        } catch (error) {
            console.error('Error fetching PRs:', error);
            res.status(500).json({ error: 'Failed to fetch personal records' });
        }
    }
}

export default new ProgressController();

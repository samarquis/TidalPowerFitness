import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { runAllMigrations, getMigrationStatus } from '../services/migrationService';

const router = Router();

/**
 * GET /api/admin/migrate/status
 * Check which migrations have been applied
 */
router.get('/status', authenticate, authorize('admin'), async (req: Request, res: Response) => {
    try {
        const status = await getMigrationStatus();
        res.json({
            success: true,
            data: status
        });
    } catch (error: any) {
        console.error('Error checking migration status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check migration status',
            details: error.message
        });
    }
});

/**
 * POST /api/admin/migrate
 * Run all pending migrations
 */
router.post('/', authenticate, authorize('admin'), async (req: Request, res: Response) => {
    try {
        console.log('Starting migration process...');
        const result = await runAllMigrations();

        const hasFailures = result.failed.length > 0;
        const statusCode = hasFailures ? 500 : 200;

        res.status(statusCode).json({
            success: !hasFailures,
            message: hasFailures
                ? `Migration failed. ${result.completed.length} completed, ${result.failed.length} failed.`
                : `All migrations completed successfully. ${result.completed.length} migrations applied.`,
            data: result
        });
    } catch (error: any) {
        console.error('Error running migrations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to run migrations',
            details: error.message
        });
    }
});

export default router;

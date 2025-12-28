import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import validateEnv from './config/validateEnv';
import cron from 'node-cron';
import { BackupService } from './services/backupService';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

// Initialize and start server
async function startServer() {
    try {
        // Validate environment variables
        validateEnv();

        // Schedule database backups (Daily at 3:00 AM)
        cron.schedule('0 3 * * *', async () => {
            try {
                logger.info('Running scheduled database backup...');
                await BackupService.createBackup();
            } catch (error) {
                logger.error('Scheduled backup failed:', error);
            }
        });

        // Start server
        app.listen(PORT, () => {
            logger.info(`✅ Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
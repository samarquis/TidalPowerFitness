import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database Backup Service
 * Handles periodic PostgreSQL dumps to the local filesystem
 */
export class BackupService {
  private static backupDir = path.join(process.cwd(), 'backups');

  static async createBackup(): Promise<string> {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;
    const filepath = path.join(this.backupDir, filename);

    // Get connection details from environment
    const dbUrl = process.env.DATABASE_URL;
    
    let command = '';
    
    if (dbUrl) {
      // Use pg_dump with connection string
      command = `pg_dump "${dbUrl}" > "${filepath}"`;
    } else {
      const host = process.env.DB_HOST || 'localhost';
      const user = process.env.DB_USER || 'postgres';
      const dbName = process.env.DB_NAME || 'tidal_power_fitness';
      
      // Assumes PGPASSWORD is set in env or .pgpass is configured
      command = `pg_dump -h ${host} -U ${user} ${dbName} > "${filepath}"`;
    }

    logger.info(`Starting database backup to ${filename}...`);

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error('Backup failed:', error);
          reject(error);
          return;
        }
        
        if (stderr && !stderr.includes('done')) {
          logger.warn('Backup stderr:', stderr);
        }

        logger.info(`Backup completed successfully: ${filepath}`);
        
        // Clean up old backups (keep last 7 days)
        this.cleanupOldBackups();
        
        resolve(filepath);
      });
    });
  }

  private static cleanupOldBackups() {
    const maxAgeDays = 7;
    const files = fs.readdirSync(this.backupDir);
    const now = Date.now();

    files.forEach(file => {
      const filePath = path.join(this.backupDir, file);
      const stats = fs.statSync(filePath);
      const ageInDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

      if (ageInDays > maxAgeDays) {
        fs.unlinkSync(filePath);
        logger.info(`Deleted old backup: ${file}`);
      }
    });
  }
}

import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

// Use DATABASE_URL if available (production), otherwise use local config
const pool = new Pool(
    process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'tidal_power_fitness',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'changeme',
        }
);

const runMigration = async () => {
    try {
        const sqlFile = process.argv[2] || 'migrations/001_add_days_of_week.sql';
        const filePath = path.join(__dirname, '../../database', sqlFile);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`Running migration: ${sqlFile}`);
        await pool.query(sql);
        console.log(`✓ Migration completed: ${sqlFile}`);
        process.exit(0);
    } catch (error) {
        console.error('✗ Migration failed:', error);
        process.exit(1);
    }
};

runMigration();

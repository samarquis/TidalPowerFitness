import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

// Use DATABASE_URL if available (production), otherwise use local config
const pool = new Pool(
    process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL }
        : {
            host: 'localhost',
            port: 5432,
            database: 'titan_power_fitness',
            user: 'postgres',
            password: 'changeme',
        }
);

const runMigration = async () => {
    try {
        const sqlFile = 'migrations/001_add_days_of_week.sql';
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

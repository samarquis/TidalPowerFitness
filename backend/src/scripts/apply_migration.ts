import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool(
    process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'tidal_power_fitness',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD,
        }
);

const runMigration = async () => {
    try {
        const sqlFile = process.argv[2];
        if (!sqlFile) {
            console.error('Usage: ts-node apply_migration.ts <path_to_sql_file>');
            process.exit(1);
        }
        
        const filePath = path.resolve(sqlFile);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`Running migration: ${sqlFile}`);
        await pool.query(sql);
        console.log(`✓ Migration completed successfully.`);
        process.exit(0);
    } catch (error) {
        console.error('✗ Migration failed:', error);
        process.exit(1);
    }
};

runMigration();

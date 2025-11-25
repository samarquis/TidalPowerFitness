import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function initializeDatabase() {
    const client = await pool.connect();

    try {
        console.log('🔍 Checking if database is initialized...');

        // Check if users table exists
        const result = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);

        const tablesExist = result.rows[0].exists;

        if (tablesExist) {
            console.log('✅ Database already initialized');
            return;
        }

        console.log('📦 Initializing database schema...');

        // Read and execute init.sql
        const initSqlPath = path.join(__dirname, '../../database/init.sql');
        const initSql = fs.readFileSync(initSqlPath, 'utf8');

        await client.query(initSql);
        console.log('✅ Database schema created successfully');

        // Optionally run seed data
        try {
            const seedSqlPath = path.join(__dirname, '../../database/seed.sql');
            if (fs.existsSync(seedSqlPath)) {
                console.log('🌱 Seeding database with sample data...');
                const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
                await client.query(seedSql);
                console.log('✅ Database seeded successfully');
            }
        } catch (seedError) {
            console.log('⚠️  Seed file not found or failed, skipping...');
        }

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    } finally {
        client.release();
    }
}

export default initializeDatabase;

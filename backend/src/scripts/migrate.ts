import fs from 'fs';
import path from 'path';
import pool from '../config/db';

const runMigration = async (sqlFile: string) => {
    try {
        const filePath = path.join(__dirname, '../../database', sqlFile);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`Running migration: ${sqlFile}`);
        await pool.query(sql);
        console.log(`✓ Migration completed: ${sqlFile}`);
    } catch (error) {
        console.error(`✗ Migration failed: ${sqlFile}`, error);
        throw error;
    }
};

const migrate = async () => {
    try {
        console.log('Starting database migration...\n');

        // Run init.sql to create tables
        await runMigration('init.sql');

        console.log('\n✓ All migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Migration failed:', error);
        process.exit(1);
    }
};

const seed = async () => {
    try {
        console.log('Starting database seeding...\n');

        // Run seed.sql to insert sample data
        await runMigration('seed.sql');

        console.log('\n✓ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Seeding failed:', error);
        process.exit(1);
    }
};

const reset = async () => {
    try {
        console.log('Resetting database...\n');

        // Drop all tables
        console.log('Dropping existing tables...');
        await pool.query(`
      DROP TABLE IF EXISTS forms CASCADE;
      DROP TABLE IF EXISTS payments CASCADE;
      DROP TABLE IF EXISTS appointments CASCADE;
      DROP TABLE IF EXISTS trainer_profiles CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TYPE IF EXISTS user_role CASCADE;
      DROP TYPE IF EXISTS appointment_status CASCADE;
      DROP TYPE IF EXISTS payment_status CASCADE;
    `);
        console.log('✓ Tables dropped');

        // Run migrations
        await runMigration('init.sql');

        console.log('\n✓ Database reset completed!');
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Reset failed:', error);
        process.exit(1);
    }
};

// Parse command line arguments
const command = process.argv[2];

switch (command) {
    case 'migrate':
        migrate();
        break;
    case 'seed':
        seed();
        break;
    case 'reset':
        reset();
        break;
    default:
        console.log('Usage: npm run db:[migrate|seed|reset]');
        process.exit(1);
}

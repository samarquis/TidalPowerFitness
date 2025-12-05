import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import fs from 'fs';
import pool from '../config/db';

// Helper to run individual SQL files
const executeSqlFile = async (filePath: string) => {
    try {
        const sql = fs.readFileSync(filePath, 'utf8');
        console.log(`Executing SQL file: ${path.basename(filePath)}`);
        await pool.query(sql);
        console.log(`✓ Executed: ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`✗ Failed to execute: ${path.basename(filePath)}`, error);
        throw error;
    }
};

const migrate = async () => {
    try {
        console.log('Starting database migration...\n');

        // Ensure init.sql is run first (table creation)
        await executeSqlFile(path.join(__dirname, '../../database/init.sql'));

        const migrationsDir = path.join(__dirname, '../../migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Sorts numerically (e.g., 001, 002, 003)

        for (const file of migrationFiles) {
            await executeSqlFile(path.join(migrationsDir, file));
        }

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
        await executeSqlFile(path.join(__dirname, '../../database/seed.sql'));
        await executeSqlFile(path.join(__dirname, '../../database/generated_test_data.sql')); // Run generated test data

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
      DROP TABLE IF EXISTS classes CASCADE; -- Added classes
      DROP TABLE IF EXISTS workout_assignments CASCADE; -- Added workout_assignments
      DROP TABLE IF EXISTS workout_sessions CASCADE; -- Added workout_sessions
      DROP TABLE IF EXISTS workout_templates CASCADE; -- Added workout_templates
      DROP TABLE IF EXISTS workout_sets CASCADE; -- Added workout_sets
      DROP TABLE IF EXISTS exercises CASCADE; -- Added exercises
      DROP TABLE IF EXISTS body_focus_areas CASCADE; -- Added body_focus_areas
      DROP TABLE IF EXISTS workout_types CASCADE; -- Added workout_types
      DROP TABLE IF EXISTS users CASCADE;
      DROP TYPE IF EXISTS user_role CASCADE;
      DROP TYPE IF EXISTS appointment_status CASCADE;
      DROP TYPE IF EXISTS payment_status CASCADE;
    `);
        console.log('✓ Tables dropped');

        // Run migrations
        await executeSqlFile(path.join(__dirname, '../../database/init.sql'));

        const migrationsDir = path.join(__dirname, '../../migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Sorts numerically (e.g., 001, 002, 003)

        for (const file of migrationFiles) {
            await executeSqlFile(path.join(migrationsDir, file));
        }


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

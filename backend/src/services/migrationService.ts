import fs from 'fs';
import path from 'path';
import pool from '../config/db';

interface MigrationResult {
    filename: string;
    success: boolean;
    error?: string;
    executedAt?: Date;
}

interface MigrationStatus {
    pending: string[];
    completed: MigrationResult[];
    failed: MigrationResult[];
}

// List of migrations to run in order
const MIGRATIONS = [
    '003_add_body_parts.sql',
    '004_add_packages_and_credits.sql',
    '005_create_class_participants.sql'
];

/**
 * Run a single migration file
 */
async function runMigration(filename: string): Promise<MigrationResult> {
    try {
        // Use process.cwd() to find migrations folder at root of project
        const migrationsDir = path.join(process.cwd(), 'migrations');
        const filePath = path.join(migrationsDir, filename);

        console.log(`[Migration Debug] CWD: ${process.cwd()}`);
        console.log(`[Migration Debug] Migrations Dir: ${migrationsDir}`);
        console.log(`[Migration Debug] Target File: ${filePath}`);

        // List directory contents if it exists
        if (fs.existsSync(migrationsDir)) {
            console.log(`[Migration Debug] Dir contents:`, fs.readdirSync(migrationsDir));
        } else {
            console.error(`[Migration Debug] Migrations directory does not exist at ${migrationsDir}`);

            // Try alternative path (relative to __dirname)
            const altPath = path.join(__dirname, '../../migrations');
            console.log(`[Migration Debug] Checking alternative path: ${altPath}`);
            if (fs.existsSync(altPath)) {
                console.log(`[Migration Debug] Alternative path exists! Contents:`, fs.readdirSync(altPath));
            }
        }

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return {
                filename,
                success: false,
                error: `Migration file not found: ${filename} (searched in ${migrationsDir})`
            };
        }

        // Read SQL file
        const sql = fs.readFileSync(filePath, 'utf8');

        // Execute migration
        console.log(`Running migration: ${filename}`);
        await pool.query(sql);
        console.log(`✓ Migration completed: ${filename}`);

        return {
            filename,
            success: true,
            executedAt: new Date()
        };
    } catch (error: any) {
        console.error(`✗ Migration failed: ${filename}`, error);
        return {
            filename,
            success: false,
            error: error.message || 'Unknown error'
        };
    }
}

/**
 * Run all pending migrations
 */
export async function runAllMigrations(): Promise<MigrationStatus> {
    const results: MigrationStatus = {
        pending: [],
        completed: [],
        failed: []
    };

    for (const migration of MIGRATIONS) {
        const result = await runMigration(migration);

        if (result.success) {
            results.completed.push(result);
        } else {
            results.failed.push(result);
            // Stop on first failure
            console.error(`Stopping migration process due to failure in ${migration}`);
            break;
        }
    }

    // Add remaining migrations to pending if we stopped early
    const lastIndex = results.completed.length + results.failed.length;
    results.pending = MIGRATIONS.slice(lastIndex);

    return results;
}

/**
 * Get migration status (which have been applied, which are pending)
 */
export async function getMigrationStatus(): Promise<MigrationStatus> {
    const status: MigrationStatus = {
        pending: [],
        completed: [],
        failed: []
    };

    for (const migration of MIGRATIONS) {
        // Check if tables exist to determine if migration has been applied
        try {
            if (migration === '003_add_body_parts.sql') {
                const result = await pool.query(
                    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'body_parts')"
                );
                if (result.rows[0].exists) {
                    status.completed.push({ filename: migration, success: true });
                } else {
                    status.pending.push(migration);
                }
            } else if (migration === '004_add_packages_and_credits.sql') {
                const result = await pool.query(
                    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'packages')"
                );
                if (result.rows[0].exists) {
                    status.completed.push({ filename: migration, success: true });
                } else {
                    status.pending.push(migration);
                }
            } else if (migration === '005_create_class_participants.sql') {
                const result = await pool.query(
                    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'class_participants')"
                );
                if (result.rows[0].exists) {
                    status.completed.push({ filename: migration, success: true });
                } else {
                    status.pending.push(migration);
                }
            }
        } catch (error) {
            console.error(`Error checking migration status for ${migration}:`, error);
            status.pending.push(migration);
        }
    }

    return status;
}

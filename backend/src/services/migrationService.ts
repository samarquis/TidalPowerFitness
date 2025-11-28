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

/**
 * Get all migration files from the migrations directory, sorted alphabetically
 */
function getMigrationFiles(): string[] {
    const migrationsDir = path.join(process.cwd(), 'migrations');

    if (!fs.existsSync(migrationsDir)) {
        // Try alternative path (relative to __dirname) for different environments
        const altPath = path.join(__dirname, '../../migrations');
        if (fs.existsSync(altPath)) {
            return fs.readdirSync(altPath).filter(file => file.endsWith('.sql')).sort();
        }
        console.error(`[Migration Error] Migrations directory not found at ${migrationsDir} or ${altPath}`);
        return [];
    }

    return fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql')).sort();
}

/**
 * Run a single migration file
 */
async function runMigration(filename: string): Promise<MigrationResult> {
    try {
        // 1. Check if migration has already run (if migrations table exists)
        try {
            const checkResult = await pool.query(
                'SELECT id FROM migrations WHERE name = $1',
                [filename]
            );
            if (checkResult.rows.length > 0) {
                console.log(`[Migration] Skipping ${filename} (already executed)`);
                return {
                    filename,
                    success: true,
                    executedAt: new Date() // Approximate
                };
            }
        } catch (error: any) {
            // Ignore error if table doesn't exist (likely running 001)
            if (error.code !== '42P01') { // 42P01 is undefined_table
                console.warn(`[Migration Warning] Could not check migration status: ${error.message}`);
            }
        }

        // 2. Find file path
        let migrationsDir = path.join(process.cwd(), 'migrations');
        if (!fs.existsSync(migrationsDir)) {
            migrationsDir = path.join(__dirname, '../../migrations');
        }
        const filePath = path.join(migrationsDir, filename);

        if (!fs.existsSync(filePath)) {
            return {
                filename,
                success: false,
                error: `Migration file not found: ${filename}`
            };
        }

        // 3. Read and Execute SQL
        const sql = fs.readFileSync(filePath, 'utf8');
        console.log(`[Migration] Running: ${filename}`);
        await pool.query(sql);

        // 4. Record execution
        try {
            await pool.query(
                'INSERT INTO migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
                [filename]
            );
        } catch (error: any) {
            console.warn(`[Migration Warning] Could not record migration execution: ${error.message}`);
        }

        console.log(`[Migration] ✓ Completed: ${filename}`);

        return {
            filename,
            success: true,
            executedAt: new Date()
        };
    } catch (error: any) {
        console.error(`[Migration] ✗ Failed: ${filename}`, error);
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

    const files = getMigrationFiles();
    console.log(`[Migration] Found ${files.length} migration files:`, files);

    for (const file of files) {
        const result = await runMigration(file);

        if (result.success) {
            results.completed.push(result);
        } else {
            results.failed.push(result);
            console.error(`[Migration] Stopping process due to failure in ${file}`);

            // Add remaining to pending
            const currentIndex = files.indexOf(file);
            if (currentIndex !== -1 && currentIndex < files.length - 1) {
                results.pending = files.slice(currentIndex + 1);
            }
            break;
        }
    }

    return results;
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<MigrationStatus> {
    const status: MigrationStatus = {
        pending: [],
        completed: [],
        failed: []
    };

    const files = getMigrationFiles();

    for (const file of files) {
        try {
            const result = await pool.query(
                'SELECT * FROM migrations WHERE name = $1',
                [file]
            );

            if (result.rows.length > 0) {
                status.completed.push({
                    filename: file,
                    success: true,
                    executedAt: result.rows[0].executed_at
                });
            } else {
                status.pending.push(file);
            }
        } catch (error) {
            // If table doesn't exist, all are pending (except maybe 001 if it partially ran)
            status.pending.push(file);
        }
    }

    return status;
}


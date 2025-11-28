import { runAllMigrations } from '../services/migrationService';

const run = async () => {
    try {
        console.log('Starting automatic migration process...');
        const result = await runAllMigrations();

        if (result.failed.length > 0) {
            console.error('❌ Some migrations failed:', result.failed);
            process.exit(1);
        }

        console.log('✅ Migration process completed successfully');
        console.log(`Applied ${result.completed.length} migrations`);
        if (result.pending.length > 0) {
            console.log(`Note: ${result.pending.length} migrations were skipped or pending (check logs)`);
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error running migrations:', error);
        process.exit(1);
    }
};

run();

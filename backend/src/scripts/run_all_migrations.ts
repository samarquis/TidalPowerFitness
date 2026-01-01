const dotenv = require('dotenv');
dotenv.config();

console.log('DEBUG: DB_USER from env:', process.env.DB_USER);
console.log('DEBUG: DB_HOST from env:', process.env.DB_HOST);

// Now require the service, which will eventually trigger db connection
const { runAllMigrations } = require('../services/migrationService');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
    const maxRetries = 5;
    let attempt = 1;

    while (attempt <= maxRetries) {
        try {
            console.log(`Starting automatic migration process (Attempt ${attempt}/${maxRetries})...`);
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
            console.error(`❌ Error running migrations (Attempt ${attempt}/${maxRetries}):`, error.message);
            if (attempt === maxRetries) {
                console.error('❌ Fatal error: All migration attempts failed.');
                process.exit(1);
            }
            console.log('Waiting 5 seconds before retrying...');
            await wait(5000);
            attempt++;
        }
    }
};

run();

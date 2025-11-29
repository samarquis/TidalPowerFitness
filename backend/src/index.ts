const app = require('./app');
const dotenv = require('dotenv');

// Import database initialization
const initializeDatabase = require('./scripts/initDb');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database and start server
async function startServer() {
    try {
        // Initialize database tables if they don't exist
        await (initializeDatabase.default || initializeDatabase)();

        // Start server
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;

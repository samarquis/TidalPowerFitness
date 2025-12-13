// Set up environment variables for the test environment
process.env.JWT_SECRET = 'a-dummy-secret-for-testing';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'tidal_power_fitness';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'changeme';


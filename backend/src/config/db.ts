import { Pool, QueryResult } from 'pg';

// Support both individual env vars (local) and DATABASE_URL (production)
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
    : new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'tidal_power_fitness',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
    });

// Test connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Query helper function
export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Query error', { text, error });
        throw error;
    }
};

// Get a client from the pool
export const getClient = async () => {
    return await pool.connect();
};

// Close pool
export const closePool = async () => {
    await pool.end();
};

export default pool;

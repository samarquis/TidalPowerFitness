
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env from backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testNeonConnection() {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        console.error('❌ DATABASE_URL is not set in backend/.env');
        console.log('Please add your Neon connection string to backend/.env:');
        console.log('DATABASE_URL=postgresql://user:pass@ep-host.region.aws.neon.tech/neondb?sslmode=require');
        process.exit(1);
    }

    console.log('Attempting to connect to Neon database...');
    console.log(`URL: ${dbUrl.split('@')[1]} (password hidden)`);

    const pool = new Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
    });

    try {
        const start = Date.now();
        const client = await pool.connect();
        const duration = Date.now() - start;
        
        console.log(`✅ SUCCESS: Connected to Neon in ${duration}ms`);
        
        const res = await client.query('SELECT version(), current_database(), now()');
        console.log('Database Details:');
        console.log(`- Version: ${res.rows[0].version}`);
        console.log(`- Database: ${res.rows[0].current_database}`);
        console.log(`- Server Time: ${res.rows[0].now}`);
        
        client.release();
        await pool.end();
        console.log('\nConnection test passed successfully!');
    } catch (err: any) {
        console.error('\n❌ CONNECTION FAILED:');
        console.error(err.message);
        
        if (err.message.includes('self signed certificate')) {
            console.log('\n💡 Tip: It seems like an SSL issue. Neon requires SSL.');
        } else if (err.message.includes('ENOTFOUND')) {
            console.log('\n💡 Tip: Hostname could not be found. Check your connection string.');
        } else if (err.message.includes('password authentication failed')) {
            console.log('\n💡 Tip: Check your username and password.');
        }
        
        process.exit(1);
    }
}

testNeonConnection();

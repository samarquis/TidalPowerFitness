
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const passwords = [
    process.env.DB_PASSWORD,
    'changeme',
    'postgres',
    'password',
    'admin'
];

async function testConnection() {
    console.log('Testing database connections...');
    
    for (const password of passwords) {
        if (!password) continue;
        
        console.log(`Testing with password: ${password === process.env.DB_PASSWORD ? 'ENV_PASSWORD' : password}`);
        const client = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'tidal_power_fitness',
            user: process.env.DB_USER || 'postgres',
            password: password
        });

        try {
            await client.connect();
            console.log(`SUCCESS: Connected with password: ${password === process.env.DB_PASSWORD ? 'ENV_PASSWORD' : password}`);
            await client.end();
            return;
        } catch (err: any) {
            console.log(`FAILED with password ${password === process.env.DB_PASSWORD ? 'ENV_PASSWORD' : password}: ${err.message}`);
        }
    }
    console.log('All attempts failed.');
}

testConnection();

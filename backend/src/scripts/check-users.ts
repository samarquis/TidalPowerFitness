import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'tidal_power_fitness',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'SaSj1996#4',
});

async function checkUsers() {
    try {
        const result = await pool.query('SELECT id, email, first_name, last_name, roles, is_active FROM users');
        console.log('--- Users in Database ---');
        result.rows.forEach(user => {
            console.log(`ID: ${user.id} | Email: ${user.email} | Name: ${user.first_name} ${user.last_name} | Roles: ${user.roles} | Active: ${user.is_active}`);
        });
    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await pool.end();
    }
}

checkUsers();

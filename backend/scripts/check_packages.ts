import { query } from '../src/config/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkPackages() {
    try {
        const result = await query('SELECT name, price_cents, credit_count, type FROM packages ORDER BY type, price_cents ASC');
        console.log('--- Current Packages in Database ---');
        console.table(result.rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkPackages();

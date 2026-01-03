require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'tidal_power_fitness',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function checkPackages() {
  try {
    const result = await pool.query("SELECT name, credit_count, price_cents, is_active FROM packages;");
    console.log('--- Current Packages ---');
    console.table(result.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkPackages();

const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'tidal_power_fitness',
  user: 'postgres',
  password: '', // Assuming default or env handled
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

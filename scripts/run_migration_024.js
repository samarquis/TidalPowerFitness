require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'tidal_power_fitness',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function runMigration() {
  const migrationPath = path.join(__dirname, '../backend/migrations/024_add_movement_pattern_to_exercises.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('Running migration 024...');
  
  try {
    await pool.query(sql);
    console.log('Migration 024 completed successfully.');
  } catch (err) {
    console.error('Error running migration 024:', err);
  } finally {
    await pool.end();
  }
}

runMigration();

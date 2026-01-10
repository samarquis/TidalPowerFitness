const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const targetUser = {
  email: 'tidalpowerfitness@gmail.com',
  first_name: 'Lisa',
  last_name: 'Baumgard',
  role: 'admin',
  roles: ['admin', 'trainer', 'client'],
  password_hash: '$2b$10$7kVTKDYfw5fvqxm7lbPETOVlK9j9BhEQC6b8rD9E1wbcbwlIRd5Y6', // Default: admin123
  phone: '555-0003'
};

async function restoreLisa() {
  console.log('--- RESTORE LISA ACCOUNT ---');
  let client;
  try {
    client = await pool.connect();
    console.log(`Searching for and restoring user: ${targetUser.email}`);
    
    // UPSERT user
    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, roles, phone, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       ON CONFLICT (email) DO UPDATE 
       SET first_name = $3, last_name = $4, role = $5, roles = $6, is_active = true
       RETURNING id`,
      [targetUser.email, targetUser.password_hash, targetUser.first_name, targetUser.last_name, targetUser.role, targetUser.roles, targetUser.phone]
    );

    const userId = userRes.rows[0].id;
    console.log(`User ID for ${targetUser.email} is ${userId}`);

    // Ensure trainer profile exists
    await client.query(
      `INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (user_id) DO UPDATE
       SET is_accepting_clients = true
       WHERE trainer_profiles.user_id = $1`,
      [
        userId, 
        `${targetUser.first_name} is a professional trainer and the primary client at Tidal Power Fitness.`,
        ['Strength Training', 'Fitness', 'Client Success'],
        ['Certified Trainer'],
        10
      ]
    );
    
    console.log(`SUCCESS: Successfully restored and updated account for ${targetUser.email} (Lisa Baumgard)`);
  } catch (err) {
    console.error('CRITICAL ERROR during restoration:', err);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

restoreLisa();

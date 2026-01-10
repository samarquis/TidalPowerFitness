const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const users = [
  {
    email: 'samarquis4@gmail.com',
    first_name: 'Scott',
    last_name: 'Marquis',
    role: 'admin',
    roles: ['admin', 'trainer', 'client'],
    password_hash: '$2b$10$7kVTKDYfw5fvqxm7lbPETOVlK9j9BhEQC6b8rD9E1wbcbwlIRd5Y6', // admin123
    phone: '555-0001'
  },
  {
    email: 'lisa.baumgard@tidalpower.com',
    first_name: 'Lisa',
    last_name: 'Baumgard',
    role: 'admin',
    roles: ['admin', 'trainer', 'client'],
    password_hash: '$2b$10$7kVTKDYfw5fvqxm7lbPETOVlK9j9BhEQC6b8rD9E1wbcbwlIRd5Y6', // admin123
    phone: '555-0002'
  }
];

async function restoreUsers() {
  const client = await pool.connect();
  try {
    for (const user of users) {
      console.log(`Processing user: ${user.email}`);
      
      // UPSERT user
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, roles, phone, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true)
         ON CONFLICT (email) DO UPDATE 
         SET role = $5, roles = $6, first_name = $3, last_name = $4, is_active = true
         RETURNING id`,
        [user.email, user.password_hash, user.first_name, user.last_name, user.role, user.roles, user.phone]
      );

      const userId = userRes.rows[0].id;

      // Ensure trainer profile exists if they are trainers
      if (user.roles.includes('trainer')) {
        await client.query(
          `INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients)
           VALUES ($1, $2, $3, $4, $5, true)
           ON CONFLICT (user_id) DO NOTHING`,
          [
            userId, 
            `${user.first_name} is a professional trainer at Tidal Power Fitness.`,
            ['Strength Training', 'Fitness'],
            ['Certified Trainer'],
            5
          ]
        );
      }
      
      console.log(`Successfully restored ${user.email}`);
    }
  } catch (err) {
    console.error('Error during restoration:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

restoreUsers();

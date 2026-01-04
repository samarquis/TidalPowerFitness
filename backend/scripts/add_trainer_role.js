const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' }); // Load .env from project root

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addTrainerRoleToUser(email) {
  try {
    const res = await pool.query(
      `UPDATE users
       SET roles = array_append(roles, 'trainer')
       WHERE email = $1 AND NOT ('trainer' = ANY(roles))
       RETURNING id, email, roles;`,
      [email]
    );

    if (res.rowCount > 0) {
      console.log(`Successfully added 'trainer' role to user: ${res.rows[0].email}. New roles: ${res.rows[0].roles.join(', ')}`);
    } else {
      console.log(`User with email ${email} not found, or already has 'trainer' role.`);
    }
  } catch (err) {
    console.error('Error adding trainer role:', err);
  } finally {
    await pool.end();
  }
}

const userEmail = 'scott.marquis@tidalpower.com';
addTrainerRoleToUser(userEmail);

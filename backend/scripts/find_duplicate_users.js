const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' }); // Load .env from project root

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function findDuplicateUsers(emailSearchTerm) {
  try {
    const res = await pool.query(
      `SELECT id, email, first_name, last_name, roles
       FROM users
       WHERE email ILIKE $1;`,
      [`%${emailSearchTerm}%`]
    );

    if (res.rowCount > 0) {
      console.log(`Found the following users matching '${emailSearchTerm}':`);
      console.table(res.rows);
    } else {
      console.log(`No users found matching '${emailSearchTerm}'.`);
    }
  } catch (err) {
    console.error('Error finding duplicate users:', err);
  } finally {
    await pool.end();
  }
}

const searchTerm = 'scott.marquis';
findDuplicateUsers(searchTerm);

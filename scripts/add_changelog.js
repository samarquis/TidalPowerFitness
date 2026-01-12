const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addLog() {
  try {
    const adminRes = await pool.query("SELECT id FROM users WHERE email = 'samarquis4@gmail.com'");
    const adminId = adminRes.rows[0]?.id;

    if (!adminId) {
        console.error('Admin not found');
        return;
    }

    const content = `
- **User Cleanup:** Removed unauthorized test accounts.
- **Trainer Wizard:** Fixed "Classes not loading" bug. Trainers can now select a class before picking a date.
- **Templates:** Resolved visibility issue for "Today", "Leg Pull", and "Scott Testing" templates.
- **Change Log:** Restored the public Change Log page.
- **System:** Hardened database constraints and cleanup scripts.
    `.trim();

    await pool.query(
      `INSERT INTO changelogs (version, title, content, category, is_published, published_at, created_by) 
       VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
      ['1.3.0', 'Quality of Life & Workflow Fixes', content, 'fix', true, adminId]
    );
    console.log('Changelog inserted');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

addLog();

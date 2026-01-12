const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yWkpVTmiLa87@ep-rapid-thunder-a8fpv4sr-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
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
- **Responsive Navigation:** Fixed Issue #9. Navigation bar elements no longer overlap on tablet devices.
- **Workout Summary Stability:** Fixed Issue #13. Mission Accomplished page is now resilient to missing data.
- **Wizard Class Loading:** Fixed Issue #7. Trainers can now select classes regardless of date selection.
- **Public Changelog:** Fixed Issue #18. Restored transparency with a public version history page at /changelog.
- **Data Integrity:** Performed a comprehensive user table cleanup (SR-008).
- **Backend Robustness:** Enhanced bulk logging diagnostics to resolve Issue #14.
    `.trim();

    await pool.query(
      `INSERT INTO changelogs (version, title, content, category, is_published, published_at, created_by) 
       VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
      ['1.4.0', 'Platform Stability & Responsive UI Pass', content, 'improvement', true, adminId]
    );
    console.log('Changelog v1.4.0 inserted');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

addLog();

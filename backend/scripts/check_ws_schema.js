const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yWkpVTmiLa87@ep-rapid-thunder-a8fpv4sr-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
});

async function checkSchema() {
  try {
    const res = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'workout_sessions'"
    );
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkSchema();

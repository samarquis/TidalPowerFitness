const pg = require('pg');
const pool = new pg.Pool({
    connectionString: 'postgres://postgres@localhost:5432/tidal_power_fitness'
});

async function elevate() {
    try {
        const email = 'audittrainer@example.com';
        const res = await pool.query(
            "UPDATE users SET roles = ARRAY['trainer'], role = 'trainer' WHERE email = $1 RETURNING id, email, roles",
            [email]
        );
        console.log('Update result:', res.rows);
        if (res.rows.length === 0) {
            console.log('User not found. Check if registration succeeded.');
        }
    } catch (err) {
        console.error('Error elevating user:', err);
    } finally {
        await pool.end();
    }
}

elevate();

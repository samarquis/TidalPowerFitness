const pg = require('pg');
const bcrypt = require('bcrypt');

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tidal_power_fitness',
    port: 5432,
    // No password for local dev usually
});

async function resetTrainer() {
    try {
        const password = 'Password123!';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const email = 'john.smith@tidalpower.com';

        const res = await pool.query(
            "UPDATE users SET password_hash = $1, roles = ARRAY['trainer'], role = 'trainer' WHERE email = $2 RETURNING id, email",
            [hash, email]
        );

        console.log('Update result:', res.rows);
        if (res.rows.length === 0) {
            console.log('User not found. Inserting fresh trainer...');
            await pool.query(
                "INSERT INTO users (email, password_hash, first_name, last_name, role, roles) VALUES ($1, $2, 'John', 'Smith', 'trainer', ARRAY['trainer'])",
                [email, hash]
            );
            console.log('Inserted fresh trainer.');
        }
    } catch (err) {
        console.error('Error resetting trainer:', err);
    } finally {
        await pool.end();
    }
}

resetTrainer();

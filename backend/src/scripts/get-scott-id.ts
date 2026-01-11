import pool from '../config/db';

async function getScott() {
    try {
        const res = await pool.query("SELECT id FROM users WHERE email = 'samarquis4@gmail.com'");
        console.log('SCOTT_ID:', res.rows[0]?.id);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

getScott();

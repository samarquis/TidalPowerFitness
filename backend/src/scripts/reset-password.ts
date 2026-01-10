import pool from '../config/db';
import bcrypt from 'bcrypt';

async function resetPassword() {
    try {
        const hash = await bcrypt.hash('admin123', 10);
        await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, 'lisa.baumgard@tidalpower.com']);
        console.log('Password reset for Lisa Baumgard');
    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
}

resetPassword();

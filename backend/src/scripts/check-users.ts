import pool from '../config/db';

async function checkUsers() {
    try {
        const result = await pool.query('SELECT id, email, first_name, last_name, roles, is_active FROM users');
        console.log('--- Users in Database ---');
        result.rows.forEach(user => {
            console.log(`ID: ${user.id} | Email: ${user.email} | Name: ${user.first_name} ${user.last_name} | Roles: ${user.roles} | Active: ${user.is_active}`);
        });
    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await pool.end();
    }
}

checkUsers();
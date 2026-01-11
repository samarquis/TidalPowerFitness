import pool from '../config/db';

async function checkDuplicates() {
    try {
        const result = await pool.query(`
            SELECT email, COUNT(*), ARRAY_AGG(id) as ids, ARRAY_AGG(roles) as roles_list
            FROM users 
            GROUP BY email 
            HAVING COUNT(*) > 1
        `);
        
        if (result.rows.length === 0) {
            console.log('✅ No duplicate emails found in users table.');
        } else {
            console.log('🚨 Duplicate emails found:');
            result.rows.forEach(row => {
                console.log(`Email: ${row.email} | Count: ${row.count}`);
                console.log(`  IDs: ${row.ids}`);
                console.log(`  Roles Lists: ${JSON.stringify(row.roles_list)}`);
            });
        }
    } catch (error) {
        console.error('Error checking duplicates:', error);
    } finally {
        await pool.end();
    }
}

checkDuplicates();


import pool from './src/config/db';

async function checkClasses() {
    try {
        console.log('Checking classes in database...');
        const result = await pool.query('SELECT id, name, is_active FROM classes');
        console.log(`Found ${result.rows.length} classes.`);
        result.rows.forEach(c => {
            console.log(`- [${c.is_active ? 'ACTIVE' : 'INACTIVE'}] ${c.name} (${c.id})`);
        });
    } catch (error) {
        console.error('Error querying database:', error);
    } finally {
        await pool.end();
    }
}

checkClasses();

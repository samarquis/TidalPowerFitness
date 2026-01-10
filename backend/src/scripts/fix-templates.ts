import pool from '../config/db';

async function fixTemplates() {
    try {
        console.log('--- Setting core templates to public ---');
        const res = await pool.query(`
            UPDATE workout_templates 
            SET is_public = true 
            WHERE name IN ('Today', 'Leg pull', 'Scott Testing')
            RETURNING name, is_public
        `);
        
        if (res.rowCount === 0) {
            console.log('No matching templates found to update.');
        } else {
            res.rows.forEach(t => {
                console.log(`Updated: ${t.name} | Public: ${t.is_public}`);
            });
        }
    } catch (error) {
        console.error('Error fixing templates:', error);
    } finally {
        await pool.end();
    }
}

fixTemplates();

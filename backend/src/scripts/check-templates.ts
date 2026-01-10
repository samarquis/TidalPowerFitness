import pool from '../config/db';

async function checkTemplates() {
    try {
        const result = await pool.query(`
            SELECT wt.id, wt.name, u.email as trainer_email, COUNT(te.id) as exercises
            FROM workout_templates wt
            LEFT JOIN users u ON wt.trainer_id = u.id
            LEFT JOIN template_exercises te ON wt.id = te.template_id
            GROUP BY wt.id, wt.name, u.email
        `);
        
        console.log('--- Workout Templates in Database ---');
        if (result.rows.length === 0) {
            console.log('No templates found.');
        } else {
            result.rows.forEach(t => {
                console.log(`ID: ${t.id} | Name: ${t.name} | Trainer: ${t.trainer_email} | Exercises: ${t.exercises}`);
            });
        }
    } catch (error) {
        console.error('Error checking templates:', error);
    } finally {
        await pool.end();
    }
}

checkTemplates();

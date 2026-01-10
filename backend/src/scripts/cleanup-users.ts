import pool from '../config/db';

async function cleanupUsers() {
    const keepEmails = ['samarquis4@gmail.com', 'lisa.baumgard@tidalpower.com'];
    
    try {
        console.log('--- Starting Comprehensive User Cleanup & Restoration ---');
        
        // 1. Ensure Lisa exists first (restoration)
        console.log('Ensuring Lisa Baumgard exists...');
        await pool.query(`
            INSERT INTO users (email, password_hash, first_name, last_name, role, roles, phone)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (email) DO NOTHING
        `, [
            'lisa.baumgard@tidalpower.com', 
            '$2b$10$7kVTKDYfw5fvqxm7lbPETOVlK9j9BhEQC6b8rD9E1wbcbwlIRd5Y6', 
            'Lisa', 
            'Baumgard', 
            'admin', 
            ['admin', 'trainer'], 
            '555-0002'
        ]);

        // 2. Get IDs of users we want to keep
        const keepRes = await pool.query(
            'SELECT id, email FROM users WHERE email = $1 OR email = $2',
            keepEmails
        );
        
        const keepIds = keepRes.rows.map(u => u.id);
        const keepEmailsFound = keepRes.rows.map(u => u.email);
        
        console.log('Keeping users IDs:', keepIds);
        console.log('Keeping users Emails:', keepEmailsFound);

        // 3. Identify users to delete
        const usersToDeleteRes = await pool.query(
            'SELECT id FROM users WHERE id NOT IN (' + keepIds.map((_, i) => `$${i + 1}`).join(',') + ')',
            keepIds
        );
        const deleteIds = usersToDeleteRes.rows.map(u => u.id);

        if (deleteIds.length === 0) {
            console.log('No users to delete.');
        } else {
            console.log(`Deleting ${deleteIds.length} users and their related data...`);

            // 4. Clear all dependent data for these specific users
            const idList = deleteIds.map((_, i) => `$${i + 1}`).join(',');
            
            const queries = [
                { table: 'session_participants', userCol: 'client_id' },
                { table: 'class_participants', userCol: 'user_id' },
                { table: 'bookings', userCol: 'user_id' },
                { table: 'workout_sessions', userCol: 'client_id' },
                { table: 'workout_sessions', userCol: 'trainer_id' },
                { table: 'workout_templates', userCol: 'user_id' },
                { table: 'exercise_logs', userCol: 'user_id' },
                { table: 'client_progress_metrics', userCol: 'client_id' },
                { table: 'client_progress_metrics', userCol: 'recorded_by' },
                { table: 'user_credits', userCol: 'user_id' },
                { table: 'cart_items', userCol: 'user_id' },
                { table: 'user_achievements', userCol: 'user_id' },
                { table: 'user_streaks', userCol: 'user_id' },
                { table: 'trainer_clients', userCol: 'trainer_id' },
                { table: 'trainer_clients', userCol: 'client_id' },
                { table: 'notifications', userCol: 'user_id' },
                { table: 'subscriptions', userCol: 'user_id' },
                { table: 'payments', userCol: 'user_id' },
                { table: 'changelogs', userCol: 'user_id' },
                { table: 'program_assignments', userCol: 'client_id' },
                { table: 'program_assignments', userCol: 'assigned_by' },
                { table: 'group_challenge_participants', userCol: 'user_id' }
            ];

            for (const q of queries) {
                try {
                    const res = await pool.query(`DELETE FROM ${q.table} WHERE ${q.userCol} IN (${idList})`, deleteIds);
                    if (res.rowCount && res.rowCount > 0) {
                        console.log(`Cleared ${res.rowCount} rows from ${q.table} (${q.userCol})`);
                    }
                } catch (err: any) { }
            }

            // Final delete from users
            const finalDelete = await pool.query(`DELETE FROM users WHERE id IN (${idList})`, deleteIds);
            console.log(`Successfully deleted ${finalDelete.rowCount} users from users table.`);
        }
        
        // 5. Verify remaining users
        const remainingRes = await pool.query('SELECT email FROM users');
        console.log('--- Remaining Users ---');
        remainingRes.rows.forEach(u => console.log(`- ${u.email}`));

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await pool.end();
    }
}

cleanupUsers();

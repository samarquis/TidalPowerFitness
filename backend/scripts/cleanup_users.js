const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); 

if (!process.env.DATABASE_URL) {
    require('dotenv').config({ path: path.join(__dirname, '../../.env') });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function cleanup() {
  console.log('Running cleanup script v3');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get IDs of users to delete
    const usersRes = await client.query(
      "SELECT id, email FROM users WHERE email NOT IN ('lisa.baumgard@tidalpower.com', 'samarquis4@gmail.com')"
    );
    const userIds = usersRes.rows.map(r => r.id);
    console.log('Users to delete:', usersRes.rows.map(r => r.email).join(', '));

    if (userIds.length > 0) {
       const idsClause = userIds.map((_, i) => `$${i + 1}`).join(',');

       // 2. Delete related data (Foreign Keys)
       
       console.log('Nullifying PR links...');
       await client.query(`UPDATE personal_records SET exercise_log_id = NULL WHERE client_id IN (${idsClause})`, userIds);

       console.log('Deleting personal_records...');
       await client.query(`DELETE FROM personal_records WHERE client_id IN (${idsClause})`, userIds);

       console.log('Deleting exercise_logs...');
       await client.query(`DELETE FROM exercise_logs WHERE client_id IN (${idsClause})`, userIds);

       console.log('Deleting class_participants...');
       await client.query(`DELETE FROM class_participants WHERE user_id IN (${idsClause})`, userIds);

       console.log('Deleting session_participants...');
       await client.query(`DELETE FROM session_participants WHERE client_id IN (${idsClause})`, userIds);

       console.log('Deleting cart_items...');
       await client.query(`DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM cart WHERE user_id IN (${idsClause}))`, userIds);
       
       console.log('Deleting cart...');
       await client.query(`DELETE FROM cart WHERE user_id IN (${idsClause})`, userIds);

       console.log('Deleting client_progress_metrics...');
       await client.query(`DELETE FROM client_progress_metrics WHERE client_id IN (${idsClause})`, userIds);

       console.log('Deleting user_achievements (if exists)...');
       try { 
           await client.query('SAVEPOINT sp_achievements');
           await client.query(`DELETE FROM user_achievements WHERE user_id IN (${idsClause})`, userIds); 
           await client.query('RELEASE SAVEPOINT sp_achievements');
       } catch (e) { 
           console.log('Skipped user_achievements'); 
           await client.query('ROLLBACK TO SAVEPOINT sp_achievements');
       }

       console.log('Deleting user_credits (if exists)...');
       try { 
           await client.query('SAVEPOINT sp_credits');
           await client.query(`DELETE FROM user_credits WHERE user_id IN (${idsClause})`, userIds); 
           await client.query('RELEASE SAVEPOINT sp_credits');
       } catch (e) { 
           console.log('Skipped user_credits');
           await client.query('ROLLBACK TO SAVEPOINT sp_credits');
       }
       
       console.log('Deleting notifications (if exists)...');
       try { 
           await client.query('SAVEPOINT sp_notifications');
           await client.query(`DELETE FROM notifications WHERE user_id IN (${idsClause})`, userIds); 
           await client.query('RELEASE SAVEPOINT sp_notifications');
       } catch (e) { 
           console.log('Skipped notifications');
           await client.query('ROLLBACK TO SAVEPOINT sp_notifications');
       }

       console.log('Deleting user_roles (if exists)...');
       try { 
           await client.query('SAVEPOINT sp_roles');
           await client.query(`DELETE FROM user_roles WHERE user_id IN (${idsClause})`, userIds); 
           await client.query('RELEASE SAVEPOINT sp_roles');
       } catch (e) { 
           console.log('Skipped user_roles');
           await client.query('ROLLBACK TO SAVEPOINT sp_roles');
       }
       
       // NO FEEDBACK DELETION

       // 3. Delete Users
       console.log('Deleting users...');
       const res = await client.query(
         `DELETE FROM users WHERE id IN (${idsClause})`, userIds
       );
       console.log('Deleted users:', res.rowCount);
    } else {
        console.log('No users to delete.');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Cleanup failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup();

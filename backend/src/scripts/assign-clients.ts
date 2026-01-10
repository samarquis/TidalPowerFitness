import pool from '../config/db';

async function assignClients() {
    try {
        console.log('--- Assigning Clients to Lisa ---');
        
        // Get Lisa's ID
        const lisaRes = await pool.query("SELECT id FROM users WHERE email = 'lisa.baumgard@tidalpower.com'");
        if (lisaRes.rows.length === 0) throw new Error("Lisa not found");
        const lisaId = lisaRes.rows[0].id;

        // Get Scott's ID
        const scottRes = await pool.query("SELECT id FROM users WHERE email = 'samarquis4@gmail.com'");
        if (scottRes.rows.length === 0) throw new Error("Scott not found");
        const scottId = scottRes.rows[0].id;

        // Create relationship
        await pool.query(`
            INSERT INTO trainer_clients (trainer_id, client_id, status)
            VALUES ($1, $2, 'active')
            ON CONFLICT (trainer_id, client_id) DO NOTHING
        `, [lisaId, scottId]);

        console.log(`Assigned Scott (${scottId}) to Lisa (${lisaId})`);

    } catch (error) {
        console.error('Error assigning clients:', error);
    } finally {
        await pool.end();
    }
}

assignClients();
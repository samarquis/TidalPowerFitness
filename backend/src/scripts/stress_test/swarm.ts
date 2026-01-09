import 'dotenv/config';
import { query } from '../../config/db';

const API_URL = process.env.API_URL || 'http://127.0.0.1:5000/api';
const PASSWORD = 'stress123';

// Metrics
let successfulSessions = 0;
let failedSessions = 0;
let startTime = Date.now();

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const worker = async (userIndex: number) => {
    const email = `stress_user_${userIndex}@tidal.test`;
    console.log(`[Worker ${userIndex}] 🟢 Starting...`);

    try {
        // 1. Login
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-TPF-Request': 'true'
            },
            body: JSON.stringify({ email, password: PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed for ${email}: ${loginRes.status}`);
        
        const loginData = await loginRes.json();
        const userId = loginData.user?.id;
        
        if (!userId) {
            throw new Error(`Login successful but no userId returned for ${email}`);
        }

        // Extract cookie
        const cookie = loginRes.headers.get('set-cookie');
        if (!cookie) throw new Error('No cookie returned');
        
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': cookie,
            'X-TPF-Request': 'true'
        };

        console.log(`[Worker ${userIndex}] 👤 Authenticated as ${userId}`);

        // 2. Get Templates
        const templatesRes = await fetch(`${API_URL}/workout-templates?limit=100`, { headers });
        const templates = await templatesRes.json();

        if (!Array.isArray(templates) || templates.length === 0) {
            // Try fetching all templates if user-specific ones aren't found
            console.warn(`[Worker ${userIndex}] ⚠️ No private templates found. Trying public...`);
            const publicRes = await fetch(`${API_URL}/workout-templates?include_public=true&limit=100`, { headers });
            const publicTemplates = await publicRes.json();
            
            if (!Array.isArray(publicTemplates) || publicTemplates.length === 0) {
                console.error(`[Worker ${userIndex}] 💀 No templates available at all. Exiting.`);
                return;
            }
            templates.push(...publicTemplates);
        }

        console.log(`[Worker ${userIndex}] 🏃 Running ${templates.length} sessions...`);

        // 4. Execution Loop
        for (const template of templates) {
            try {
                // A. Start Session
                const startRes = await fetch(`${API_URL}/workout-sessions`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        trainer_id: userId,
                        template_id: template.id,
                        participant_ids: [userId], // Explicitly add self as participant
                        session_date: new Date().toISOString().split('T')[0],
                        start_time: new Date().toISOString()
                    })
                });
                
                if (!startRes.ok) {
                    const errorData = await startRes.json();
                    console.error(`[Worker ${userIndex}] ❌ Start session failed:`, JSON.stringify(errorData));
                    throw new Error(`Start session failed: ${startRes.status}`);
                }
                const session = await startRes.json();

                // B. Generate Logs (5 exercises * 3 sets = 15 logs)
                const logs = [];
                // We need the session details to get the 'session_exercise_id' map
                const sessionDetailsRes = await fetch(`${API_URL}/workout-sessions/${session.id}`, { headers });
                const sessionDetails = await sessionDetailsRes.json();

                if (sessionDetails.exercises) {
                    for (const ex of sessionDetails.exercises) {
                        for (let s = 1; s <= 3; s++) {
                            logs.push({
                                session_exercise_id: ex.id,
                                client_id: userId, // Log for self
                                set_number: s,
                                reps_completed: 10 + Math.floor(Math.random() * 5),
                                weight_used_lbs: 100 + Math.floor(Math.random() * 50),
                                notes: `Stress Log ${Math.random()}`
                            });
                        }
                    }
                }

                // C. Bulk Log
                if (logs.length > 0) {
                    const logRes = await fetch(`${API_URL}/workout-sessions/log-exercises/bulk`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ logs })
                    });
                    if (!logRes.ok) throw new Error(`Log failed: ${logRes.status}`);
                }

                // D. Finish Session
                await fetch(`${API_URL}/workout-sessions/${session.id}`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({
                        end_time: new Date().toISOString(),
                        notes: 'Completed by Swarm'
                    })
                });

                successfulSessions++;
                // Small jitter to prevent exact sync-step locking
                await sleep(Math.random() * 100); 

            } catch (err: any) {
                console.error(`[Worker ${userIndex}] ❌ Session Error:`, err.message);
                failedSessions++;
            }
        }

    } catch (error: any) {
        console.error(`[Worker ${userIndex}] 💀 CRITICAL FAILURE:`, error.message);
    }
    
    console.log(`[Worker ${userIndex}] 🏁 Finished.`);
};

const runSwarm = async () => {
    console.log('🐝 Releasing the Swarm (15 concurrent users)...');
    
    // Launch 15 workers in parallel
    const workers = [];
    for (let i = 0; i < 15; i++) {
        workers.push(worker(i));
    }

    await Promise.all(workers);

    const duration = (Date.now() - startTime) / 1000;
    console.log('\n📊 STRESS TEST RESULTS');
    console.log('-----------------------');
    console.log(`Time: ${duration.toFixed(2)}s`);
    console.log(`Total Sessions: ${successfulSessions + failedSessions}`);
    console.log(`✅ Success: ${successfulSessions}`);
    console.log(`❌ Failed: ${failedSessions}`);
    console.log(`Throughput: ${(successfulSessions / duration).toFixed(2)} sessions/sec`);
};

runSwarm();

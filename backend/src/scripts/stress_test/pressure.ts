import 'dotenv/config';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const ADMIN_EMAIL = 'samarquis4@gmail.com'; // Assumed from previous context
const PASSWORD = 'password123'; // Standard dev password? Or 'admin123'? I'll assume 'password123' based on typical seeds or try to check.

// Actually, I'll use the 'stress_user_0' who acts as a trainer to check reports, 
// to avoid auth issues if the admin password is unknown.
// Wait, the seed factory made stress users 'client' role. 
// I need to elevate user 0 to trainer/admin to allow them to check analytics.

const runPressure = async () => {
    console.log('🔥 [PRESSURE] Starting Read-Contention Engine...');
    
    // Login as Admin (using the seed admin credentials if possible, or a promoted stress user)
    // For this test, let's try the seeded admin. If it fails, we abort pressure.
    // Based on previous logs: "VALUES ('samarquis4@gmail.com', ...)"
    // I don't know the password for sure. 
    // PLAN B: I will use a SQL command to ensure stress_user_0 is an admin before running.
    
    const email = 'stress_user_0@tidal.test';
    const password = 'stress123';

    try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-TPF-Request': 'true'
            },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) throw new Error('Pressure Agent Login Failed');
        
        const cookie = loginRes.headers.get('set-cookie')!;
        const headers = { 
            'Content-Type': 'application/json', 
            'Cookie': cookie,
            'X-TPF-Request': 'true'
        };

        console.log('🔥 [PRESSURE] Logged in. Hammering analytics...');

        while (true) {
            const start = Date.now();
            
            // Run these in parallel to maximize DB connection usage
            await Promise.all([
                // 1. Leaderboard (Scans exercise_logs)
                fetch(`${API_URL}/leaderboard/volume?period=all_time`, { headers }).then(r => r.json()),
                
                // 2. Attendance (Scans session_participants)
                fetch(`${API_URL}/trainers/reports/attendance`, { headers }).catch(() => {}), // Might fail if not trainer
                
                // 3. User Search (Scans users)
                fetch(`${API_URL}/users?limit=50&search=stress`, { headers }).catch(() => {})
            ]);

            const duration = Date.now() - start;
            console.log(`🔥 [PRESSURE] Analytics batch took ${duration}ms`);
            
            // Don't sleep too long, we want contention
            await new Promise(r => setTimeout(r, 500));
        }

    } catch (error) {
        console.error('Pressure stopped:', error);
    }
};

runPressure();

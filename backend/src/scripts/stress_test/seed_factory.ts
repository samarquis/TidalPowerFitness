import 'dotenv/config';
import { query } from '../../config/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const USER_COUNT = 15;
const TEMPLATES_PER_USER = 100;
const PASSWORD = 'stress123';

const run = async () => {
    console.log('🏭 [FACTORY] Starting Stress Test Fabrication...');
    
    try {
        // 1. Clean old stress test data in correct order
        console.log('🧹 Cleaning old stress data...');
        // Delete logs, sessions, templates for stress users
        await query(`DELETE FROM exercise_logs WHERE client_id IN (SELECT id FROM users WHERE email LIKE 'stress_user_%')`);
        await query(`DELETE FROM session_participants WHERE client_id IN (SELECT id FROM users WHERE email LIKE 'stress_user_%')`);
        await query(`DELETE FROM workout_sessions WHERE trainer_id IN (SELECT id FROM users WHERE email LIKE 'stress_user_%')`);
        await query(`DELETE FROM template_exercises WHERE template_id IN (SELECT id FROM workout_templates WHERE trainer_id IN (SELECT id FROM users WHERE email LIKE 'stress_user_%'))`);
        await query(`DELETE FROM workout_templates WHERE trainer_id IN (SELECT id FROM users WHERE email LIKE 'stress_user_%')`);
        await query(`DELETE FROM users WHERE email LIKE 'stress_user_%'`);

        // 2. Fetch Exercises to build templates
        const exResult = await query(`SELECT id FROM exercises`);
        const exerciseIds = exResult.rows.map(r => r.id);
        
        if (exerciseIds.length < 5) {
            throw new Error('Not enough exercises in DB to run stress test. Please seed exercises first.');
        }

        const passwordHash = await bcrypt.hash(PASSWORD, 10);
        const userIds: string[] = [];

        // 3. Create Users
        console.log(`👥 Fabricating ${USER_COUNT} users...`);
        for (let i = 0; i < USER_COUNT; i++) {
            const email = `stress_user_${i}@tidal.test`;
            const userId = uuidv4();
            const roles = i === 0 ? ['admin', 'trainer', 'client'] : ['client'];
            
            await query(
                `INSERT INTO users (id, email, password_hash, first_name, last_name, roles)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                [userId, email, passwordHash, `Stress`, `User ${i}`, roles]
            );
            userIds.push(userId);
        }

        // 4. Create Templates per User
        console.log(`📝 Fabricating ${USER_COUNT * TEMPLATES_PER_USER} workout templates...`);
        let totalTemplates = 0;

        // We use a giant transaction for speed, otherwise this setup takes forever
        await query('BEGIN');

        for (const userId of userIds) {
            for (let t = 0; t < TEMPLATES_PER_USER; t++) {
                const templateId = uuidv4();
                const templateName = `Stress Protocol ${t} - User ${userId.substring(0,4)}`;
                
                // Create Template Header
                await query(
                    `INSERT INTO workout_templates (id, trainer_id, name, description, is_public)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [templateId, userId, templateName, 'Generated for load testing', false]
                );

                // Add 5 Random Exercises to this template
                const shuffledEx = [...exerciseIds].sort(() => 0.5 - Math.random());
                const selectedEx = shuffledEx.slice(0, 5);

                for (let e = 0; e < selectedEx.length; e++) {
                    await query(
                        `INSERT INTO template_exercises 
                        (template_id, exercise_id, order_in_template, suggested_sets, suggested_reps, suggested_weight_lbs, suggested_rest_seconds)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                        [templateId, selectedEx[e], e + 1, 3, 10, 135, 60]
                    );
                }
                totalTemplates++;
            }
            process.stdout.write('.'); // Progress indicator
        }
        
        await query('COMMIT');
        console.log(`\n✅ Factory Complete. Created ${userIds.length} users and ${totalTemplates} templates.`);
        
        const verifyCount = await query(`SELECT COUNT(*) FROM users WHERE email LIKE 'stress_user_%'`);
        console.log(`📊 DB Verification: Found ${verifyCount.rows[0].count} stress users in database.`);
        
    } catch (error) {
        await query('ROLLBACK');
        console.error('❌ Factory Explosion:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
};

run();

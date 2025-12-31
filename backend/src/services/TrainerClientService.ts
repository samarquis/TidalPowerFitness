import { query } from '../config/db';
import { QueryResult } from 'pg';

class TrainerClientService {
    /**
     * Verifies if a trainer is authorized to work with a specific client.
     * Authorized if:
     * 1. Trainer is an admin.
     * 2. Trainer is explicitly assigned to the client in trainer_clients.
     * 3. Trainer teaches a class the client has attended.
     */
    async isAuthorized(trainerId: string, clientId: string, roles: string[] = []): Promise<boolean> {
        // 1. Admin bypass
        if (roles.includes('admin')) return true;

        // 2. Explicit assignment
        const assignmentCheck = await query(
            "SELECT 1 FROM trainer_clients WHERE trainer_id = $1 AND client_id = $2 AND status = 'active'",
            [trainerId, clientId]
        );
        if (assignmentCheck.rows.length > 0) return true;

        // 3. Class attendance overlap
        const classCheck = await query(
            `SELECT 1 FROM class_participants cp
             JOIN classes c ON cp.class_id = c.id
             WHERE c.instructor_id = $1 AND cp.user_id = $2 AND cp.status = 'confirmed'
             LIMIT 1`,
            [trainerId, clientId]
        );
        
        return classCheck.rows.length > 0;
    }

    /**
     * Assigns a client to a trainer.
     */
    async assignClient(trainerId: string, clientId: string): Promise<void> {
        await query(
            `INSERT INTO trainer_clients (trainer_id, client_id) 
             VALUES ($1, $2) 
             ON CONFLICT (trainer_id, client_id) 
             DO UPDATE SET status = 'active'`,
            [trainerId, clientId]
        );
    }

    /**
     * Lists all clients for a trainer.
     */
    async getTrainerClients(trainerId: string): Promise<any[]> {
        const result = await query(
            `SELECT DISTINCT u.id, u.first_name, u.last_name, u.email
             FROM users u
             LEFT JOIN trainer_clients tc ON u.id = tc.client_id AND tc.trainer_id = $1
             LEFT JOIN class_participants cp ON u.id = cp.user_id
             LEFT JOIN classes c ON cp.class_id = c.id AND c.instructor_id = $1
             WHERE tc.id IS NOT NULL OR (c.id IS NOT NULL AND cp.status = 'confirmed')`,
            [trainerId]
        );
        return result.rows;
    }
}

export default new TrainerClientService();

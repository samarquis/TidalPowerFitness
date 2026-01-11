import { query } from '../config/db';
import crypto from 'crypto';

export interface ErrorLogInput {
    message: string;
    stack_trace?: string;
    url?: string;
    component_name?: string;
    user_id?: string;
    user_role?: string;
    browser_info?: any;
}

class ErrorLogModel {
    /**
     * Generates a unique SHA-256 hash for an error based on message and stack
     */
    generateFingerprint(message: string, stack?: string): string {
        const cleanStack = stack ? stack.split('\n').slice(0, 3).join('') : ''; // Use top of stack for grouping
        return crypto.createHash('sha256').update(message + cleanStack).digest('hex');
    }

    async report(input: ErrorLogInput) {
        const fingerprint = this.generateFingerprint(input.message, input.stack_trace);

        // Try to update existing first (Deduplication)
        const updateResult = await query(
            `UPDATE error_logs 
             SET occurrence_count = occurrence_count + 1, 
                 last_seen = CURRENT_TIMESTAMP,
                 resolved = false
             WHERE fingerprint = $1
             RETURNING *`,
            [fingerprint]
        );

        if (updateResult.rows.length > 0) {
            return { entry: updateResult.rows[0], isNew: false };
        }

        // Create new record
        const insertResult = await query(
            `INSERT INTO error_logs (
                fingerprint, message, stack_trace, url, component_name, 
                user_id, user_role, browser_info
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                fingerprint, input.message, input.stack_trace, input.url, 
                input.component_name, input.user_id, input.user_role, 
                JSON.stringify(input.browser_info || {})
            ]
        );

        return { entry: insertResult.rows[0], isNew: true };
    }

    async updateGithubInfo(id: string, url: string, number: number) {
        await query(
            'UPDATE error_logs SET github_issue_url = $1, github_issue_number = $2 WHERE id = $3',
            [url, number, id]
        );
    }
}

export default new ErrorLogModel();

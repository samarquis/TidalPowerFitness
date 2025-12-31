import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface Program {
    id: string;
    trainer_id: string;
    name: string;
    description?: string;
    total_weeks: number;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ProgramTemplate {
    id: string;
    program_id: string;
    template_id: string;
    week_number: number;
    day_number: number;
    order_in_day: number;
}

export interface ProgramAssignment {
    id: string;
    client_id: string;
    program_id: string;
    trainer_id: string;
    start_date: Date;
    current_week: number;
    current_day: number;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateProgramInput {
    trainer_id: string;
    name: string;
    description?: string;
    total_weeks?: number;
    is_public?: boolean;
    templates: Array<{
        template_id: string;
        week_number: number;
        day_number: number;
        order_in_day?: number;
    }>;
}

class ProgramModel {
    // Get all programs for a trainer (including collaborated ones)
    async getByTrainer(trainerId: string, includePublic: boolean = true): Promise<Program[]> {
        let sql = `
            SELECT p.*, 
                   COUNT(DISTINCT pt.id) as template_count,
                   u.first_name || ' ' || u.last_name as trainer_name,
                   EXISTS(SELECT 1 FROM program_collaborators pc WHERE pc.program_id = p.id AND pc.trainer_id = $1) as is_collaborator
            FROM programs p
            JOIN users u ON p.trainer_id = u.id
            LEFT JOIN program_templates pt ON p.id = pt.program_id
            LEFT JOIN program_collaborators pc ON p.id = pc.program_id
            WHERE p.trainer_id = $1 OR pc.trainer_id = $1
        `;

        if (includePublic) {
            sql += ' OR p.is_public = true';
        }

        sql += ' GROUP BY p.id, u.first_name, u.last_name ORDER BY p.created_at DESC';

        const result: QueryResult = await query(sql, [trainerId]);
        return result.rows;
    }

    // Get program by ID with its templates
    async getById(id: string): Promise<any | null> {
        const programResult: QueryResult = await query(
            `SELECT p.*, 
                    u.first_name || ' ' || u.last_name as trainer_name
             FROM programs p
             JOIN users u ON p.trainer_id = u.id
             WHERE p.id = $1`,
            [id]
        );

        if (programResult.rows.length === 0) {
            return null;
        }

        const program = programResult.rows[0];

        // Get templates mapped to this program
        const templatesResult: QueryResult = await query(
            `SELECT pt.*, 
                    wt.name as template_name,
                    wt.description as template_description
             FROM program_templates pt
             JOIN workout_templates wt ON pt.template_id = wt.id
             WHERE pt.program_id = $1
             ORDER BY pt.week_number ASC, pt.day_number ASC, pt.order_in_day ASC`,
            [id]
        );

        program.templates = templatesResult.rows;

        // Get collaborators
        const collaboratorsResult: QueryResult = await query(
            `SELECT pc.*, u.first_name, u.last_name, u.email
             FROM program_collaborators pc
             JOIN users u ON pc.trainer_id = u.id
             WHERE pc.program_id = $1`,
            [id]
        );

        program.collaborators = collaboratorsResult.rows;

        return program;
    }

    // Create new program
    async create(input: CreateProgramInput): Promise<Program> {
        // Use a transaction for program + templates
        // Note: The current db helper doesn't support easy transactions yet, 
        // but we'll use raw queries for now as seen in other models.
        
        await query('BEGIN');

        try {
            const programResult: QueryResult = await query(
                `INSERT INTO programs (
                    trainer_id, name, description, total_weeks, is_public
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [
                    input.trainer_id,
                    input.name,
                    input.description || null,
                    input.total_weeks || 1,
                    input.is_public || false
                ]
            );

            const program = programResult.rows[0];

            if (input.templates && input.templates.length > 0) {
                for (const t of input.templates) {
                    await query(
                        `INSERT INTO program_templates (
                            program_id, template_id, week_number, day_number, order_in_day
                        ) VALUES ($1, $2, $3, $4, $5)`,
                        [
                            program.id,
                            t.template_id,
                            t.week_number,
                            t.day_number,
                            t.order_in_day || 1
                        ]
                    );
                }
            }

            await query('COMMIT');
            return program;
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
    }

    // Assign program to client
    async assignToClient(data: {
        client_id: string;
        program_id: string;
        trainer_id: string;
        start_date?: Date;
        notes?: string;
    }): Promise<ProgramAssignment> {
        const result: QueryResult = await query(
            `INSERT INTO program_assignments (
                client_id, program_id, trainer_id, start_date, notes
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                data.client_id,
                data.program_id,
                data.trainer_id,
                data.start_date || new Date(),
                data.notes || null
            ]
        );

        return result.rows[0];
    }

    // Get active assignment for client
    async getActiveAssignment(clientId: string): Promise<any | null> {
        const result: QueryResult = await query(
            `SELECT pa.*, 
                    p.name as program_name,
                    p.total_weeks
             FROM program_assignments pa
             JOIN programs p ON pa.program_id = p.id
             WHERE pa.client_id = $1 AND pa.status = 'active'
             ORDER BY pa.created_at DESC
             LIMIT 1`,
            [clientId]
        );

        if (result.rows.length === 0) return null;
        
        const assignment = result.rows[0];

        // Get the specific workout for the current day/week
        const nextWorkoutResult: QueryResult = await query(
            `SELECT pt.*, 
                    wt.id as workout_template_id,
                    wt.name as workout_name
             FROM program_templates pt
             JOIN workout_templates wt ON pt.template_id = wt.id
             WHERE pt.program_id = $1 
               AND pt.week_number = $2 
               AND pt.day_number = $3
             ORDER BY pt.order_in_day ASC
             LIMIT 1`,
            [assignment.program_id, assignment.current_week, assignment.current_day]
        );

        assignment.next_workout = nextWorkoutResult.rows[0] || null;

        return assignment;
    }

    // Update assignment progress
    async updateProgress(assignmentId: string, week: number, day: number): Promise<void> {
        await query(
            'UPDATE program_assignments SET current_week = $1, current_day = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
            [week, day, assignmentId]
        );
    }

    // Add collaborator
    async addCollaborator(programId: string, trainerId: string, canEdit: boolean = false): Promise<void> {
        await query(
            'INSERT INTO program_collaborators (program_id, trainer_id, can_edit) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
            [programId, trainerId, canEdit]
        );
    }

    // Remove collaborator
    async removeCollaborator(programId: string, trainerId: string): Promise<void> {
        await query(
            'DELETE FROM program_collaborators WHERE program_id = $1 AND trainer_id = $2',
            [programId, trainerId]
        );
    }

    // Intelligently advance progress to the next scheduled workout
    async advanceProgress(assignmentId: string): Promise<void> {
        const assignmentResult: QueryResult = await query(
            'SELECT pa.*, p.total_weeks FROM program_assignments pa JOIN programs p ON pa.program_id = p.id WHERE pa.id = $1',
            [assignmentId]
        );

        if (assignmentResult.rows.length === 0) return;
        const assignment = assignmentResult.rows[0];

        // Find the absolute next workout in the schedule (any day after current)
        const nextResult: QueryResult = await query(
            `SELECT week_number, day_number 
             FROM program_templates 
             WHERE program_id = $1 
               AND (week_number > $2 OR (week_number = $2 AND day_number > $3))
             ORDER BY week_number ASC, day_number ASC, order_in_day ASC
             LIMIT 1`,
            [assignment.program_id, assignment.current_week, assignment.current_day]
        );

        if (nextResult.rows.length > 0) {
            const next = nextResult.rows[0];
            await this.updateProgress(assignmentId, next.week_number, next.day_number);
        } else {
            // Check if there are multiple workouts on the SAME day that aren't finished yet
            // (For simplicity, we assume one per day for now, but this handles the final completion)
            await query(
                "UPDATE program_assignments SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
                [assignmentId]
            );
        }
    }
}

export default new ProgramModel();

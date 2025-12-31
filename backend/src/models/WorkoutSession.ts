import { query } from '../config/db';
import { QueryResult } from 'pg';
import WorkoutTemplateModel from './WorkoutTemplate';
import ProgressModel from './Progress';

export interface WorkoutSession {
    id: string;
    trainer_id: string;
    class_id?: string;
    template_id?: string;
    program_assignment_id?: string;
    workout_type_id?: string;
    session_date: Date;
    start_time?: Date;
    end_time?: Date;
    duration_minutes?: number;
    notes?: string;
    is_published: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateSessionInput {
    trainer_id: string;
    class_id?: string;
    template_id?: string;
    program_assignment_id?: string;
    workout_type_id?: string;
    session_date: Date;
    start_time?: Date;
    notes?: string;
    participant_ids?: string[];
    body_focus_ids?: string[];
    exercises?: Array<{
        exercise_id: string;
        order_in_session: number;
        planned_sets?: number;
        planned_reps?: number;
        planned_weight_lbs?: number;
        rest_seconds?: number;
        notes?: string;
    }>;
}

export interface ExerciseLog {
    session_exercise_id: string;
    client_id: string;
    set_number: number;
    reps_completed?: number;
    weight_used_lbs?: number;
    duration_seconds?: number;
    distance_miles?: number;
    rest_taken_seconds?: number;
    rpe?: number;
    form_rating?: number;
    notes?: string;
    logged_by: string;
}

class WorkoutSessionModel {
    // Get sessions by trainer
    async getByTrainer(trainerId: string, filters?: {
        start_date?: Date;
        end_date?: Date;
        class_id?: string;
    }): Promise<WorkoutSession[]> {
        let sql = `
            SELECT ws.*,
                   wt.name as workout_type_name,
                   c.name as class_name,
                   COUNT(DISTINCT sp.client_id) as participant_count
            FROM workout_sessions ws
            LEFT JOIN workout_types wt ON ws.workout_type_id = wt.id
            LEFT JOIN classes c ON ws.class_id = c.id
            LEFT JOIN session_participants sp ON ws.id = sp.session_id
            WHERE ws.trainer_id = $1
        `;

        const params: any[] = [trainerId];
        let paramCount = 2;

        if (filters?.start_date) {
            sql += ` AND ws.session_date >= $${paramCount}`;
            params.push(filters.start_date);
            paramCount++;
        }

        if (filters?.end_date) {
            sql += ` AND ws.session_date <= $${paramCount}`;
            params.push(filters.end_date);
            paramCount++;
        }

        if (filters?.class_id) {
            sql += ` AND ws.class_id = $${paramCount}`;
            params.push(filters.class_id);
            paramCount++;
        }

        sql += ' GROUP BY ws.id, wt.name, c.name ORDER BY ws.session_date DESC, ws.start_time DESC';

        const result: QueryResult = await query(sql, params);
        return result.rows;
    }

    // Get all sessions (for admin)
    async getAll(filters?: {
        start_date?: Date;
        end_date?: Date;
        class_id?: string;
    }): Promise<WorkoutSession[]> {
        let sql = `
            SELECT ws.*,
                   wt.name as workout_type_name,
                   c.name as class_name,
                   COUNT(DISTINCT sp.client_id) as participant_count
            FROM workout_sessions ws
            LEFT JOIN workout_types wt ON ws.workout_type_id = wt.id
            LEFT JOIN classes c ON ws.class_id = c.id
            LEFT JOIN session_participants sp ON ws.id = sp.session_id
            WHERE 1=1
        `;

        const params: any[] = [];
        let paramCount = 1;

        if (filters?.start_date) {
            sql += ` AND ws.session_date >= $${paramCount}`;
            params.push(filters.start_date);
            paramCount++;
        }

        if (filters?.end_date) {
            sql += ` AND ws.session_date <= $${paramCount}`;
            params.push(filters.end_date);
            paramCount++;
        }

        if (filters?.class_id) {
            sql += ` AND ws.class_id = $${paramCount}`;
            params.push(filters.class_id);
            paramCount++;
        }

        sql += ' GROUP BY ws.id, wt.name, c.name ORDER BY ws.session_date DESC, ws.start_time DESC';

        const result: QueryResult = await query(sql, params);
        return result.rows;
    }

    // Get session by ID with full details
    async getById(id: string): Promise<any | null> {
        const sessionResult: QueryResult = await query(
            `SELECT ws.*,
                    wt.name as workout_type_name,
                    c.name as class_name
             FROM workout_sessions ws
             LEFT JOIN workout_types wt ON ws.workout_type_id = wt.id
             LEFT JOIN classes c ON ws.class_id = c.id
             WHERE ws.id = $1`,
            [id]
        );

        if (sessionResult.rows.length === 0) {
            return null;
        }

        const session = sessionResult.rows[0];

        // Get participants
        const participantsResult: QueryResult = await query(
            `SELECT sp.*, u.first_name, u.last_name, u.email
             FROM session_participants sp
             JOIN users u ON sp.client_id = u.id
             WHERE sp.session_id = $1`,
            [id]
        );

        // Get exercises
        const exercisesResult: QueryResult = await query(
            `SELECT se.*, e.name as exercise_name
             FROM session_exercises se
             JOIN exercises e ON se.exercise_id = e.id
             WHERE se.session_id = $1
             ORDER BY se.order_in_session ASC`,
            [id]
        );

        // Get body focus areas
        const bodyFocusResult: QueryResult = await query(
            `SELECT bf.id, bf.name
             FROM session_body_focus sbf
             JOIN body_focus_areas bf ON sbf.body_focus_id = bf.id
             WHERE sbf.session_id = $1`,
            [id]
        );

        session.participants = participantsResult.rows;
        session.exercises = exercisesResult.rows;
        session.body_focus_areas = bodyFocusResult.rows;

        return session;
    }

    // Create new session
    async create(sessionData: CreateSessionInput): Promise<WorkoutSession> {
        // If template_id is provided but no exercises, fetch them from the template
        let exercisesToInsert = sessionData.exercises || [];

        if (sessionData.template_id && exercisesToInsert.length === 0) {
            try {
                const template = await WorkoutTemplateModel.getById(sessionData.template_id);
                if (template && template.exercises) {
                    exercisesToInsert = template.exercises.map((te: any) => ({
                        exercise_id: te.exercise_id,
                        order_in_session: te.order_in_template,
                        planned_sets: te.suggested_sets,
                        planned_reps: te.suggested_reps,
                        planned_weight_lbs: te.suggested_weight_lbs,
                        rest_seconds: te.suggested_rest_seconds,
                        notes: te.notes
                    }));
                }
            } catch (error) {
                console.error('Error fetching template exercises:', error);
                // Continue without exercises if template fetch fails
            }
        }

        await query('BEGIN');

        try {
            // Create session
            const sessionResult: QueryResult = await query(
                `INSERT INTO workout_sessions (
                    trainer_id, class_id, template_id, program_assignment_id, workout_type_id,
                    session_date, start_time, notes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`,
                [
                    sessionData.trainer_id,
                    sessionData.class_id,
                    sessionData.template_id,
                    sessionData.program_assignment_id,
                    sessionData.workout_type_id,
                    sessionData.session_date,
                    sessionData.start_time,
                    sessionData.notes
                ]
            );

            const session = sessionResult.rows[0];

            // Add participants
            if (sessionData.participant_ids && sessionData.participant_ids.length > 0) {
                for (const clientId of sessionData.participant_ids) {
                    await query(
                        'INSERT INTO session_participants (session_id, client_id) VALUES ($1, $2)',
                        [session.id, clientId]
                    );
                }
            }

            // Add body focus areas
            if (sessionData.body_focus_ids && sessionData.body_focus_ids.length > 0) {
                for (const bodyFocusId of sessionData.body_focus_ids) {
                    await query(
                        'INSERT INTO session_body_focus (session_id, body_focus_id) VALUES ($1, $2)',
                        [session.id, bodyFocusId]
                    );
                }
            }

            // Add exercises
            if (exercisesToInsert && exercisesToInsert.length > 0) {
                for (const exercise of exercisesToInsert) {
                    await query(
                        `INSERT INTO session_exercises (
                            session_id, exercise_id, order_in_session,
                            planned_sets, planned_reps, planned_weight_lbs,
                            rest_seconds, notes
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [
                            session.id,
                            exercise.exercise_id,
                            exercise.order_in_session,
                            exercise.planned_sets,
                            exercise.planned_reps,
                            exercise.planned_weight_lbs,
                            exercise.rest_seconds,
                            exercise.notes
                        ]
                    );
                }
            }

            await query('COMMIT');
            return session;
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
    }

    // Update session
    async update(id: string, updates: Partial<WorkoutSession>): Promise<WorkoutSession | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) return null;

        values.push(id);
        const result = await query(
            `UPDATE workout_sessions SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        return result.rows[0] || null;
    }

    // Log exercise set (with UPSERT support)
    async logExercise(logData: ExerciseLog): Promise<any> {
        const result: QueryResult = await query(
            `INSERT INTO exercise_logs (
                session_exercise_id, client_id, set_number,
                reps_completed, weight_used_lbs, duration_seconds,
                distance_miles, rest_taken_seconds, rpe, form_rating,
                notes, logged_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (session_exercise_id, client_id, set_number) 
            DO UPDATE SET 
                reps_completed = EXCLUDED.reps_completed,
                weight_used_lbs = EXCLUDED.weight_used_lbs,
                duration_seconds = EXCLUDED.duration_seconds,
                distance_miles = EXCLUDED.distance_miles,
                rest_taken_seconds = EXCLUDED.rest_taken_seconds,
                rpe = EXCLUDED.rpe,
                form_rating = EXCLUDED.form_rating,
                notes = EXCLUDED.notes,
                logged_by = EXCLUDED.logged_by,
                logged_at = CURRENT_TIMESTAMP
            RETURNING *`,
            [
                logData.session_exercise_id,
                logData.client_id,
                logData.set_number,
                logData.reps_completed,
                logData.weight_used_lbs,
                logData.duration_seconds,
                logData.distance_miles,
                logData.rest_taken_seconds,
                logData.rpe,
                logData.form_rating,
                logData.notes,
                logData.logged_by
            ]
        );

        const log = result.rows[0];

        // --- AUTOMATIC PR DETECTION ---
        if (log.weight_used_lbs && log.reps_completed) {
            const exerciseIdResult = await query(
                'SELECT exercise_id FROM session_exercises WHERE id = $1',
                [log.session_exercise_id]
            );

            if (exerciseIdResult.rows.length > 0) {
                const exerciseId = exerciseIdResult.rows[0].exercise_id;

                // 1. Max Weight PR
                await ProgressModel.updatePR(
                    log.client_id, exerciseId, 'max_weight',
                    log.weight_used_lbs, log.logged_at || new Date(), log.id
                );

                // 2. Max Volume PR (Weight * Reps)
                const volume = log.weight_used_lbs * log.reps_completed;
                await ProgressModel.updatePR(
                    log.client_id, exerciseId, 'max_volume',
                    volume, log.logged_at || new Date(), log.id
                );

                // 3. Max Reps PR
                await ProgressModel.updatePR(
                    log.client_id, exerciseId, 'max_reps',
                    log.reps_completed, log.logged_at || new Date(), log.id
                );
            }
        }

        return log;
    }

    // Get all logs for a specific session
    async getSessionLogs(sessionId: string): Promise<any[]> {
        const result: QueryResult = await query(
            `SELECT el.*, se.exercise_id, e.name as exercise_name
             FROM exercise_logs el
             JOIN session_exercises se ON el.session_exercise_id = se.id
             JOIN exercises e ON se.exercise_id = e.id
             WHERE se.session_id = $1
             ORDER BY el.logged_at ASC`,
            [sessionId]
        );
        return result.rows;
    }

    // Publish session to clients
    async publish(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'UPDATE workout_sessions SET is_published = true WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    // Get exercise history for a client
    async getClientHistory(clientId: string): Promise<any[]> {
        const sql = `
            SELECT 
                ws.session_date,
                ws.id as session_id,
                e.name as exercise_name,
                el.*
            FROM exercise_logs el
            JOIN session_exercises se ON el.session_exercise_id = se.id
            JOIN workout_sessions ws ON se.session_id = ws.id
            JOIN exercises e ON se.exercise_id = e.id
            WHERE el.client_id = $1
            ORDER BY ws.session_date DESC, el.set_number ASC
        `;
        const result: QueryResult = await query(sql, [clientId]);
        return result.rows;
    }

    // Get workout stats for a client
    async getClientStats(clientId: string): Promise<any> {
        const sql = `
            SELECT 
                COUNT(DISTINCT ws.id) as total_workouts,
                COUNT(DISTINCT el.id) as total_sets,
                SUM(el.weight_used_lbs * el.reps_completed) as total_volume_lbs
            FROM exercise_logs el
            JOIN session_exercises se ON el.session_exercise_id = se.id
            JOIN workout_sessions ws ON se.session_id = ws.id
            WHERE el.client_id = $1
        `;
        const result: QueryResult = await query(sql, [clientId]);
        return result.rows[0];
    }

    // Mark attendance for a session participant
    async markAttendance(sessionId: string, clientId: string, attended: boolean): Promise<any | null> {
        const result: QueryResult = await query(
            `UPDATE session_participants 
             SET attended = $3, updated_at = NOW() 
             WHERE session_id = $1 AND client_id = $2
             RETURNING *`,
            [sessionId, clientId, attended]
        );

        return result.rows[0] || null;
    }
}

export default new WorkoutSessionModel();

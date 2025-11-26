import { query } from '../config/db';
import { QueryResult } from 'pg';
import WorkoutTemplateModel from './WorkoutTemplate';

export interface WorkoutSession {
    id: string;
    trainer_id: string;
    class_id?: string;
    template_id?: string;
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
                    trainer_id, class_id, template_id, workout_type_id,
                    session_date, start_time, notes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                [
                    sessionData.trainer_id,
                    sessionData.class_id,
                    sessionData.template_id,
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

    // Log exercise set
    async logExercise(logData: ExerciseLog): Promise<any> {
        const result: QueryResult = await query(
            `INSERT INTO exercise_logs (
                session_exercise_id, client_id, set_number,
                reps_completed, weight_used_lbs, duration_seconds,
                distance_miles, rest_taken_seconds, rpe, form_rating,
                notes, logged_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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

        return result.rows[0];
    }

    // Publish session to clients
    async publish(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'UPDATE workout_sessions SET is_published = true WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export default new WorkoutSessionModel();

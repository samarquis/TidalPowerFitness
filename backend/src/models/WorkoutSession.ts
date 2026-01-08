import { query } from "../config/db";
import { QueryResult } from "pg";
import WorkoutTemplateModel from "./WorkoutTemplate";
import ProgressModel from "./Progress";

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
        is_warmup?: boolean;
        is_cooldown?: boolean;
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
    async getByTrainer(trainerId: string, filters?: {
        start_date?: Date;
        end_date?: Date;
        class_id?: string;
    }): Promise<WorkoutSession[]> {
        let sql = `
            SELECT ws.*,
                   wt.name as workout_type_name,
                   c.name as class_name,
                   COUNT(DISTINCT sp.client_id) as participant_count,
                   (SELECT COUNT(*) FROM session_exercises se WHERE se.session_id = ws.id) as exercise_count
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
        sql += " GROUP BY ws.id, wt.name, c.name ORDER BY ws.session_date DESC, ws.start_time DESC";
        const result: QueryResult = await query(sql, params);
        return result.rows;
    }

    async getAll(filters?: {
        start_date?: Date;
        end_date?: Date;
        class_id?: string;
    }): Promise<WorkoutSession[]> {
        let sql = `
            SELECT ws.*,
                   wt.name as workout_type_name,
                   c.name as class_name,
                   COUNT(DISTINCT sp.client_id) as participant_count,
                   (SELECT COUNT(*) FROM session_exercises se WHERE se.session_id = ws.id) as exercise_count
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
        sql += " GROUP BY ws.id, wt.name, c.name ORDER BY ws.session_date DESC, ws.start_time DESC";
        const result: QueryResult = await query(sql, params);
        return result.rows;
    }

    async getById(id: string): Promise<any | null> {
        const sessionResult: QueryResult = await query(
            `SELECT ws.*, wt.name as workout_type_name, c.name as class_name
             FROM workout_sessions ws
             LEFT JOIN workout_types wt ON ws.workout_type_id = wt.id
             LEFT JOIN classes c ON ws.class_id = c.id
             WHERE ws.id = $1`,
            [id]
        );
        if (sessionResult.rows.length === 0) return null;
        const session = sessionResult.rows[0];
        const participantsResult: QueryResult = await query(
            `SELECT sp.*, u.first_name, u.last_name, u.email
             FROM session_participants sp
             JOIN users u ON sp.client_id = u.id
             WHERE sp.session_id = $1`,
            [id]
        );
        const exercisesResult: QueryResult = await query(
            `SELECT se.*, e.name as exercise_name
             FROM session_exercises se
             JOIN exercises e ON se.exercise_id = e.id
             WHERE se.session_id = $1
             ORDER BY se.order_in_session ASC`,
            [id]
        );
        session.participants = participantsResult.rows;
        session.exercises = exercisesResult.rows;
        return session;
    }

    async create(sessionData: CreateSessionInput): Promise<WorkoutSession> {
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
                console.error("Error fetching template:", error);
            }
        }
        await query("BEGIN");
        try {
            const sessionResult: QueryResult = await query(
                `INSERT INTO workout_sessions (trainer_id, class_id, template_id, program_assignment_id, workout_type_id, session_date, start_time, notes)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [sessionData.trainer_id, sessionData.class_id, sessionData.template_id, sessionData.program_assignment_id, sessionData.workout_type_id, sessionData.session_date, sessionData.start_time ? new Date(sessionData.start_time) : null, sessionData.notes]
            );
            const session = sessionResult.rows[0];
            if (sessionData.participant_ids) {
                for (const clientId of sessionData.participant_ids) {
                    await query("INSERT INTO session_participants (session_id, client_id) VALUES ($1, $2)", [session.id, clientId]);
                }
            }
            if (exercisesToInsert) {
                for (const ex of exercisesToInsert) {
                    await query(
                        `INSERT INTO session_exercises (session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs, rest_seconds, notes, is_warmup, is_cooldown)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                        [session.id, ex.exercise_id, ex.order_in_session, ex.planned_sets, ex.planned_reps, ex.planned_weight_lbs, ex.rest_seconds, ex.notes, ex.is_warmup || false, ex.is_cooldown || false]
                    );
                }
            }
            await query("COMMIT");
            return session;
        } catch (error) {
            await query("ROLLBACK");
            throw error;
        }
    }

    async update(id: string, updates: Partial<WorkoutSession>): Promise<WorkoutSession | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined && key !== "id" && key !== "created_at" && key !== "updated_at") {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });
        if (fields.length === 0) return null;
        values.push(id);
        const result = await query(`UPDATE workout_sessions SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`, values);
        return result.rows[0] || null;
    }

    async logExercise(logData: ExerciseLog): Promise<any> {
        const result = await query(
            `INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, duration_seconds, distance_miles, rest_taken_seconds, rpe, form_rating, notes, logged_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (session_exercise_id, client_id, set_number)
             DO UPDATE SET reps_completed = EXCLUDED.reps_completed, weight_used_lbs = EXCLUDED.weight_used_lbs, notes = EXCLUDED.notes, logged_by = EXCLUDED.logged_by, logged_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [logData.session_exercise_id, logData.client_id, logData.set_number, logData.reps_completed, logData.weight_used_lbs, logData.duration_seconds, logData.distance_miles, logData.rest_taken_seconds, logData.rpe, logData.form_rating, logData.notes, logData.logged_by]
        );
        const log = result.rows[0];
        if (log.weight_used_lbs && log.reps_completed) {
            const exRes = await query("SELECT exercise_id FROM session_exercises WHERE id = $1", [log.session_exercise_id]);
            if (exRes.rows.length > 0) {
                const exerciseId = exRes.rows[0].exercise_id;
                await ProgressModel.updatePR(log.client_id, exerciseId, "max_weight", log.weight_used_lbs, log.logged_at || new Date(), log.id);
                const volume = log.weight_used_lbs * log.reps_completed;
                await ProgressModel.updatePR(log.client_id, exerciseId, "max_volume", volume, log.logged_at || new Date(), log.id);
                await ProgressModel.updatePR(log.client_id, exerciseId, "max_reps", log.reps_completed, log.logged_at || new Date(), log.id);
            }
        }
        return log;
    }

    async getSessionLogs(sessionId: string): Promise<any[]> {
        const result = await query(
            `SELECT se.id as session_exercise_id, se.exercise_id, e.name as exercise_name, el.id as log_id, el.set_number, el.reps_completed, el.weight_used_lbs, el.notes as log_notes, el.logged_at
             FROM session_exercises se
             JOIN exercises e ON se.exercise_id = e.id
             LEFT JOIN exercise_logs el ON se.id = el.session_exercise_id
             WHERE se.session_id = $1
             ORDER BY se.order_in_session ASC, el.set_number ASC`,
            [sessionId]
        );
        return result.rows;
    }

    async getClientSessionSummaries(clientId: string): Promise<any[]> {
        const sql = `
            SELECT ws.*, wt.name as workout_type_name, c.name as class_name,
                   (SELECT COUNT(*) FROM session_exercises se WHERE se.session_id = ws.id) as exercise_count
            FROM workout_sessions ws
            LEFT JOIN workout_types wt ON ws.workout_type_id = wt.id
            LEFT JOIN classes c ON ws.class_id = c.id
            JOIN session_participants sp ON ws.id = sp.session_id
            WHERE sp.client_id = $1
            ORDER BY ws.session_date DESC, ws.start_time DESC
        `;
        const result = await query(sql, [clientId]);
        return result.rows;
    }

    async getClientHistory(clientId: string): Promise<any[]> {
        const sql = `
            SELECT ws.session_date, ws.id as session_id, e.name as exercise_name, el.*
            FROM exercise_logs el
            JOIN session_exercises se ON el.session_exercise_id = se.id
            JOIN workout_sessions ws ON se.session_id = ws.id
            JOIN exercises e ON se.exercise_id = e.id
            WHERE el.client_id = $1
            ORDER BY ws.session_date DESC, el.set_number ASC
        `;
        const result = await query(sql, [clientId]);
        return result.rows;
    }

    async getExerciseHistory(clientId: string, exerciseId: string, limit: number = 5): Promise<any[]> {
        const sql = `
            SELECT ws.session_date, el.set_number, el.reps_completed, el.weight_used_lbs, el.rpe, el.notes
            FROM exercise_logs el
            JOIN session_exercises se ON el.session_exercise_id = se.id
            JOIN workout_sessions ws ON se.session_id = ws.id
            WHERE el.client_id = $1 AND se.exercise_id = $2
            ORDER BY ws.session_date DESC, el.set_number ASC
            LIMIT $3
        `;
        const result = await query(sql, [clientId, exerciseId, limit * 10]);
        return result.rows;
    }

    async getClientStats(clientId: string): Promise<any> {
        const sql = `
            SELECT COUNT(DISTINCT ws.id) as total_workouts, COUNT(DISTINCT el.id) as total_sets,
                   SUM(el.weight_used_lbs * el.reps_completed) as total_volume_lbs
            FROM exercise_logs el
            JOIN session_exercises se ON el.session_exercise_id = se.id
            JOIN workout_sessions ws ON se.session_id = ws.id
            WHERE el.client_id = $1
        `;
        const result = await query(sql, [clientId]);
        return result.rows[0];
    }

    async markAttendance(sessionId: string, clientId: string, attended: boolean): Promise<any | null> {
        const result = await query(
            "UPDATE session_participants SET attended = $3, updated_at = NOW() WHERE session_id = $1 AND client_id = $2 RETURNING *",
            [sessionId, clientId, attended]
        );
        return result.rows[0] || null;
    }

    async publish(id: string): Promise<boolean> {
        const result = await query(
            "UPDATE workout_sessions SET is_published = true WHERE id = $1",
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export default new WorkoutSessionModel();

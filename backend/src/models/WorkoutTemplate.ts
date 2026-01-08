import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface WorkoutTemplate {
    id: string;
    trainer_id: string;
    name: string;
    description?: string;
    workout_type_id?: string;
    estimated_duration_minutes?: number;
    difficulty_level?: string;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface TemplateExercise {
    id: string;
    template_id: string;
    exercise_id: string;
    order_in_template: number;
    suggested_sets?: number;
    suggested_reps?: number;
    suggested_weight_lbs?: number;
    suggested_rest_seconds?: number;
    notes?: string;
}

export interface CreateTemplateInput {
    trainer_id: string;
    name: string;
    description?: string;
    workout_type_id?: string;
    estimated_duration_minutes?: number;
    difficulty_level?: string;
    is_public?: boolean;
    exercises?: Array<{
        exercise_id: string;
        order_in_template: number;
        suggested_sets?: number;
        suggested_reps?: number;
        suggested_weight_lbs?: number;
        suggested_rest_seconds?: number;
        notes?: string;
    }>;
    body_focus_ids?: string[];
}

class WorkoutTemplateModel {
    // Get all templates for a trainer
    async getByTrainer(trainerId: string, includePublic: boolean = true): Promise<WorkoutTemplate[]> {
        let sql = `
            SELECT wt.*, 
                   workout_types.name as workout_type_name,
                   COUNT(DISTINCT te.id) as exercise_count
            FROM workout_templates wt
            LEFT JOIN workout_types ON wt.workout_type_id = workout_types.id
            LEFT JOIN template_exercises te ON wt.id = te.template_id
            WHERE wt.trainer_id = $1
        `;

        if (includePublic) {
            sql += ' OR wt.is_public = true';
        }

        sql += ' GROUP BY wt.id, workout_types.name ORDER BY wt.created_at DESC';

        const result: QueryResult = await query(sql, [trainerId]);
        return result.rows;
    }

    // Get ALL templates (for admin)
    async getAll(): Promise<WorkoutTemplate[]> {
        const sql = `
            SELECT wt.*, 
                   workout_types.name as workout_type_name,
                   COUNT(DISTINCT te.id) as exercise_count
            FROM workout_templates wt
            LEFT JOIN workout_types ON wt.workout_type_id = workout_types.id
            LEFT JOIN template_exercises te ON wt.id = te.template_id
            GROUP BY wt.id, workout_types.name 
            ORDER BY wt.created_at DESC
        `;
        const result: QueryResult = await query(sql);
        return result.rows;
    }

    // Get template by ID with exercises
    async getById(id: string): Promise<any | null> {
        const templateResult: QueryResult = await query(
            `SELECT wt.*, 
                    workout_types.name as workout_type_name
             FROM workout_templates wt
             LEFT JOIN workout_types ON wt.workout_type_id = workout_types.id
             WHERE wt.id = $1`,
            [id]
        );

        if (templateResult.rows.length === 0) {
            return null;
        }

        const template = templateResult.rows[0];

        // Get exercises
        const exercisesResult: QueryResult = await query(
            `SELECT te.*, 
                    e.name as exercise_name,
                    e.description as exercise_description
             FROM template_exercises te
             JOIN exercises e ON te.exercise_id = e.id
             WHERE te.template_id = $1
             ORDER BY te.order_in_template ASC`,
            [id]
        );

        // Get body focus areas
        const bodyFocusResult: QueryResult = await query(
            `SELECT bf.id, bf.name
             FROM template_body_focus tbf
             JOIN body_focus_areas bf ON tbf.body_focus_id = bf.id
             WHERE tbf.template_id = $1`,
            [id]
        );

        template.exercises = exercisesResult.rows;
        template.body_focus_areas = bodyFocusResult.rows;

        return template;
    }

    // Create new template
    async create(templateData: CreateTemplateInput): Promise<WorkoutTemplate> {
        const client = await query('BEGIN');

        try {
            // Create template
            const templateResult: QueryResult = await query(
                `INSERT INTO workout_templates (
                    trainer_id, name, description, workout_type_id,
                    estimated_duration_minutes, difficulty_level, is_public
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                [
                    templateData.trainer_id,
                    templateData.name,
                    templateData.description || null,
                    templateData.workout_type_id || null,
                    templateData.estimated_duration_minutes || null,
                    templateData.difficulty_level || null,
                    templateData.is_public || false
                ]
            );

            const template = templateResult.rows[0];

            // Add exercises
            if (templateData.exercises && templateData.exercises.length > 0) {
                for (const exercise of templateData.exercises) {
                    await query(
                        `INSERT INTO template_exercises (
                            template_id, exercise_id, order_in_template,
                            suggested_sets, suggested_reps, suggested_weight_lbs,
                            suggested_rest_seconds, notes
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [
                            template.id,
                            exercise.exercise_id,
                            exercise.order_in_template,
                            exercise.suggested_sets,
                            exercise.suggested_reps,
                            exercise.suggested_weight_lbs,
                            exercise.suggested_rest_seconds,
                            exercise.notes
                        ]
                    );
                }
            }

            // Add body focus areas
            if (templateData.body_focus_ids && templateData.body_focus_ids.length > 0) {
                for (const bodyFocusId of templateData.body_focus_ids) {
                    await query(
                        'INSERT INTO template_body_focus (template_id, body_focus_id) VALUES ($1, $2)',
                        [template.id, bodyFocusId]
                    );
                }
            }

            await query('COMMIT');
            return template;
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
    }

    // Copy template
    async copy(templateId: string, trainerId: string, newName?: string): Promise<WorkoutTemplate> {
        const original = await this.getById(templateId);
        if (!original) {
            throw new Error('Template not found');
        }

        const copyData: CreateTemplateInput = {
            trainer_id: trainerId,
            name: newName || `${original.name} (Copy)`,
            description: original.description,
            workout_type_id: original.workout_type_id,
            estimated_duration_minutes: original.estimated_duration_minutes,
            difficulty_level: original.difficulty_level,
            is_public: false,
            exercises: original.exercises.map((e: any) => ({
                exercise_id: e.exercise_id,
                order_in_template: e.order_in_template,
                suggested_sets: e.suggested_sets,
                suggested_reps: e.suggested_reps,
                suggested_weight_lbs: e.suggested_weight_lbs,
                suggested_rest_seconds: e.suggested_rest_seconds,
                notes: e.notes
            })),
            body_focus_ids: original.body_focus_areas.map((bf: any) => bf.id)
        };

        return this.create(copyData);
    }

    // Delete template
    async delete(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'DELETE FROM workout_templates WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export default new WorkoutTemplateModel();

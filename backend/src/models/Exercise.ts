import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface Exercise {
    id: string;
    name: string;
    description?: string;
    workout_type_id?: string;
    primary_muscle_group?: string;
    movement_pattern?: 'Push' | 'Pull' | 'Legs' | 'Static' | 'None';
    equipment_required?: string;
    difficulty_level?: string;
    video_url?: string;
    image_url?: string;
    instructions?: string;
    is_active: boolean;
    created_by?: string;
    created_at: Date;
    updated_at: Date;
    secondary_muscle_groups?: any[];
}

export interface CreateExerciseInput {
    name: string;
    description?: string;
    workout_type_id?: string;
    primary_muscle_group?: string;
    movement_pattern?: string;
    secondary_muscle_group_ids?: string[];
    equipment_required?: string;
    difficulty_level?: string;
    video_url?: string;
    image_url?: string;
    instructions?: string;
    created_by?: string;
}

export interface UpdateExerciseInput {
    name?: string;
    description?: string;
    workout_type_id?: string;
    primary_muscle_group?: string;
    movement_pattern?: string;
    secondary_muscle_group_ids?: string[];
    equipment_required?: string;
    difficulty_level?: string;
    video_url?: string;
    image_url?: string;
    instructions?: string;
    is_active?: boolean;
}

class ExerciseModel {
    // Get all exercises with optional filters
    async getAll(filters?: {
        workout_type_id?: string;
        muscle_group?: string;
        difficulty?: string;
        movement_pattern?: string;
        is_active?: boolean;
        search?: string;
    }): Promise<Exercise[]> {
        let sql = `
            SELECT e.*, 
                   wt.name as workout_type_name,
                   bf.name as muscle_group_name,
                   bf.body_part_id,
                   bp.name as body_part_name
            FROM exercises e
            LEFT JOIN workout_types wt ON e.workout_type_id = wt.id
            LEFT JOIN body_focus_areas bf ON e.primary_muscle_group = bf.id
            LEFT JOIN body_parts bp ON bf.body_part_id = bp.id
            WHERE 1=1
        `;
        const params: any[] = [];
        let paramCount = 1;

        if (filters?.workout_type_id) {
            sql += ` AND e.workout_type_id = $${paramCount}`;
            params.push(filters.workout_type_id);
            paramCount++;
        }

        if (filters?.muscle_group) {
            sql += ` AND e.primary_muscle_group = $${paramCount}`;
            params.push(filters.muscle_group);
            paramCount++;
        }

        if (filters?.difficulty) {
            sql += ` AND e.difficulty_level = $${paramCount}`;
            params.push(filters.difficulty);
            paramCount++;
        }

        if (filters?.movement_pattern) {
            sql += ` AND e.movement_pattern = $${paramCount}`;
            params.push(filters.movement_pattern);
            paramCount++;
        }

        if (filters?.is_active !== undefined) {
            sql += ` AND e.is_active = $${paramCount}`;
            params.push(filters.is_active);
            paramCount++;
        }

        if (filters?.search) {
            sql += ` AND (e.name ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
            params.push(`%${filters.search}%`);
            paramCount++;
        }

        sql += ' ORDER BY e.name ASC';

        const result: QueryResult = await query(sql, params);
        return result.rows;
    }

    // Get exercise by ID
    async getById(id: string): Promise<Exercise | null> {
        const result: QueryResult = await query(
            `SELECT e.*, 
                    wt.name as workout_type_name,
                    bf.name as muscle_group_name,
                    bf.body_part_id,
                    bp.name as body_part_name
             FROM exercises e
             LEFT JOIN workout_types wt ON e.workout_type_id = wt.id
             LEFT JOIN body_focus_areas bf ON e.primary_muscle_group = bf.id
             LEFT JOIN body_parts bp ON bf.body_part_id = bp.id
             WHERE e.id = $1`,
            [id]
        );

        if (result.rows.length === 0) return null;
        
        const exercise = result.rows[0];

        // Fetch secondary muscle groups
        const secondaryResult: QueryResult = await query(
            `SELECT bf.*
             FROM exercise_secondary_muscles esm
             JOIN body_focus_areas bf ON esm.body_focus_id = bf.id
             WHERE esm.exercise_id = $1`,
            [id]
        );

        exercise.secondary_muscle_groups = secondaryResult.rows;

        return exercise;
    }

    // Create new exercise
    async create(exerciseData: CreateExerciseInput): Promise<Exercise> {
        const {
            name,
            description,
            workout_type_id,
            primary_muscle_group,
            secondary_muscle_group_ids,
            equipment_required,
            difficulty_level,
            video_url,
            image_url,
            instructions,
            created_by
        } = exerciseData;

        await query('BEGIN');

        try {
            const result: QueryResult = await query(
                `INSERT INTO exercises (
                    name, description, workout_type_id, primary_muscle_group, movement_pattern,
                    equipment_required, difficulty_level, video_url, image_url, instructions, created_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *`,
                [name, description, workout_type_id, primary_muscle_group, exerciseData.movement_pattern,
                    equipment_required, difficulty_level, video_url, image_url, instructions, created_by]
            );

            const exercise = result.rows[0];

            if (secondary_muscle_group_ids && secondary_muscle_group_ids.length > 0) {
                for (const bfaId of secondary_muscle_group_ids) {
                    await query(
                        'INSERT INTO exercise_secondary_muscles (exercise_id, body_focus_id) VALUES ($1, $2)',
                        [exercise.id, bfaId]
                    );
                }
            }

            await query('COMMIT');
            return this.getById(exercise.id) as any;
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
    }

    // Update exercise
    async update(id: string, exerciseData: UpdateExerciseInput): Promise<Exercise | null> {
        const { secondary_muscle_group_ids, ...directUpdates } = exerciseData;
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(directUpdates).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        await query('BEGIN');

        try {
            if (fields.length > 0) {
                values.push(id);
                await query(
                    `UPDATE exercises SET ${fields.join(', ')} WHERE id = $${paramCount}`,
                    values
                );
            }

            if (secondary_muscle_group_ids !== undefined) {
                // Clear old ones
                await query('DELETE FROM exercise_secondary_muscles WHERE exercise_id = $1', [id]);
                
                // Add new ones
                if (secondary_muscle_group_ids.length > 0) {
                    for (const bfaId of secondary_muscle_group_ids) {
                        await query(
                            'INSERT INTO exercise_secondary_muscles (exercise_id, body_focus_id) VALUES ($1, $2)',
                            [id, bfaId]
                        );
                    }
                }
            }

            await query('COMMIT');
            return this.getById(id);
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
    }

    // Soft delete (deactivate)
    async delete(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'UPDATE exercises SET is_active = false WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    // Get workout types
    async getWorkoutTypes(): Promise<any[]> {
        const result: QueryResult = await query(
            'SELECT * FROM workout_types ORDER BY name ASC'
        );
        return result.rows;
    }

    // Get body focus areas
    async getBodyFocusAreas(): Promise<any[]> {
        const result: QueryResult = await query(
            `SELECT bfa.*, bp.name as body_part_name 
             FROM body_focus_areas bfa
             LEFT JOIN body_parts bp ON bfa.body_part_id = bp.id
             ORDER BY bfa.name ASC`
        );
        return result.rows;
    }

    // Create body focus area
    async createBodyFocusArea(data: { name: string; description?: string; body_part_id?: string }): Promise<any> {
        const result: QueryResult = await query(
            'INSERT INTO body_focus_areas (name, description, body_part_id) VALUES ($1, $2, $3) RETURNING *',
            [data.name, data.description || null, data.body_part_id || null]
        );
        return result.rows[0];
    }

    // Update body focus area
    async updateBodyFocusArea(id: string, data: { name?: string; description?: string; body_part_id?: string }): Promise<any | null> {
        const result: QueryResult = await query(
            'UPDATE body_focus_areas SET name = COALESCE($1, name), description = COALESCE($2, description), body_part_id = COALESCE($3, body_part_id) WHERE id = $4 RETURNING *',
            [data.name, data.description, data.body_part_id, id]
        );
        return result.rows[0] || null;
    }

    // Delete body focus area
    async deleteBodyFocusArea(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'DELETE FROM body_focus_areas WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    // Create workout type
    async createWorkoutType(data: { name: string; description?: string }): Promise<any> {
        const result: QueryResult = await query(
            'INSERT INTO workout_types (name, description) VALUES ($1, $2) RETURNING *',
            [data.name, data.description || null]
        );
        return result.rows[0];
    }

    // Update workout type
    async updateWorkoutType(id: string, data: { name?: string; description?: string }): Promise<any | null> {
        const result: QueryResult = await query(
            'UPDATE workout_types SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
            [data.name, data.description, id]
        );
        return result.rows[0] || null;
    }

    // Delete workout type
    async deleteWorkoutType(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'DELETE FROM workout_types WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export default new ExerciseModel();

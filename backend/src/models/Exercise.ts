import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface Exercise {
    id: string;
    name: string;
    description?: string;
    workout_type_id?: string;
    primary_muscle_group?: string;
    equipment_required?: string;
    difficulty_level?: string;
    video_url?: string;
    instructions?: string;
    is_active: boolean;
    created_by?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateExerciseInput {
    name: string;
    description?: string;
    workout_type_id?: string;
    primary_muscle_group?: string;
    equipment_required?: string;
    difficulty_level?: string;
    video_url?: string;
    instructions?: string;
    created_by?: string;
}

export interface UpdateExerciseInput {
    name?: string;
    description?: string;
    workout_type_id?: string;
    primary_muscle_group?: string;
    equipment_required?: string;
    difficulty_level?: string;
    video_url?: string;
    instructions?: string;
    is_active?: boolean;
}

class ExerciseModel {
    // Get all exercises with optional filters
    async getAll(filters?: {
        workout_type_id?: string;
        muscle_group?: string;
        difficulty?: string;
        is_active?: boolean;
        search?: string;
    }): Promise<Exercise[]> {
        let sql = `
            SELECT e.*, 
                   wt.name as workout_type_name,
                   bf.name as muscle_group_name
            FROM exercises e
            LEFT JOIN workout_types wt ON e.workout_type_id = wt.id
            LEFT JOIN body_focus_areas bf ON e.primary_muscle_group = bf.id
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
                    bf.name as muscle_group_name
             FROM exercises e
             LEFT JOIN workout_types wt ON e.workout_type_id = wt.id
             LEFT JOIN body_focus_areas bf ON e.primary_muscle_group = bf.id
             WHERE e.id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    // Create new exercise
    async create(exerciseData: CreateExerciseInput): Promise<Exercise> {
        const {
            name,
            description,
            workout_type_id,
            primary_muscle_group,
            equipment_required,
            difficulty_level,
            video_url,
            instructions,
            created_by
        } = exerciseData;

        const result: QueryResult = await query(
            `INSERT INTO exercises (
                name, description, workout_type_id, primary_muscle_group,
                equipment_required, difficulty_level, video_url, instructions, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [name, description, workout_type_id, primary_muscle_group,
                equipment_required, difficulty_level, video_url, instructions, created_by]
        );

        return result.rows[0];
    }

    // Update exercise
    async update(id: string, exerciseData: UpdateExerciseInput): Promise<Exercise | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(exerciseData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            return this.getById(id);
        }

        values.push(id);
        const result: QueryResult = await query(
            `UPDATE exercises SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        return result.rows[0] || null;
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
            'SELECT * FROM body_focus_areas ORDER BY name ASC'
        );
        return result.rows;
    }

    // Create body focus area
    async createBodyFocusArea(data: { name: string; description?: string }): Promise<any> {
        const result: QueryResult = await query(
            'INSERT INTO body_focus_areas (name, description) VALUES ($1, $2) RETURNING *',
            [data.name, data.description || null]
        );
        return result.rows[0];
    }

    // Update body focus area
    async updateBodyFocusArea(id: string, data: { name?: string; description?: string }): Promise<any | null> {
        const result: QueryResult = await query(
            'UPDATE body_focus_areas SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
            [data.name, data.description, id]
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

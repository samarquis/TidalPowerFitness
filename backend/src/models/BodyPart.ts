import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface BodyPart {
    id: string;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

class BodyPartModel {
    // Get all body parts
    async getAll(): Promise<BodyPart[]> {
        const result: QueryResult = await query(
            'SELECT * FROM body_parts ORDER BY name ASC'
        );
        return result.rows;
    }

    // Get body part by ID
    async getById(id: string): Promise<BodyPart | null> {
        const result: QueryResult = await query(
            'SELECT * FROM body_parts WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    // Create new body part
    async create(data: { name: string; description?: string }): Promise<BodyPart> {
        const result: QueryResult = await query(
            'INSERT INTO body_parts (name, description) VALUES ($1, $2) RETURNING *',
            [data.name, data.description || null]
        );
        return result.rows[0];
    }

    // Update body part
    async update(id: string, data: { name?: string; description?: string }): Promise<BodyPart | null> {
        const result: QueryResult = await query(
            'UPDATE body_parts SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
            [data.name, data.description, id]
        );
        return result.rows[0] || null;
    }

    // Delete body part
    async delete(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'DELETE FROM body_parts WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export default new BodyPartModel();

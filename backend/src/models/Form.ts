import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface Form {
    id: string;
    user_id: string;
    form_type: string;
    form_data: Record<string, any>;
    submitted_at: Date;
    reviewed_by?: string;
    reviewed_at?: Date;
}

export interface CreateFormInput {
    user_id: string;
    form_type: string;
    form_data: Record<string, any>;
}

class FormModel {
    // Create form submission
    async create(formData: CreateFormInput): Promise<Form> {
        const { user_id, form_type, form_data } = formData;

        const result: QueryResult = await query(
            `INSERT INTO forms (user_id, form_type, form_data)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [user_id, form_type, JSON.stringify(form_data)]
        );

        return result.rows[0];
    }

    // Find form by ID
    async findById(id: string): Promise<Form | null> {
        const result: QueryResult = await query(
            `SELECT f.*, 
              u.first_name, u.last_name, u.email,
              r.first_name as reviewer_first_name, r.last_name as reviewer_last_name
       FROM forms f
       JOIN users u ON f.user_id = u.id
       LEFT JOIN users r ON f.reviewed_by = r.id
       WHERE f.id = $1`,
            [id]
        );

        return result.rows[0] || null;
    }

    // Find forms by user
    async findByUser(userId: string, formType?: string): Promise<Form[]> {
        let queryText = 'SELECT * FROM forms WHERE user_id = $1';
        const params: any[] = [userId];

        if (formType) {
            queryText += ' AND form_type = $2';
            params.push(formType);
        }

        queryText += ' ORDER BY submitted_at DESC';

        const result: QueryResult = await query(queryText, params);
        return result.rows;
    }

    // Find forms by type
    async findByType(formType: string): Promise<Form[]> {
        const result: QueryResult = await query(
            `SELECT f.*, 
              u.first_name, u.last_name, u.email
       FROM forms f
       JOIN users u ON f.user_id = u.id
       WHERE f.form_type = $1
       ORDER BY f.submitted_at DESC`,
            [formType]
        );

        return result.rows;
    }

    // Find unreviewed forms
    async findUnreviewed(formType?: string): Promise<Form[]> {
        let queryText = `
      SELECT f.*, 
             u.first_name, u.last_name, u.email
      FROM forms f
      JOIN users u ON f.user_id = u.id
      WHERE f.reviewed_by IS NULL
    `;
        const params: any[] = [];

        if (formType) {
            queryText += ' AND f.form_type = $1';
            params.push(formType);
        }

        queryText += ' ORDER BY f.submitted_at ASC';

        const result: QueryResult = await query(queryText, params);
        return result.rows;
    }

    // Mark form as reviewed
    async markReviewed(id: string, reviewedBy: string): Promise<Form | null> {
        const result: QueryResult = await query(
            `UPDATE forms 
       SET reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
            [reviewedBy, id]
        );

        return result.rows[0] || null;
    }

    // Delete form
    async delete(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'DELETE FROM forms WHERE id = $1',
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }
}

export default new FormModel();

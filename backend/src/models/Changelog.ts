import { query } from '../config/db';
import { QueryResult } from 'pg';

export type ChangelogCategory = 'feature' | 'fix' | 'improvement' | 'security' | 'chore';

export interface ChangelogEntry {
    id: string;
    version: string;
    tracking_number?: string;
    title: string;
    content: string;
    category: ChangelogCategory;
    is_published: boolean;
    published_at: Date | null;
    created_at: Date;
    updated_at: Date;
    created_by?: string;
}

export interface CreateChangelogInput {
    version: string;
    tracking_number?: string;
    title: string;
    content: string;
    category: ChangelogCategory;
    is_published?: boolean;
    published_at?: Date | string;
    created_by: string;
}

class ChangelogModel {
    private mapRowToEntry(row: any): ChangelogEntry | null {
        if (!row) return null;
        return { ...row };
    }

    async create(input: CreateChangelogInput): Promise<ChangelogEntry> {
        const { version, tracking_number, title, content, category, is_published = false, published_at, created_by } = input;

        const result: QueryResult = await query(
            `INSERT INTO changelogs (version, tracking_number, title, content, category, is_published, published_at, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [version, tracking_number, title, content, category, is_published, is_published ? (published_at || new Date()) : null, created_by]
        );

        return this.mapRowToEntry(result.rows[0])!;
    }

    async findAll(onlyPublished = true): Promise<ChangelogEntry[]> {
        const sql = onlyPublished
            ? 'SELECT * FROM changelogs WHERE is_published = TRUE ORDER BY published_at DESC, version DESC'
            : 'SELECT * FROM changelogs ORDER BY created_at DESC, version DESC';

        const result: QueryResult = await query(sql);
        return result.rows.map(row => this.mapRowToEntry(row)!);
    }

    async findById(id: string): Promise<ChangelogEntry | null> {
        const result: QueryResult = await query('SELECT * FROM changelogs WHERE id = $1', [id]);
        return this.mapRowToEntry(result.rows[0]);
    }

    async update(id: string, updates: Partial<CreateChangelogInput>): Promise<ChangelogEntry | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        const result: QueryResult = await query(
            `UPDATE changelogs SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        return this.mapRowToEntry(result.rows[0]);
    }

    async delete(id: string): Promise<boolean> {
        const result: QueryResult = await query('DELETE FROM changelogs WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

export default new ChangelogModel();

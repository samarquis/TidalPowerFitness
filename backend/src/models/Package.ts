import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface Package {
    id: string;
    name: string;
    description?: string;
    price_cents: number;
    credit_count: number;
    duration_days?: number;
    type: 'one_time' | 'subscription';
    stripe_product_id?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePackageInput {
    name: string;
    description?: string;
    price_cents: number;
    credit_count: number;
    duration_days?: number;
    type: 'one_time' | 'subscription';
    stripe_product_id?: string;
}

class PackageModel {
    // Get all active packages
    async getAllActive(): Promise<Package[]> {
        const result: QueryResult = await query(
            'SELECT * FROM packages WHERE is_active = true ORDER BY price_cents ASC'
        );
        return result.rows;
    }

    // Get package by ID
    async getById(id: string): Promise<Package | null> {
        const result: QueryResult = await query(
            'SELECT * FROM packages WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    // Create package
    async create(data: CreatePackageInput): Promise<Package> {
        const result: QueryResult = await query(
            `INSERT INTO packages (
                name, description, price_cents, credit_count, duration_days, type, stripe_product_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                data.name,
                data.description,
                data.price_cents,
                data.credit_count,
                data.duration_days,
                data.type,
                data.stripe_product_id
            ]
        );
        return result.rows[0];
    }

    // Update package
    async update(id: string, data: Partial<CreatePackageInput>): Promise<Package | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) return this.getById(id);

        values.push(id);
        const result: QueryResult = await query(
            `UPDATE packages SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );
        return result.rows[0] || null;
    }

    // Deactivate package
    async deactivate(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'UPDATE packages SET is_active = false WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export default new PackageModel();

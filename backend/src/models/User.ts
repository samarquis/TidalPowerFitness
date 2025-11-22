import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface User {
    id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: 'client' | 'trainer' | 'admin';
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUserInput {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: 'client' | 'trainer' | 'admin';
}

export interface UpdateUserInput {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    is_active?: boolean;
}

class UserModel {
    // Create a new user
    async create(userData: CreateUserInput): Promise<User> {
        const { email, password_hash, first_name, last_name, phone, role = 'client' } = userData;

        const result: QueryResult = await query(
            `INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [email, password_hash, first_name, last_name, phone, role]
        );

        return result.rows[0];
    }

    // Find user by ID
    async findById(id: string): Promise<User | null> {
        const result: QueryResult = await query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );

        return result.rows[0] || null;
    }

    // Find user by email
    async findByEmail(email: string): Promise<User | null> {
        const result: QueryResult = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        return result.rows[0] || null;
    }

    // Get all users by role
    async findByRole(role: 'client' | 'trainer' | 'admin'): Promise<User[]> {
        const result: QueryResult = await query(
            'SELECT * FROM users WHERE role = $1 AND is_active = true ORDER BY created_at DESC',
            [role]
        );

        return result.rows;
    }

    // Update user
    async update(id: string, userData: UpdateUserInput): Promise<User | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(userData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const result: QueryResult = await query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        return result.rows[0] || null;
    }

    // Soft delete user (set is_active to false)
    async delete(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'UPDATE users SET is_active = false WHERE id = $1',
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }

    // Hard delete user (permanent)
    async hardDelete(id: string): Promise<boolean> {
        const result: QueryResult = await query(
            'DELETE FROM users WHERE id = $1',
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }
}

export default new UserModel();

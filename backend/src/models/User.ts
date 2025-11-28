import { query } from '../config/db';
import { QueryResult } from 'pg';

export interface User {
    id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: 'client' | 'trainer' | 'admin'; // Keep for backward compatibility during migration
    roles: string[];
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
    roles?: string[];
}

export interface UpdateUserInput {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    roles?: string[];
    is_active?: boolean;
}

class UserModel {
    // Helper to map database row to User object
    private mapRowToUser(row: any): User | null {
        if (!row) return null;
        return {
            ...row,
            roles: row.roles || (row.role ? [row.role] : ['client'])
        };
    }

    // Create a new user
    async create(userData: CreateUserInput): Promise<User> {
        const { email, password_hash, first_name, last_name, phone, roles = ['client'] } = userData;

        // For backward compatibility, use the first role as the primary role
        const primaryRole = roles.length > 0 ? roles[0] : 'client';

        const result: QueryResult = await query(
            `INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [email, password_hash, first_name, last_name, phone, primaryRole]
        );

        return this.mapRowToUser(result.rows[0])!;
    }

    // Find user by ID
    async findById(id: string): Promise<User | null> {
        const result: QueryResult = await query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );

        return this.mapRowToUser(result.rows[0]);
    }

    // Find user by email
    async findByEmail(email: string): Promise<User | null> {
        const result: QueryResult = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        return this.mapRowToUser(result.rows[0]);
    }

    // Get all users by role (checks if role is in roles array or matches singular role)
    async findByRole(role: 'client' | 'trainer' | 'admin'): Promise<User[]> {
        const result: QueryResult = await query(
            'SELECT * FROM users WHERE role = $1 AND is_active = true ORDER BY created_at DESC',
            [role]
        );

        return result.rows.map(row => this.mapRowToUser(row)!);
    }

    // Update user
    async update(id: string, userData: UpdateUserInput): Promise<User | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        Object.entries(userData).forEach(([key, value]) => {
            if (value !== undefined && key !== 'roles') { // Handle roles separately if needed, but for now we rely on singular role
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

        return this.mapRowToUser(result.rows[0]);
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

    // Add a role to user - For singular role schema, this updates the primary role
    async addRole(id: string, role: string): Promise<User | null> {
        // Since we only have a singular role column, we update it
        // In a real array implementation, we would append
        const result: QueryResult = await query(
            `UPDATE users 
             SET role = $2
             WHERE id = $1
             RETURNING *`,
            [id, role]
        );

        return this.mapRowToUser(result.rows[0]);
    }

    // Remove a role from user - For singular role schema, this resets to client if matches
    async removeRole(id: string, role: string): Promise<User | null> {
        const result: QueryResult = await query(
            `UPDATE users 
             SET role = 'client'
             WHERE id = $1 AND role = $2
             RETURNING *`,
            [id, role]
        );

        return this.mapRowToUser(result.rows[0]);
    }
}

export default new UserModel();

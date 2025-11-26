import { query } from '../config/db';

export interface Class {
    id: string;
    name: string;
    description: string;
    category: string;
    instructor_id?: string;
    instructor_name: string;
    day_of_week?: number; // Legacy
    days_of_week: number[]; // New multi-day support
    start_time: string;
    duration_minutes: number;
    max_capacity: number;
    price_cents: number;
    is_active: boolean;
    acuity_appointment_type_id?: string;
    created_at: Date;
    updated_at: Date;
}

export const getAllClasses = async (activeOnly: boolean = true): Promise<Class[]> => {
    const sql = activeOnly
        ? 'SELECT * FROM classes WHERE is_active = true ORDER BY day_of_week, start_time'
        : 'SELECT * FROM classes ORDER BY day_of_week, start_time';

    const result = await query(sql);
    return result.rows;
};

export const getClassById = async (id: string): Promise<Class | null> => {
    const result = await query('SELECT * FROM classes WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const getClassesByDay = async (dayOfWeek: number): Promise<Class[]> => {
    const result = await query(
        'SELECT * FROM classes WHERE ($1 = ANY(days_of_week) OR day_of_week = $1) AND is_active = true ORDER BY start_time',
        [dayOfWeek]
    );
    return result.rows;
};

export const getClassesByCategory = async (category: string): Promise<Class[]> => {
    const result = await query(
        'SELECT * FROM classes WHERE category = $1 AND is_active = true ORDER BY day_of_week, start_time',
        [category]
    );
    return result.rows;
};

export const createClass = async (classData: Partial<Class>): Promise<Class> => {
    const {
        name,
        description,
        category,
        instructor_id,
        instructor_name,
        days_of_week,
        start_time,
        duration_minutes,
        max_capacity,
        price_cents,
        acuity_appointment_type_id
    } = classData;

    // Use first day as legacy day_of_week if provided, or 0
    const primaryDay = days_of_week && days_of_week.length > 0 ? days_of_week[0] : 0;

    const result = await query(
        `INSERT INTO classes (
            name, description, category, instructor_id, instructor_name,
            day_of_week, days_of_week, start_time, duration_minutes, max_capacity, price_cents,
            acuity_appointment_type_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
            name, description, category, instructor_id, instructor_name,
            primaryDay, days_of_week || [primaryDay], start_time, duration_minutes, max_capacity, price_cents,
            acuity_appointment_type_id
        ]
    );

    return result.rows[0];
};

export const updateClass = async (id: string, classData: Partial<Class>): Promise<Class | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(classData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
            fields.push(`${key} = $${paramCount}`);
            values.push(value);
            paramCount++;
        }
    });

    if (fields.length === 0) {
        return null;
    }

    values.push(id);
    const result = await query(
        `UPDATE classes SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
    );

    return result.rows[0] || null;
};

export const deleteClass = async (id: string): Promise<boolean> => {
    // Soft delete by setting is_active to false
    const result = await query(
        'UPDATE classes SET is_active = false WHERE id = $1 RETURNING id',
        [id]
    );
    return result.rowCount > 0;
};

export default {
    getAllClasses,
    getClassById,
    getClassesByDay,
    getClassesByCategory,
    createClass,
    updateClass,
    deleteClass
};

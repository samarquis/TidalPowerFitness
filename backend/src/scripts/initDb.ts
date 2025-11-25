import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Inline SQL for table creation (essential tables only)
const CREATE_TABLES_SQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('client', 'trainer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'client',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trainer profiles table
CREATE TABLE IF NOT EXISTS trainer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    specialties TEXT[],
    certifications TEXT[],
    years_experience INTEGER,
    profile_image_url VARCHAR(500),
    acuity_calendar_id VARCHAR(100),
    is_accepting_clients BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    instructor_name VARCHAR(200),
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    max_capacity INTEGER DEFAULT 20,
    price_cents INTEGER DEFAULT 1200,
    is_active BOOLEAN DEFAULT true,
    acuity_appointment_type_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_trainer_profiles_user_id ON trainer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_classes_day_of_week ON classes(day_of_week);
CREATE INDEX IF NOT EXISTS idx_classes_is_active ON classes(is_active);
`;

export async function initializeDatabase() {
    const client = await pool.connect();

    try {
        console.log('🔍 Checking if database is initialized...');

        // Check if users table exists
        const result = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);

        const tablesExist = result.rows[0].exists;

        if (tablesExist) {
            console.log('✅ Database already initialized');
            return;
        }

        console.log('📦 Initializing database schema...');

        // Execute table creation SQL
        await client.query(CREATE_TABLES_SQL);
        console.log('✅ Database schema created successfully');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    } finally {
        client.release();
    }
}

export default initializeDatabase;

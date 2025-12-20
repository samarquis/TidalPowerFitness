-- Migration 011: Create Changelog System
-- Tracks application updates, features, and fixes in an industry-standard format

-- Step 1: Create Category Enum
DO $$ BEGIN
    CREATE TYPE changelog_category AS ENUM ('feature', 'fix', 'improvement', 'security', 'chore');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create Changelog Table
CREATE TABLE IF NOT EXISTS changelogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category changelog_category NOT NULL DEFAULT 'feature',
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Step 3: Add Indexing
CREATE INDEX IF NOT EXISTS idx_changelogs_version ON changelogs(version);
CREATE INDEX IF NOT EXISTS idx_changelogs_category ON changelogs(category);
CREATE INDEX IF NOT EXISTS idx_changelogs_published ON changelogs(published_at) WHERE is_published = TRUE;

-- Step 4: Add Trigger for updated_at
DROP TRIGGER IF EXISTS update_changelogs_updated_at ON changelogs;
CREATE TRIGGER update_changelogs_updated_at BEFORE UPDATE ON changelogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

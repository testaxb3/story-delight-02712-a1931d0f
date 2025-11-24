-- Fix tracker_days table for infinite streak support and resolve all issues
-- This migration:
-- 1. Removes any 30-day limit constraints
-- 2. Ensures proper RLS policies for read/write access
-- 3. Fixes data types and structure
-- 4. Makes streak infinite (no upper limit on day_number)

-- First, drop any existing check constraints that limit day_number
DO $$
BEGIN
    -- Drop the day_number check constraint if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'tracker_days_day_number_check'
    ) THEN
        ALTER TABLE tracker_days DROP CONSTRAINT tracker_days_day_number_check;
        RAISE NOTICE 'Dropped day_number check constraint';
    END IF;
END $$;

-- Ensure tracker_days table has the correct structure
-- This is idempotent - it will only create/modify what's needed
DO $$
BEGIN
    -- Check if tracker_days table exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'tracker_days'
    ) THEN
        CREATE TABLE tracker_days (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
            child_profile_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
            date DATE,
            day_number INTEGER NOT NULL,
            completed BOOLEAN DEFAULT false,
            completed_at TIMESTAMPTZ,
            stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
            meltdown_count TEXT, -- Store as text: '0', '1', '2', '3+'
            notes TEXT,
            streak_freeze_used BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );

        RAISE NOTICE 'Created tracker_days table';
    END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracker_days_user_id ON tracker_days(user_id);
CREATE INDEX IF NOT EXISTS idx_tracker_days_child_profile_id ON tracker_days(child_profile_id);
CREATE INDEX IF NOT EXISTS idx_tracker_days_date ON tracker_days(date);
CREATE INDEX IF NOT EXISTS idx_tracker_days_user_child_date ON tracker_days(user_id, child_profile_id, date);
CREATE INDEX IF NOT EXISTS idx_tracker_days_user_child_day_number ON tracker_days(user_id, child_profile_id, day_number);

-- Ensure RLS is enabled
ALTER TABLE tracker_days ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Users can read their own tracker days" ON tracker_days;
DROP POLICY IF EXISTS "Users can insert their own tracker days" ON tracker_days;
DROP POLICY IF EXISTS "Users can update their own tracker days" ON tracker_days;
DROP POLICY IF EXISTS "Users can delete their own tracker days" ON tracker_days;

-- Create comprehensive RLS policies
CREATE POLICY "Users can read their own tracker days"
    ON tracker_days
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracker days"
    ON tracker_days
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracker days"
    ON tracker_days
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracker days"
    ON tracker_days
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add a trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_tracker_days_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_tracker_days_updated_at ON tracker_days;
CREATE TRIGGER set_tracker_days_updated_at
    BEFORE UPDATE ON tracker_days
    FOR EACH ROW
    EXECUTE FUNCTION update_tracker_days_updated_at();

-- Add helpful comment
COMMENT ON TABLE tracker_days IS 'Tracks daily progress for users - infinite streak support, no day limit';
COMMENT ON COLUMN tracker_days.day_number IS 'Sequential day number for user journey - no upper limit, can go beyond 30';
COMMENT ON COLUMN tracker_days.meltdown_count IS 'Stored as text: 0, 1, 2, or 3+ to match UI expectations';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed: tracker_days table is now configured for infinite streak';
    RAISE NOTICE 'RLS policies created, indexes added, and constraints updated';
END $$;

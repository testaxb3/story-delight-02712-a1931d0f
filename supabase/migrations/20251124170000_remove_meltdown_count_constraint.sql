-- Remove old meltdown_count check constraint
-- The constraint was preventing TEXT values from being inserted
-- This migration ensures meltdown_count can accept TEXT values: '0', '1', '2', '3+'

DO $$
BEGIN
    -- Drop the meltdown_count check constraint if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'tracker_days_meltdown_count_check'
    ) THEN
        ALTER TABLE tracker_days DROP CONSTRAINT tracker_days_meltdown_count_check;
        RAISE NOTICE 'Dropped tracker_days_meltdown_count_check constraint';
    END IF;

    -- Ensure meltdown_count column is TEXT type
    ALTER TABLE tracker_days
    ALTER COLUMN meltdown_count TYPE TEXT;

    RAISE NOTICE 'Migration completed: meltdown_count is now TEXT without constraints';
END $$;

-- ==========================================
-- FIX: Remove meltdown_count constraint
-- ==========================================
-- Execute este SQL no Supabase Dashboard:
-- 1. Vá para: https://supabase.com/dashboard/project/YOUR_PROJECT/editor
-- 2. Cole este SQL e execute
-- ==========================================

-- Remove old meltdown_count check constraint
DO $$
BEGIN
    -- Drop the meltdown_count check constraint if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'tracker_days_meltdown_count_check'
    ) THEN
        ALTER TABLE tracker_days DROP CONSTRAINT tracker_days_meltdown_count_check;
        RAISE NOTICE '✅ Dropped tracker_days_meltdown_count_check constraint';
    ELSE
        RAISE NOTICE '⚠️ Constraint tracker_days_meltdown_count_check not found (may already be removed)';
    END IF;

    -- Ensure meltdown_count column is TEXT type
    ALTER TABLE tracker_days
    ALTER COLUMN meltdown_count TYPE TEXT;

    RAISE NOTICE '✅ Migration completed: meltdown_count is now TEXT without constraints';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Error: %', SQLERRM;
END $$;

-- Verify the fix
SELECT
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'tracker_days'::regclass
  AND conname LIKE '%meltdown%';

-- Should return no rows if the constraint was successfully removed

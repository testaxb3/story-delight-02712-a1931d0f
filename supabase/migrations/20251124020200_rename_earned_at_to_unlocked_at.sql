-- Rename earned_at to unlocked_at in user_badges table
--
-- PROBLEM: Frontend was updated to use unlocked_at, but database column is actually earned_at
-- SOLUTION: Rename the column to match frontend expectations
--
-- This is a breaking change if any queries are still using earned_at directly,
-- but it standardizes the field name across the codebase.
--
-- Rollback: ALTER TABLE user_badges RENAME COLUMN unlocked_at TO earned_at;

-- Check if column exists before renaming (idempotent)
DO $$
BEGIN
  -- Only rename if earned_at exists and unlocked_at doesn't
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_badges'
    AND column_name = 'earned_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_badges'
    AND column_name = 'unlocked_at'
  ) THEN
    ALTER TABLE user_badges RENAME COLUMN earned_at TO unlocked_at;

    RAISE NOTICE 'Renamed user_badges.earned_at to unlocked_at';
  ELSE
    RAISE NOTICE 'Column already renamed or does not exist';
  END IF;
END $$;

-- Add comment explaining the standardization
COMMENT ON COLUMN user_badges.unlocked_at IS
'Timestamp when the badge was unlocked by the user.
Previously named earned_at, renamed for consistency with frontend code.';

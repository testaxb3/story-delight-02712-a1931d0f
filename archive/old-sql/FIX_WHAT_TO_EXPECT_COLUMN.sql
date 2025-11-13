-- Fix what_to_expect column type (handles view dependencies)
-- Run this in Supabase SQL Editor

-- Step 1: Drop the validation triggers first
DROP TRIGGER IF EXISTS validate_strategy_steps_trigger ON scripts;
DROP TRIGGER IF EXISTS validate_what_to_expect_trigger ON scripts;
DROP FUNCTION IF EXISTS validate_strategy_steps();
DROP FUNCTION IF EXISTS validate_what_to_expect();

-- Step 2: Check current column type
SELECT
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name = 'scripts'
  AND column_name LIKE 'what_to_expect%'
ORDER BY column_name;

-- Step 3: Drop dependent views (they'll be recreated by migration)
DROP VIEW IF EXISTS emergency_scripts CASCADE;
DROP VIEW IF EXISTS emergency_scripts_new CASCADE;

-- Step 4: Rename old column
ALTER TABLE scripts RENAME COLUMN what_to_expect TO what_to_expect_old;

-- Step 5: Add new JSONB column
ALTER TABLE scripts ADD COLUMN what_to_expect JSONB;

-- Step 6: Drop old column (no longer has dependencies)
ALTER TABLE scripts DROP COLUMN what_to_expect_old;

-- Step 7: Recreate emergency_scripts_new view (from migration)
CREATE OR REPLACE VIEW emergency_scripts_new AS
SELECT
  s.id,
  s.title,
  s.category,
  s.profile,
  s.difficulty,
  s.duration_minutes,
  COALESCE(s.the_situation, s.situation_trigger) as situation,
  s.strategy_steps,
  s.what_to_expect,
  -- Success metrics
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked') as worked_count,
  COUNT(DISTINCT sf.id) as total_uses,
  CASE
    WHEN COUNT(DISTINCT sf.id) > 0 THEN
      ROUND(
        (COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked') * 1.0 +
         COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'progress') * 0.5) /
        COUNT(DISTINCT sf.id) * 100
      )
    ELSE NULL
  END as success_rate_percent
FROM scripts s
LEFT JOIN script_feedback sf ON s.id = sf.script_id
WHERE s.emergency_suitable = true
  AND s.works_in_public = true
  AND s.duration_minutes <= 5
GROUP BY s.id
ORDER BY success_rate_percent DESC NULLS LAST, worked_count DESC;

-- Step 8: Verify the fix
SELECT
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name = 'scripts'
  AND column_name = 'what_to_expect';

-- Expected result: data_type should be 'jsonb'

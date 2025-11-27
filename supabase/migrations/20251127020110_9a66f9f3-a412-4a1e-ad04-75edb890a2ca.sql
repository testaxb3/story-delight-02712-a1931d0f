-- Migration: Fix tracker_days data model and add child_profile_id

-- Step 1: Add child_profile_id to all orphaned tracker_days (where child_profile_id is NULL)
-- Match them to the user's active child profile
UPDATE tracker_days td
SET child_profile_id = (
  SELECT id 
  FROM child_profiles cp 
  WHERE cp.parent_id = td.user_id 
    AND cp.is_active = true 
  LIMIT 1
)
WHERE td.child_profile_id IS NULL;

-- Step 2: Delete any tracker_days that still don't have a child_profile_id
-- (orphaned data with no valid parent-child relationship)
DELETE FROM tracker_days 
WHERE child_profile_id IS NULL;

-- Step 3: Add NOT NULL constraint to child_profile_id
ALTER TABLE tracker_days 
ALTER COLUMN child_profile_id SET NOT NULL;

-- Step 4: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tracker_days_child_profile_completed 
ON tracker_days(child_profile_id, completed, completed_at);

-- Step 5: Add comment explaining the data model
COMMENT ON COLUMN tracker_days.child_profile_id IS 'Each tracker day must be associated with a specific child profile. Tracks 30-day program progress per child.';
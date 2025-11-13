-- Fix script_feedback table to make child_id optional (nullable)
-- This allows feedback to work even when child_id is not tracked in script_usage

-- Make child_id nullable
ALTER TABLE script_feedback
  ALTER COLUMN child_id DROP NOT NULL;

-- Update the index to handle nullable child_id
DROP INDEX IF EXISTS idx_script_feedback_user_child;
CREATE INDEX idx_script_feedback_user_child ON script_feedback(user_id, child_id) WHERE child_id IS NOT NULL;

-- Add index for queries without child_id
CREATE INDEX idx_script_feedback_user_only ON script_feedback(user_id) WHERE child_id IS NULL;

-- Update comment
COMMENT ON COLUMN script_feedback.child_id IS 'Optional reference to child profile. Can be NULL for backwards compatibility with script_usage table.';

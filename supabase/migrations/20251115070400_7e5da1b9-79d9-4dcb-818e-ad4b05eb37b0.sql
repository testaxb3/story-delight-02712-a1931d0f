-- Fix quiz_completed status for users who have child profiles
-- If a user has child profiles, they must have completed the quiz

UPDATE profiles
SET 
  quiz_completed = true,
  quiz_in_progress = false,
  updated_at = now()
WHERE id IN (
  SELECT DISTINCT parent_id 
  FROM child_profiles
)
AND (quiz_completed = false OR quiz_completed IS NULL);

-- Add comment for documentation
COMMENT ON COLUMN profiles.quiz_completed IS 'Indicates if the user has completed the brain profile quiz. Automatically set to true when child profiles exist.';
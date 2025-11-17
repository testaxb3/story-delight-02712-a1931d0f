-- Fix inconsistent quiz states where quiz_completed=true but quiz_in_progress=true
-- This can happen from race conditions or incomplete updates
UPDATE profiles 
SET quiz_in_progress = false 
WHERE quiz_completed = true 
  AND quiz_in_progress = true;

-- Add a trigger to prevent future inconsistencies
CREATE OR REPLACE FUNCTION prevent_quiz_state_inconsistency()
RETURNS TRIGGER AS $$
BEGIN
  -- If quiz is being marked as completed, force quiz_in_progress to false
  IF NEW.quiz_completed = true THEN
    NEW.quiz_in_progress := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS quiz_state_consistency_trigger ON profiles;

-- Create trigger to run before insert or update
CREATE TRIGGER quiz_state_consistency_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_quiz_state_inconsistency();
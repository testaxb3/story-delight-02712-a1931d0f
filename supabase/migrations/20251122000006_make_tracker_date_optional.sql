-- Make tracker_days.date column optional for backward compatibility
-- This ensures the app works even if the leaderboard migration hasn't run yet

-- Add date column if it doesn't exist (no-op if already exists)
ALTER TABLE public.tracker_days ADD COLUMN IF NOT EXISTS date date;

-- Remove NOT NULL constraint if it exists (makes date optional)
ALTER TABLE public.tracker_days ALTER COLUMN date DROP NOT NULL;

-- Migrate any existing NULL dates to use created_at
UPDATE public.tracker_days
SET date = created_at::date
WHERE date IS NULL;

-- Create a function to auto-populate date on INSERT if not provided
CREATE OR REPLACE FUNCTION set_tracker_date_default()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.date IS NULL THEN
    NEW.date := CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-populate date
DROP TRIGGER IF EXISTS trigger_set_tracker_date ON public.tracker_days;
CREATE TRIGGER trigger_set_tracker_date
  BEFORE INSERT ON public.tracker_days
  FOR EACH ROW
  EXECUTE FUNCTION set_tracker_date_default();

-- Keep the unique index on date (if exists), but make it work with NULLs
DROP INDEX IF EXISTS tracker_days_user_child_date_unique;

-- Create partial unique index that only applies when date is NOT NULL
-- This allows NULLs while preventing duplicate dates
CREATE UNIQUE INDEX IF NOT EXISTS tracker_days_user_child_date_unique
  ON public.tracker_days(user_id, child_profile_id, date)
  WHERE date IS NOT NULL;

-- Also keep the old day_number index for backward compatibility
-- This ensures both old and new code can work
CREATE UNIQUE INDEX IF NOT EXISTS tracker_days_user_child_day_unique
  ON public.tracker_days(user_id, child_profile_id, day_number);

COMMENT ON COLUMN public.tracker_days.date IS 'Actual date of completion (optional, defaults to today)';
COMMENT ON TRIGGER trigger_set_tracker_date ON public.tracker_days IS 'Auto-populate date field if not provided';

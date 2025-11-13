-- Enable Leaderboard & Streaks
-- Migrate tracker_days from day_number to date-based tracking
-- Add streak freeze and leaderboard features

-- Add date column to tracker_days (will replace day_number)
ALTER TABLE public.tracker_days ADD COLUMN IF NOT EXISTS date date;
ALTER TABLE public.tracker_days ADD COLUMN IF NOT EXISTS streak_freeze_used boolean NOT NULL DEFAULT false;

-- Migrate existing data from day_number to date
-- Assume day_number 1 was created_at date, calculate others from there
UPDATE public.tracker_days
SET date = (created_at::date - (day_number - 1))
WHERE date IS NULL AND day_number IS NOT NULL;

-- For any remaining null dates, use created_at
UPDATE public.tracker_days
SET date = created_at::date
WHERE date IS NULL;

-- Make date NOT NULL now that we've migrated data
ALTER TABLE public.tracker_days ALTER COLUMN date SET NOT NULL;

-- Drop old unique constraint
DROP INDEX IF EXISTS tracker_days_user_child_day_unique;

-- Create new unique constraint using date instead of day_number
CREATE UNIQUE INDEX tracker_days_user_child_date_unique
  ON public.tracker_days(user_id, child_profile_id, date);

-- Create index for date queries
CREATE INDEX IF NOT EXISTS idx_tracker_days_date ON public.tracker_days(date DESC);
CREATE INDEX IF NOT EXISTS idx_tracker_days_user_date ON public.tracker_days(user_id, date DESC);

-- Function to calculate current streak
CREATE OR REPLACE FUNCTION calculate_streak(p_user_id uuid, p_child_profile_id uuid)
RETURNS integer AS $$
DECLARE
  v_streak integer := 0;
  v_current_date date := CURRENT_DATE;
  v_freeze_available boolean := true;
  v_last_week_start date := CURRENT_DATE - interval '7 days';
BEGIN
  -- Check if user logged today or yesterday (streak continues)
  IF NOT EXISTS (
    SELECT 1 FROM public.tracker_days
    WHERE user_id = p_user_id
      AND (child_profile_id = p_child_profile_id OR child_profile_id IS NULL)
      AND date >= v_current_date - 1
      AND completed = true
  ) THEN
    RETURN 0; -- Streak broken
  END IF;

  -- Count consecutive days backwards
  FOR v_current_date IN
    SELECT generate_series(CURRENT_DATE, CURRENT_DATE - interval '365 days', -interval '1 day')::date
  LOOP
    -- Check if this date was completed
    IF EXISTS (
      SELECT 1 FROM public.tracker_days
      WHERE user_id = p_user_id
        AND (child_profile_id = p_child_profile_id OR child_profile_id IS NULL)
        AND date = v_current_date
        AND completed = true
    ) THEN
      v_streak := v_streak + 1;
    ELSE
      -- Check if streak freeze was used in the last 7 days
      IF v_freeze_available AND v_current_date >= v_last_week_start THEN
        -- Check if freeze was used this week
        IF EXISTS (
          SELECT 1 FROM public.tracker_days
          WHERE user_id = p_user_id
            AND (child_profile_id = p_child_profile_id OR child_profile_id IS NULL)
            AND date >= v_last_week_start
            AND date < v_current_date
            AND streak_freeze_used = true
        ) THEN
          v_freeze_available := false;
        ELSE
          -- Use freeze (don't break streak)
          v_freeze_available := false;
          CONTINUE;
        END IF;
      END IF;

      -- Streak broken
      EXIT;
    END IF;
  END LOOP;

  RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user_stats view for leaderboard (anonymized)
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
  td.user_id,
  td.child_profile_id,
  cp.brain_profile,
  COUNT(*) FILTER (WHERE td.completed = true) as completed_days,
  calculate_streak(td.user_id, td.child_profile_id) as current_streak,
  MAX(td.date) FILTER (WHERE td.completed = true) as last_active_date,
  -- Anonymize user identity
  'Parent ' || SUBSTRING(td.user_id::text, 1, 4) as anonymous_name
FROM public.tracker_days td
LEFT JOIN public.child_profiles cp ON td.child_profile_id = cp.id
GROUP BY td.user_id, td.child_profile_id, cp.brain_profile;

-- Create leaderboard view (top 100 by streak)
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  ROW_NUMBER() OVER (ORDER BY current_streak DESC, completed_days DESC) as rank,
  anonymous_name,
  brain_profile,
  current_streak,
  completed_days,
  last_active_date
FROM public.user_stats
WHERE last_active_date >= CURRENT_DATE - interval '7 days' -- Active in last week
ORDER BY current_streak DESC, completed_days DESC
LIMIT 100;

-- RLS for leaderboard (public view, anyone can see)
ALTER VIEW public.leaderboard SET (security_invoker = false);
ALTER VIEW public.user_stats SET (security_invoker = false);

-- Grant access to authenticated users
GRANT SELECT ON public.leaderboard TO authenticated;
GRANT SELECT ON public.user_stats TO authenticated;

-- Function to check if user needs streak celebration
CREATE OR REPLACE FUNCTION check_streak_milestone(p_user_id uuid, p_child_profile_id uuid)
RETURNS json AS $$
DECLARE
  v_streak integer;
  v_milestone integer;
BEGIN
  v_streak := calculate_streak(p_user_id, p_child_profile_id);

  -- Check for milestone streaks: 7, 14, 30, 60, 90
  IF v_streak = 7 THEN
    v_milestone := 7;
  ELSIF v_streak = 14 THEN
    v_milestone := 14;
  ELSIF v_streak = 30 THEN
    v_milestone := 30;
  ELSIF v_streak = 60 THEN
    v_milestone := 60;
  ELSIF v_streak = 90 THEN
    v_milestone := 90;
  ELSE
    v_milestone := 0;
  END IF;

  RETURN json_build_object(
    'current_streak', v_streak,
    'milestone', v_milestone,
    'celebrate', v_milestone > 0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON COLUMN public.tracker_days.date IS 'The actual date of the tracker entry (replacing day_number)';
COMMENT ON COLUMN public.tracker_days.streak_freeze_used IS 'Whether the user used their weekly streak freeze on this day';
COMMENT ON FUNCTION calculate_streak IS 'Calculates current streak with support for one missed day per week (streak freeze)';
COMMENT ON VIEW public.leaderboard IS 'Top 100 users by streak, anonymized for privacy';

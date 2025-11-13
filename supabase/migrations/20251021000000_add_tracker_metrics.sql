-- Add missing columns to tracker_days table for metrics tracking
-- These columns are essential for the Dashboard analytics

-- Add stress_level column (1-5 scale)
ALTER TABLE public.tracker_days
  ADD COLUMN IF NOT EXISTS stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5);

-- Add meltdown_count column (frequency tracking)
ALTER TABLE public.tracker_days
  ADD COLUMN IF NOT EXISTS meltdown_count TEXT CHECK (meltdown_count IN ('0', '1-2', '3-5', '5+'));

-- Add comment for clarity
COMMENT ON COLUMN public.tracker_days.stress_level IS 'Daily stress level on a scale of 1-5';
COMMENT ON COLUMN public.tracker_days.meltdown_count IS 'Number of meltdowns: 0, 1-2, 3-5, or 5+';

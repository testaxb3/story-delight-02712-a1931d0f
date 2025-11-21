-- Add result_speed column to child_profiles table
ALTER TABLE public.child_profiles
ADD COLUMN IF NOT EXISTS result_speed TEXT DEFAULT 'balanced' CHECK (result_speed IN ('slow', 'balanced', 'intensive'));

-- Add comment
COMMENT ON COLUMN public.child_profiles.result_speed IS 'User''s preferred speed for seeing results: slow (gradual), balanced (moderate), or intensive (fast)';
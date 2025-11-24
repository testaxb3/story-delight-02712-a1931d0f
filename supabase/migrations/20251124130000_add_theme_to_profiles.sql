-- Add theme column to profiles table
-- This allows users to persist their theme preference (light/dark) across devices

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS theme TEXT CHECK (theme IN ('light', 'dark'));

-- Set default to null (users choose during onboarding)
ALTER TABLE public.profiles
ALTER COLUMN theme SET DEFAULT NULL;

-- Add helpful comment
COMMENT ON COLUMN public.profiles.theme IS
'User preferred theme: light or dark. NULL means not yet selected during onboarding.';

-- Create index for faster theme queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_profiles_theme ON public.profiles(theme);

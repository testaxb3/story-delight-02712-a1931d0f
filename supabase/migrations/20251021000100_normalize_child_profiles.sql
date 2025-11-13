-- Normalize child profiles into separate table for better data structure
-- This allows parents to manage multiple children with different brain profiles

-- Create child_profiles table
CREATE TABLE IF NOT EXISTS public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brain_profile TEXT NOT NULL CHECK (brain_profile IN ('INTENSE', 'DISTRACTED', 'DEFIANT')),
  age INTEGER,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Enable RLS on child_profiles
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for child_profiles
DROP POLICY IF EXISTS "Parents can view own children" ON public.child_profiles;
CREATE POLICY "Parents can view own children"
  ON public.child_profiles
  FOR SELECT
  USING (parent_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id));

DROP POLICY IF EXISTS "Parents can insert own children" ON public.child_profiles;
CREATE POLICY "Parents can insert own children"
  ON public.child_profiles
  FOR INSERT
  WITH CHECK (parent_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id));

DROP POLICY IF EXISTS "Parents can update own children" ON public.child_profiles;
CREATE POLICY "Parents can update own children"
  ON public.child_profiles
  FOR UPDATE
  USING (parent_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id))
  WITH CHECK (parent_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id));

DROP POLICY IF EXISTS "Parents can delete own children" ON public.child_profiles;
CREATE POLICY "Parents can delete own children"
  ON public.child_profiles
  FOR DELETE
  USING (parent_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id));

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_child_profiles_updated_at ON public.child_profiles;
CREATE TRIGGER update_child_profiles_updated_at
  BEFORE UPDATE ON public.child_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS child_profiles_parent_id_idx ON public.child_profiles(parent_id);
CREATE INDEX IF NOT EXISTS child_profiles_brain_profile_idx ON public.child_profiles(brain_profile);

-- Migrate existing data from profiles.child_name and profiles.child_profile
-- Only migrate if both child_name and brain_profile exist
INSERT INTO public.child_profiles (parent_id, name, brain_profile)
SELECT
  id as parent_id,
  COALESCE(child_name, 'Meu Filho') as name,
  CASE
    WHEN brain_profile IN ('INTENSE', 'DISTRACTED', 'DEFIANT') THEN brain_profile
    ELSE 'INTENSE'
  END as brain_profile
FROM public.profiles
WHERE child_name IS NOT NULL OR brain_profile IS NOT NULL
ON CONFLICT DO NOTHING;

-- Add child_profile_id reference to tracker_days for better tracking
ALTER TABLE public.tracker_days
  ADD COLUMN IF NOT EXISTS child_profile_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE;

-- Create index on tracker_days for child_profile_id
CREATE INDEX IF NOT EXISTS tracker_days_child_profile_id_idx ON public.tracker_days(child_profile_id);

-- Add comment for clarity
COMMENT ON TABLE public.child_profiles IS 'Stores individual child profiles with their brain type assessment';
COMMENT ON COLUMN public.child_profiles.brain_profile IS 'Brain profile type from quiz: INTENSE, DISTRACTED, or DEFIANT';
COMMENT ON COLUMN public.child_profiles.is_active IS 'Whether this child profile is currently active for the parent';

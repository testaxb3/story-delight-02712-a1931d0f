-- Fix schema inconsistencies identified in production

-- 1. Add missing 'tags' column to scripts table
ALTER TABLE public.scripts
  ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add comment
COMMENT ON COLUMN public.scripts.tags IS 'Searchable keywords for filtering scripts';

-- 2. Add missing columns to scripts if they don't exist
ALTER TABLE public.scripts
  ADD COLUMN IF NOT EXISTS phrase_1_action TEXT,
  ADD COLUMN IF NOT EXISTS phrase_2_action TEXT,
  ADD COLUMN IF NOT EXISTS phrase_3_action TEXT,
  ADD COLUMN IF NOT EXISTS estimated_time_minutes INTEGER;

-- 3. Add missing 'profile' column if it doesn't exist (for brain type filtering)
ALTER TABLE public.scripts
  ADD COLUMN IF NOT EXISTS profile TEXT CHECK (profile IN ('INTENSE', 'DISTRACTED', 'DEFIANT') OR profile IS NULL);

-- Add index for faster filtering by profile
CREATE INDEX IF NOT EXISTS scripts_profile_idx ON public.scripts(profile);

-- 4. Create development_milestones table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.development_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brain_profile TEXT NOT NULL CHECK (brain_profile IN ('INTENSE', 'DISTRACTED', 'DEFIANT')),
  age_range TEXT NOT NULL,
  milestone_title TEXT NOT NULL,
  milestone_description TEXT NOT NULL,
  recommended_script_ids UUID[] DEFAULT '{}',
  recommended_video_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE public.development_milestones ENABLE ROW LEVEL SECURITY;

-- Anyone can view milestones
DROP POLICY IF EXISTS "Anyone can view milestones" ON public.development_milestones;
CREATE POLICY "Anyone can view milestones"
  ON public.development_milestones
  FOR SELECT
  USING (true);

-- Only admins can manage milestones
DROP POLICY IF EXISTS "Admins can manage milestones" ON public.development_milestones;
CREATE POLICY "Admins can manage milestones"
  ON public.development_milestones
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_development_milestones_updated_at ON public.development_milestones;
CREATE TRIGGER update_development_milestones_updated_at
  BEFORE UPDATE ON public.development_milestones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create index
CREATE INDEX IF NOT EXISTS development_milestones_brain_profile_idx ON public.development_milestones(brain_profile);

-- 5. Fix community_posts foreign key to profiles
-- First, check if the foreign key exists and drop it if it's pointing to auth.users
DO $$
BEGIN
  -- Drop existing foreign key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'community_posts_user_id_fkey'
    AND table_name = 'community_posts'
  ) THEN
    ALTER TABLE public.community_posts DROP CONSTRAINT community_posts_user_id_fkey;
  END IF;

  -- Add new foreign key pointing to profiles
  ALTER TABLE public.community_posts
    ADD CONSTRAINT community_posts_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;
END $$;

-- 6. Create is_admin RPC function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 7. Create script_feedback table if it doesn't exist (used in Scripts.tsx)
CREATE TABLE IF NOT EXISTS public.script_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_profile_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  outcome TEXT NOT NULL CHECK (outcome IN ('worked', 'partial', 'didnt_work')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE public.script_feedback ENABLE ROW LEVEL SECURITY;

-- Users can view their own feedback
DROP POLICY IF EXISTS "Users can view own feedback" ON public.script_feedback;
CREATE POLICY "Users can view own feedback"
  ON public.script_feedback
  FOR SELECT
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Users can create their own feedback
DROP POLICY IF EXISTS "Users can create own feedback" ON public.script_feedback;
CREATE POLICY "Users can create own feedback"
  ON public.script_feedback
  FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Users can update their own feedback
DROP POLICY IF EXISTS "Users can update own feedback" ON public.script_feedback;
CREATE POLICY "Users can update own feedback"
  ON public.script_feedback
  FOR UPDATE
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_script_feedback_updated_at ON public.script_feedback;
CREATE TRIGGER update_script_feedback_updated_at
  BEFORE UPDATE ON public.script_feedback
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS script_feedback_user_id_idx ON public.script_feedback(user_id);
CREATE INDEX IF NOT EXISTS script_feedback_child_profile_id_idx ON public.script_feedback(child_profile_id);
CREATE INDEX IF NOT EXISTS script_feedback_script_id_idx ON public.script_feedback(script_id);

-- Add comments
COMMENT ON TABLE public.development_milestones IS 'Age-based developmental milestones for each brain profile type';
COMMENT ON TABLE public.script_feedback IS 'User feedback on script effectiveness for tracking outcomes';

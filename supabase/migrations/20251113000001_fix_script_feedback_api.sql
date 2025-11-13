-- ============================================================================
-- FIX SCRIPT_FEEDBACK 406 ERROR
-- ============================================================================
-- This migration ensures script_feedback table is properly exposed via PostgREST API
-- Fixes: GET /rest/v1/script_feedback 406 (Not Acceptable)
-- ============================================================================

-- 1. Ensure script_feedback table has correct RLS policies
ALTER TABLE IF EXISTS public.script_feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own feedback" ON public.script_feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.script_feedback;
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.script_feedback;

-- 2. Create RLS policies for script_feedback
CREATE POLICY "Users can insert their own feedback"
  ON public.script_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON public.script_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
  ON public.script_feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 3. Grant necessary permissions
GRANT SELECT, INSERT ON public.script_feedback TO authenticated;
GRANT ALL ON public.script_feedback TO service_role;

-- 4. Ensure table is in public schema and accessible
COMMENT ON TABLE public.script_feedback IS 'Stores user feedback for NEP scripts';

-- 5. Reload PostgREST schema cache (optional, Supabase auto-reloads)
NOTIFY pgrst, 'reload schema';

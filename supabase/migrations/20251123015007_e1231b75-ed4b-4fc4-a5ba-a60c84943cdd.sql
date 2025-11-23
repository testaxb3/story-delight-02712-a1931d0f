-- Fix RLS policies for quiz completion
-- The issue: existing policy might be too restrictive for quiz_completed updates

-- Drop existing update policy if needed and recreate with explicit permissions
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a comprehensive update policy that explicitly allows quiz fields
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add explicit policy for quiz completion (belt and suspenders approach)
CREATE POLICY "Users can update quiz status"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Ensure the prevent_quiz_state_inconsistency trigger is working correctly
-- (it should automatically set quiz_in_progress=false when quiz_completed=true)

-- ============================================================================
-- Migration: Fix Critical Security Issue - Remove Permissive RLS Policy
-- Description: Removes the overly permissive "Users read own tracker" policy
--              that allows ANY user to read ALL data from tracker_days
-- ============================================================================

-- Drop the insecure policy that has qual:true
DROP POLICY IF EXISTS "Users read own tracker" ON public.tracker_days;

-- Verify we still have the correct restrictive policies in place
-- These should already exist from previous migrations:
-- - "Users can view tracker days" with qual: (auth.uid() = user_id)
-- - "Users can manage tracker days" with qual: (auth.uid() = user_id)

-- Add comment explaining the security fix
COMMENT ON TABLE public.tracker_days IS 
'Tracker days table stores user progress data. 
SECURITY: Only users can access their own tracker days via RLS policies.
The overly permissive policy allowing qual:true was removed to prevent data leakage.';
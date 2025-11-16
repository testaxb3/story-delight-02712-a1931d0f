-- ============================================================================
-- Migration: Fix Critical Security - Remove Permissive Policies v3
-- Description: Drop insecure policies allowing access to all user data
-- ============================================================================

-- Drop insecure policies from profiles
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

-- Drop insecure policy from user_progress  
DROP POLICY IF EXISTS "Users read own progress" ON public.user_progress;

-- Verify remaining policies are secure (these should remain):
-- profiles: "Users can update own profile", "Users can insert own profile", "Users can delete own profile", "Users insert own profile"
-- user_progress: "Users can manage their progress", "Users can view their progress"

COMMENT ON TABLE public.profiles IS 
'SECURITY FIX: Removed policies allowing authenticated users to read ALL profiles. 
Now users can only access their own profile data.';

COMMENT ON TABLE public.user_progress IS 
'SECURITY FIX: Removed policy allowing users to read ALL progress data.
Now users can only access their own progress.';
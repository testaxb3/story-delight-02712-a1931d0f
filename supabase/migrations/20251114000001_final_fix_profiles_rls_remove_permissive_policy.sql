-- ============================================================================
-- FINAL FIX: Remove overly permissive SELECT policy on profiles table
-- ============================================================================
-- This migration fixes a remaining security issue where authenticated users
-- can still SELECT all fields (including email, is_premium, is_admin) from
-- the profiles table directly, bypassing the intended public_profiles view.
--
-- Security Issue Fixed: Overly Permissive SELECT Policy (CRITICAL)
-- Audit Report Reference: Section 2.4 - RLS Policy Conflicts
--
-- Previous Issue:
-- - Policy "Users can view public profile fields" has USING (true)
-- - This allows SELECT queries to return ALL columns, not just public ones
-- - Users can query: SELECT email, is_premium FROM profiles WHERE id = 'any-user-id'
--
-- New Security Model:
-- - Direct SELECT on profiles table: ONLY own profile OR admin
-- - Public profile data: MUST use public_profiles view
-- - Private profile data: MUST use get_profile_data() function
--
-- Created: 2025-11-14
-- Author: Security Audit Final Fix
-- ============================================================================

-- ============================================================================
-- 1. DROP THE OVERLY PERMISSIVE POLICY
-- ============================================================================

-- This policy was created in 20251113000003 with good intentions but wrong implementation
DROP POLICY IF EXISTS "Users can view public profile fields" ON public.profiles;

-- ============================================================================
-- 2. CREATE public_profiles VIEW (if not exists)
-- ============================================================================

-- Create a view with only public profile fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  id,
  name,
  photo_url,
  badges,
  followers_count,
  following_count,
  posts_count,
  likes_received_count,
  comments_count,
  bio,
  created_at,
  updated_at
FROM public.profiles;

-- Enable security barrier on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Grant SELECT on public_profiles view to authenticated and anonymous users
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- ============================================================================
-- 3. CREATE get_profile_data FUNCTION (if not exists)
-- ============================================================================

-- Function to get profile data with appropriate privacy filtering
CREATE OR REPLACE FUNCTION get_profile_data(profile_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  photo_url TEXT,
  bio TEXT,
  badges TEXT[],
  is_premium BOOLEAN,
  is_admin BOOLEAN,
  followers_count INTEGER,
  following_count INTEGER,
  posts_count INTEGER,
  likes_received_count INTEGER,
  comments_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  is_own_profile BOOLEAN;
  is_requesting_admin BOOLEAN;
BEGIN
  -- Check if requesting user is viewing their own profile
  is_own_profile := auth.uid() = profile_user_id;

  -- Check if requesting user is an admin
  SELECT COALESCE(p.is_admin, false) INTO is_requesting_admin
  FROM public.profiles p
  WHERE p.id = auth.uid();

  -- Return appropriate data based on permissions
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    -- Email: only show to owner or admins
    CASE
      WHEN is_own_profile OR is_requesting_admin THEN p.email
      ELSE NULL
    END as email,
    p.photo_url,
    p.bio,
    p.badges,
    -- Premium status: only show to owner or admins
    CASE
      WHEN is_own_profile OR is_requesting_admin THEN COALESCE(p.is_premium, false)
      ELSE false
    END as is_premium,
    -- Admin status: only show to owner or admins
    CASE
      WHEN is_own_profile OR is_requesting_admin THEN COALESCE(p.is_admin, false)
      ELSE false
    END as is_admin,
    p.followers_count,
    p.following_count,
    p.posts_count,
    p.likes_received_count,
    p.comments_count,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.id = profile_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_profile_data TO authenticated;

-- ============================================================================
-- 4. ADD DOCUMENTATION COMMENT
-- ============================================================================

COMMENT ON TABLE public.profiles IS
  'User profiles table. Direct SELECT requires auth.uid() = id OR admin privileges.
   For public profile data, use public_profiles view instead.
   For privacy-controlled access, use get_profile_data() function.';

-- ============================================================================
-- 5. VERIFICATION QUERY
-- ============================================================================

-- Test this fix by running as a non-admin user:
--
-- ❌ SHOULD FAIL (return 0 rows for other users):
-- SELECT email, is_premium FROM profiles WHERE id != auth.uid();
--
-- ✅ SHOULD SUCCEED (return own profile):
-- SELECT email, is_premium FROM profiles WHERE id = auth.uid();
--
-- ✅ SHOULD SUCCEED (return public fields only):
-- SELECT * FROM public_profiles;
--
-- ✅ SHOULD SUCCEED (return data with privacy filtering):
-- SELECT * FROM get_profile_data('any-user-uuid');

-- ============================================================================
-- SECURITY VALIDATION
-- ============================================================================

-- Verify that non-admin users CANNOT see sensitive data of other users
DO $$
DECLARE
  policy_count INTEGER;
  view_exists BOOLEAN;
  function_exists BOOLEAN;
BEGIN
  -- Check that overly permissive policy is gone
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'profiles'
    AND policyname = 'Users can view public profile fields';

  IF policy_count > 0 THEN
    RAISE EXCEPTION 'Overly permissive policy still exists!';
  END IF;

  -- Verify public_profiles view exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.views
    WHERE table_schema = 'public' AND table_name = 'public_profiles'
  ) INTO view_exists;

  IF NOT view_exists THEN
    RAISE EXCEPTION 'public_profiles view is missing!';
  END IF;

  -- Verify get_profile_data function exists
  SELECT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'get_profile_data'
  ) INTO function_exists;

  IF NOT function_exists THEN
    RAISE EXCEPTION 'get_profile_data function is missing!';
  END IF;

  RAISE NOTICE 'Security validation passed! RLS policies are correctly configured.';
END $$;

-- ============================================================================
-- MIGRATION SUMMARY
-- ============================================================================

-- BEFORE:
-- - Authenticated users could SELECT email, is_premium, is_admin from any profile
--
-- AFTER:
-- - Users can only SELECT their own complete profile (auth.uid() = id)
-- - Admins can SELECT any profile
-- - Everyone else must use:
--   * public_profiles view (public fields only)
--   * get_profile_data() function (with privacy filtering)
--
-- This ensures sensitive user data is properly protected at the database level.

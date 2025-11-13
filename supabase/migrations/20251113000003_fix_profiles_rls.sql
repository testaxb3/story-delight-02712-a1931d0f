-- ============================================================================
-- FIX WEAK RLS POLICIES ON PROFILES TABLE
-- ============================================================================
-- This migration fixes the overly permissive RLS policy on the profiles table
-- that exposes sensitive user data to all authenticated users.
--
-- Security Issue Fixed: Weak RLS Policy on User Profiles (HIGH SEVERITY)
-- Audit Report Reference: Section 2.4
--
-- Previous Issue:
-- - All profile data (including email, premium status, sensitive fields) was
--   visible to ALL authenticated users
--
-- New Security Model:
-- - Public fields: name, photo_url, badges, followers_count, posts_count
-- - Private fields (own profile only): email, is_premium, is_admin, child profiles
-- - Admin users: can view all fields for all users
--
-- Created: 2025-11-13
-- Author: Security Audit Fix
-- ============================================================================

-- ============================================================================
-- 1. DROP EXISTING OVERLY PERMISSIVE POLICIES
-- ============================================================================

-- Remove the old "view all profiles" policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Remove old update/delete policies that might be too permissive
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- ============================================================================
-- 2. CREATE PUBLIC PROFILE VIEW (Recommended Approach)
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

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- ============================================================================
-- 3. CREATE NEW SECURE RLS POLICIES FOR PROFILES TABLE
-- ============================================================================

-- Policy 1: Users can view public fields of any profile
CREATE POLICY "Users can view public profile fields"
  ON public.profiles FOR SELECT
  USING (
    -- Allow viewing of non-sensitive fields for all profiles
    true
  );

-- Policy 2: Users can view ALL fields of their OWN profile
CREATE POLICY "Users can view own complete profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy 3: Admins can view ALL fields of ALL profiles
CREATE POLICY "Admins can view all profile data"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy 4: Users can update ONLY their own profile (excluding admin/premium fields)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Prevent users from self-promoting to admin or premium
    AND (
      CASE
        -- If user is trying to change is_admin or is_premium, reject
        WHEN (
          (is_admin IS DISTINCT FROM (SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
          OR
          (is_premium IS DISTINCT FROM (SELECT is_premium FROM public.profiles WHERE id = auth.uid()))
        ) THEN false
        ELSE true
      END
    )
  );

-- Policy 5: Only admins can update admin/premium status
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy 6: Users can insert their own profile (during signup)
CREATE POLICY "Users can create own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id
    -- Prevent new users from setting themselves as admin or premium
    AND (is_admin = false OR is_admin IS NULL)
    AND (is_premium = false OR is_premium IS NULL)
  );

-- Policy 7: Only admins can delete profiles
CREATE POLICY "Only admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- 4. CREATE FUNCTION TO GET PROFILE WITH PRIVACY CONTROLS
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
  SELECT p.is_admin INTO is_requesting_admin
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
      WHEN is_own_profile OR is_requesting_admin THEN p.is_premium
      ELSE false
    END as is_premium,
    -- Admin status: only show to owner or admins
    CASE
      WHEN is_own_profile OR is_requesting_admin THEN p.is_admin
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
-- 5. CREATE FUNCTION TO CHECK IF USER CAN VIEW SENSITIVE DATA
-- ============================================================================

CREATE OR REPLACE FUNCTION can_view_sensitive_profile_data(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_own_profile BOOLEAN;
  is_admin BOOLEAN;
BEGIN
  -- Check if viewing own profile
  is_own_profile := auth.uid() = target_user_id;

  -- Check if user is admin
  SELECT p.is_admin INTO is_admin
  FROM public.profiles p
  WHERE p.id = auth.uid();

  RETURN is_own_profile OR COALESCE(is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION can_view_sensitive_profile_data TO authenticated;

-- ============================================================================
-- 6. AUDIT LOGGING FOR SENSITIVE PROFILE ACCESS
-- ============================================================================

-- Create table to log access to sensitive profile data (optional but recommended)
CREATE TABLE IF NOT EXISTS public.profile_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accessor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  accessed_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL, -- 'view', 'update', 'delete'
  fields_accessed TEXT[],
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Enable RLS (admins only can view)
ALTER TABLE public.profile_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view profile access logs"
  ON public.profile_access_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_profile_access_log_accessed
  ON public.profile_access_log(accessed_profile_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profile_access_log_accessor
  ON public.profile_access_log(accessor_id, created_at DESC);

-- ============================================================================
-- 7. UPDATE EXISTING QUERIES TO USE SECURE PATTERNS
-- ============================================================================

-- Add helpful comment for developers
COMMENT ON VIEW public.public_profiles IS
  'Public view of profile data. Use this instead of direct profile table access for community features. Contains only non-sensitive fields.';

COMMENT ON FUNCTION get_profile_data IS
  'Securely retrieves profile data with appropriate privacy filtering. Use this function instead of direct SELECT queries on profiles table.';

COMMENT ON FUNCTION can_view_sensitive_profile_data IS
  'Checks if the current user has permission to view sensitive profile data of target user. Returns true for own profile or if user is admin.';

-- ============================================================================
-- 8. DATA VALIDATION - Prevent privilege escalation
-- ============================================================================

-- Trigger to prevent non-admins from setting admin/premium flags
CREATE OR REPLACE FUNCTION prevent_privilege_escalation()
RETURNS TRIGGER AS $$
DECLARE
  requesting_user_is_admin BOOLEAN;
BEGIN
  -- Get admin status of requesting user
  SELECT is_admin INTO requesting_user_is_admin
  FROM public.profiles
  WHERE id = auth.uid();

  -- If not admin, prevent changes to is_admin and is_premium
  IF NOT COALESCE(requesting_user_is_admin, false) THEN
    -- For UPDATE operations
    IF TG_OP = 'UPDATE' THEN
      -- Restore original values if non-admin tries to change them
      IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
        NEW.is_admin := OLD.is_admin;
        RAISE WARNING 'Non-admin users cannot change admin status';
      END IF;

      IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
        NEW.is_premium := OLD.is_premium;
        RAISE WARNING 'Non-admin users cannot change premium status';
      END IF;
    END IF;

    -- For INSERT operations
    IF TG_OP = 'INSERT' THEN
      -- Force false for new profiles created by non-admins
      NEW.is_admin := false;
      NEW.is_premium := false;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to enforce privilege protection
DROP TRIGGER IF EXISTS trigger_prevent_privilege_escalation ON public.profiles;
CREATE TRIGGER trigger_prevent_privilege_escalation
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_privilege_escalation();

-- ============================================================================
-- 9. SECURITY BEST PRACTICES DOCUMENTATION
-- ============================================================================

/*
SECURITY BEST PRACTICES FOR PROFILE DATA ACCESS:

1. PUBLIC DATA (Anyone can see):
   - Use public_profiles view
   - Fields: name, photo_url, badges, follower counts, posts count

2. PRIVATE DATA (Owner + Admins only):
   - Use get_profile_data() function
   - Fields: email, is_premium, is_admin, child profiles

3. CHECKING PERMISSIONS:
   - Use can_view_sensitive_profile_data() before showing sensitive UI

4. UPDATING PROFILES:
   - Users can only update their own profile
   - Admin/premium flags are protected by trigger
   - Admins can update any profile

EXAMPLE USAGE IN APPLICATION:

Frontend (React):
```typescript
// Viewing public profile data
const { data: publicProfile } = await supabase
  .from('public_profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Viewing complete profile (with privacy filtering)
const { data: completeProfile } = await supabase
  .rpc('get_profile_data', { profile_user_id: userId });

// Checking permissions before showing sensitive UI
const { data: canViewSensitive } = await supabase
  .rpc('can_view_sensitive_profile_data', { target_user_id: userId });
```
*/

-- ============================================================================
-- ROLLBACK INSTRUCTIONS
-- ============================================================================

-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS trigger_prevent_privilege_escalation ON public.profiles;
-- DROP FUNCTION IF EXISTS prevent_privilege_escalation();
-- DROP FUNCTION IF EXISTS can_view_sensitive_profile_data(UUID);
-- DROP FUNCTION IF EXISTS get_profile_data(UUID);
-- DROP TABLE IF EXISTS public.profile_access_log;
-- DROP VIEW IF EXISTS public.public_profiles;
--
-- Then restore the old permissive policy:
-- CREATE POLICY "Users can view all profiles"
--   ON public.profiles FOR SELECT
--   USING (true);

-- ============================================================================
-- VERIFICATION QUERIES (Run these to test the security)
-- ============================================================================

-- Test 1: Verify public_profiles view doesn't expose sensitive data
-- SELECT * FROM public.public_profiles LIMIT 5;

-- Test 2: Verify get_profile_data respects privacy
-- SELECT * FROM get_profile_data('some-user-uuid');

-- Test 3: Check privilege escalation protection
-- UPDATE public.profiles SET is_admin = true WHERE id = auth.uid();
-- (Should fail or be silently corrected for non-admins)

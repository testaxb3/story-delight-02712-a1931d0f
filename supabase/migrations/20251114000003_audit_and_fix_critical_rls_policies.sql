-- ============================================================================
-- AUDIT AND FIX CRITICAL RLS POLICIES
-- ============================================================================
-- This migration audits and fixes Row Level Security policies for critical
-- tables identified in the security audit: scripts, videos, community posts,
-- admin tables, and bonuses.
--
-- Security Issues Fixed:
-- 1. Inadequate post deletion authorization
-- 2. Weak ebook access control
-- 3. Admin table access
--
-- Created: 2025-11-14
-- Author: Security Audit Fix
-- ============================================================================

-- ============================================================================
-- 1. COMMUNITY POSTS - Fix Delete Authorization
-- ============================================================================

-- Ensure community_posts has RLS enabled
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Users can delete own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Allow users to delete their own posts" ON public.community_posts;

-- Create secure delete policy
CREATE POLICY "Users can delete only their own posts"
  ON public.community_posts FOR DELETE
  USING (
    auth.uid() = user_id
    OR
    -- Allow admins to delete any post
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- 2. BONUSES - Fix Access Control
-- ============================================================================

-- Ensure bonuses table has RLS enabled
ALTER TABLE IF EXISTS public.bonuses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Bonuses are viewable by everyone" ON public.bonuses;
DROP POLICY IF EXISTS "Users can view bonuses" ON public.bonuses;

-- Policy 1: Premium users can view premium bonuses
CREATE POLICY "Users can view accessible bonuses"
  ON public.bonuses FOR SELECT
  USING (
    -- Public bonuses visible to all
    (is_premium_content = FALSE)
    OR
    -- Premium bonuses only to premium users
    (
      is_premium_content = TRUE
      AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_premium = TRUE
      )
    )
    OR
    -- Admins can see everything
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy 2: Only admins can insert bonuses
DROP POLICY IF EXISTS "Admins can insert bonuses" ON public.bonuses;
CREATE POLICY "Admins can insert bonuses"
  ON public.bonuses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy 3: Only admins can update bonuses
DROP POLICY IF EXISTS "Admins can update bonuses" ON public.bonuses;
CREATE POLICY "Admins can update bonuses"
  ON public.bonuses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy 4: Only admins can delete bonuses
DROP POLICY IF EXISTS "Admins can delete bonuses" ON public.bonuses;
CREATE POLICY "Admins can delete bonuses"
  ON public.bonuses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================================
-- 3. SCRIPTS - Ensure Admin-Only Modifications
-- ============================================================================

-- Ensure scripts table has RLS enabled
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Scripts are viewable by everyone" ON public.scripts;
DROP POLICY IF EXISTS "Anyone can view scripts" ON public.scripts;

-- Policy 1: All authenticated users can view scripts
CREATE POLICY "Authenticated users can view scripts"
  ON public.scripts FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy 2: Only admins can insert scripts
DROP POLICY IF EXISTS "Admins can insert scripts" ON public.scripts;
CREATE POLICY "Admins can insert scripts"
  ON public.scripts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy 3: Only admins can update scripts
DROP POLICY IF EXISTS "Admins can update scripts" ON public.scripts;
CREATE POLICY "Admins can update scripts"
  ON public.scripts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy 4: Only admins can delete scripts
DROP POLICY IF EXISTS "Admins can delete scripts" ON public.scripts;
CREATE POLICY "Admins can delete scripts"
  ON public.scripts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================================
-- 4. VIDEOS - Ensure Admin-Only Modifications
-- ============================================================================

-- Ensure videos table has RLS enabled
ALTER TABLE IF EXISTS public.videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Videos are viewable by everyone" ON public.videos;

-- Policy 1: All authenticated users can view videos
CREATE POLICY "Authenticated users can view videos"
  ON public.videos FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy 2: Only admins can modify videos
DROP POLICY IF EXISTS "Admins can manage videos" ON public.videos;
CREATE POLICY "Admins can insert videos"
  ON public.videos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update videos"
  ON public.videos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can delete videos"
  ON public.videos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================================
-- 5. REFUND_REQUESTS - Privacy Protection
-- ============================================================================

-- Ensure refund_requests table has RLS enabled
ALTER TABLE IF EXISTS public.refund_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own refund requests" ON public.refund_requests;
DROP POLICY IF EXISTS "Admins can view all refund requests" ON public.refund_requests;

-- Policy 1: Users can view only their own refund requests
CREATE POLICY "Users can view own refund requests"
  ON public.refund_requests FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy 2: Users can insert their own refund requests
DROP POLICY IF EXISTS "Users can create refund requests" ON public.refund_requests;
CREATE POLICY "Users can create refund requests"
  ON public.refund_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Only admins can update refund status
DROP POLICY IF EXISTS "Admins can update refund requests" ON public.refund_requests;
CREATE POLICY "Admins can update refund requests"
  ON public.refund_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================================
-- 6. POST_LIKES - Fix Potential Issues
-- ============================================================================

-- Ensure post_likes table has RLS enabled
ALTER TABLE IF EXISTS public.post_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view post likes" ON public.post_likes;
DROP POLICY IF EXISTS "Users can manage own likes" ON public.post_likes;

-- Policy 1: Users can view all likes (for like counts)
CREATE POLICY "Users can view post likes"
  ON public.post_likes FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy 2: Users can insert their own likes
CREATE POLICY "Users can create own likes"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can delete only their own likes
CREATE POLICY "Users can delete own likes"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 7. VERIFICATION QUERY
-- ============================================================================

-- Query to verify RLS is enabled on all tables
DO $$
DECLARE
  table_rec RECORD;
  rls_status TEXT;
BEGIN
  RAISE NOTICE 'RLS Status Audit:';
  RAISE NOTICE '==================';

  FOR table_rec IN
    SELECT schemaname, tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN (
        'profiles', 'scripts', 'videos', 'bonuses',
        'community_posts', 'post_likes', 'refund_requests',
        'child_profiles', 'user_progress'
      )
    ORDER BY tablename
  LOOP
    IF table_rec.rowsecurity THEN
      rls_status := '✅ ENABLED';
    ELSE
      rls_status := '❌ DISABLED';
    END IF;

    RAISE NOTICE '%: %', table_rec.tablename, rls_status;
  END LOOP;

  RAISE NOTICE '==================';
  RAISE NOTICE 'RLS audit completed. All critical tables should show ✅ ENABLED';
END $$;

-- ============================================================================
-- MIGRATION SUMMARY
-- ============================================================================

-- FIXED:
-- 1. ✅ Community posts can only be deleted by owner or admin
-- 2. ✅ Bonuses access controlled by premium status
-- 3. ✅ Scripts/Videos modifications restricted to admins
-- 4. ✅ Refund requests private to user and admins
-- 5. ✅ Post likes properly controlled
--
-- SECURITY IMPROVEMENTS:
-- - All admin checks use consistent pattern
-- - All policies use auth.uid() for authentication
-- - Premium content properly gated
-- - User privacy protected (own data only)
--
-- NEXT STEPS:
-- 1. Test all policies with non-admin account
-- 2. Verify premium content is not accessible to free users
-- 3. Confirm admins can access all admin functions
-- 4. Monitor for any RLS-related errors in production

-- Fix RLS policies for videos, pdfs, and feed_posts to use profiles.is_admin
--
-- ROOT CAUSE:
-- Same issue as scripts - policies use has_role() which checks user_roles table,
-- but the system uses profiles.is_admin column for admin verification.
--
-- SOLUTION:
-- Update RLS policies to use profiles.is_admin, matching frontend logic.

-- ============================================================================
-- VIDEOS TABLE
-- ============================================================================

-- Step 1: Drop all existing policies for videos
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'videos'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.videos', pol.policyname);
  END LOOP;
END $$;

-- Step 2: Create new policies for videos using profiles.is_admin
CREATE POLICY "Anyone can view videos"
ON public.videos
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert videos"
ON public.videos
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can update videos"
ON public.videos
FOR UPDATE
TO authenticated
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
)
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can delete videos"
ON public.videos
FOR DELETE
TO authenticated
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- ============================================================================
-- PDFS TABLE
-- ============================================================================

-- Step 3: Drop all existing policies for pdfs
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pdfs'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pdfs', pol.policyname);
  END LOOP;
END $$;

-- Step 4: Create new policies for pdfs using profiles.is_admin
CREATE POLICY "Anyone can view pdfs"
ON public.pdfs
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert pdfs"
ON public.pdfs
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can update pdfs"
ON public.pdfs
FOR UPDATE
TO authenticated
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
)
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can delete pdfs"
ON public.pdfs
FOR DELETE
TO authenticated
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- ============================================================================
-- FEED_POSTS TABLE
-- ============================================================================

-- Step 5: Drop all existing policies for feed_posts
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'feed_posts'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.feed_posts', pol.policyname);
  END LOOP;
END $$;

-- Step 6: Create new policies for feed_posts using profiles.is_admin
CREATE POLICY "Anyone can view feed posts"
ON public.feed_posts
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert feed posts"
ON public.feed_posts
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can update feed posts"
ON public.feed_posts
FOR UPDATE
TO authenticated
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
)
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can delete feed posts"
ON public.feed_posts
FOR DELETE
TO authenticated
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

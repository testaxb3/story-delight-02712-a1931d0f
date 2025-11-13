-- Fix RLS policies to be simpler and more reliable
-- The complex subqueries were causing 403/406 errors

-- ====================
-- PROFILES TABLE
-- ====================

-- Simplify profiles policies - allow authenticated users to read any profile
-- This is needed for joins, leaderboards, community features, etc.
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;

CREATE POLICY "Authenticated users can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only INSERT their own profile (using auth.uid())
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can only UPDATE their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can only DELETE their own profile
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ====================
-- CHILD_PROFILES TABLE
-- ====================

-- Simplify child_profiles policies - remove complex subqueries
DROP POLICY IF EXISTS "Parents can view own children" ON public.child_profiles;
CREATE POLICY "Parents can view own children"
  ON public.child_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = parent_id);

DROP POLICY IF EXISTS "Parents can insert own children" ON public.child_profiles;
CREATE POLICY "Parents can insert own children"
  ON public.child_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = parent_id);

DROP POLICY IF EXISTS "Parents can update own children" ON public.child_profiles;
CREATE POLICY "Parents can update own children"
  ON public.child_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

DROP POLICY IF EXISTS "Parents can delete own children" ON public.child_profiles;
CREATE POLICY "Parents can delete own children"
  ON public.child_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = parent_id);

-- ====================
-- TRACKER_DAYS TABLE
-- ====================

-- Ensure tracker_days has simple policies too
DO $$
BEGIN
  IF to_regclass('public.tracker_days') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.tracker_days ENABLE ROW LEVEL SECURITY';

    EXECUTE 'DROP POLICY IF EXISTS "Users can view tracker days" ON public.tracker_days';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert tracker days" ON public.tracker_days';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update tracker days" ON public.tracker_days';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete tracker days" ON public.tracker_days';

    EXECUTE 'CREATE POLICY "Users can view tracker days"
      ON public.tracker_days
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id)';

    EXECUTE 'CREATE POLICY "Users can insert tracker days"
      ON public.tracker_days
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id)';

    EXECUTE 'CREATE POLICY "Users can update tracker days"
      ON public.tracker_days
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)';

    EXECUTE 'CREATE POLICY "Users can delete tracker days"
      ON public.tracker_days
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id)';
  END IF;
END$$;

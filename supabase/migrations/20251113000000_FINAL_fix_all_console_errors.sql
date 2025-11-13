-- ============================================================================
-- FINAL FIX - Resolve All Console Errors
-- ============================================================================
-- This migration fixes ALL errors found in browser console by:
-- 1. Adding missing child_id column to tracker_days (currently has child_profile_id)
-- 2. Exposing scripts_usage table via PostgREST API
-- 3. Creating posts view from community_posts
-- 4. Exposing user_bonuses table via PostgREST API
-- 5. Exposing badges and user_badges tables via PostgREST API
-- 6. Ensuring all tables have proper RLS policies and grants
-- 7. Reloading PostgREST schema cache
-- ============================================================================

-- ============================================================================
-- PHASE 1: FIX TRACKER_DAYS - Add child_id column
-- ============================================================================

DO $$
BEGIN
  -- Add child_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tracker_days'
      AND column_name = 'child_id'
  ) THEN
    -- Add child_id column
    ALTER TABLE public.tracker_days
      ADD COLUMN child_id UUID;

    -- Add foreign key constraint if child_profiles table exists
    IF EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'child_profiles'
    ) THEN
      ALTER TABLE public.tracker_days
        ADD CONSTRAINT tracker_days_child_id_fkey
        FOREIGN KEY (child_id)
        REFERENCES public.child_profiles(id)
        ON DELETE CASCADE;
    END IF;

    -- Copy existing data from child_profile_id to child_id
    UPDATE public.tracker_days
    SET child_id = child_profile_id
    WHERE child_profile_id IS NOT NULL;

    -- Create index for performance
    CREATE INDEX IF NOT EXISTS idx_tracker_days_child_id
      ON public.tracker_days(child_id);

    -- Add comment explaining the column
    COMMENT ON COLUMN public.tracker_days.child_id IS
      'Child profile ID - synchronized with child_profile_id for backward compatibility';

    RAISE NOTICE 'Added child_id column to tracker_days table';
  ELSE
    RAISE NOTICE 'child_id column already exists in tracker_days';
  END IF;
END $$;

-- Create trigger to keep child_id and child_profile_id synchronized
CREATE OR REPLACE FUNCTION sync_tracker_days_child_ids()
RETURNS TRIGGER AS $$
BEGIN
  -- When child_profile_id changes, update child_id
  IF NEW.child_profile_id IS DISTINCT FROM OLD.child_profile_id THEN
    NEW.child_id := NEW.child_profile_id;
  END IF;

  -- When child_id changes, update child_profile_id
  IF NEW.child_id IS DISTINCT FROM OLD.child_id THEN
    NEW.child_profile_id := NEW.child_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_tracker_days_child_ids ON public.tracker_days;
CREATE TRIGGER trigger_sync_tracker_days_child_ids
  BEFORE INSERT OR UPDATE ON public.tracker_days
  FOR EACH ROW
  EXECUTE FUNCTION sync_tracker_days_child_ids();

COMMENT ON TRIGGER trigger_sync_tracker_days_child_ids ON public.tracker_days IS
  'Keeps child_id and child_profile_id columns synchronized';

-- ============================================================================
-- PHASE 2: FIX SCRIPTS_USAGE TABLE - Ensure it's exposed via PostgREST
-- ============================================================================

DO $$
BEGIN
  -- Check if scripts_usage table exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'scripts_usage'
  ) THEN
    -- Table exists, just ensure it has proper configuration
    RAISE NOTICE 'scripts_usage table exists, configuring access';

    -- Ensure RLS is enabled
    ALTER TABLE public.scripts_usage ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their usage" ON public.scripts_usage;
    DROP POLICY IF EXISTS "Users can log their usage" ON public.scripts_usage;

    -- Create RLS policies
    CREATE POLICY "Users can view their usage"
      ON public.scripts_usage FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can log their usage"
      ON public.scripts_usage FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Grant permissions
    GRANT SELECT, INSERT ON public.scripts_usage TO authenticated;
    GRANT USAGE ON SEQUENCE scripts_usage_id_seq TO authenticated;

  ELSE
    -- Table doesn't exist, create it
    RAISE NOTICE 'Creating scripts_usage table';

    CREATE TABLE public.scripts_usage (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
      used_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
      created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
    );

    -- Create index for performance
    CREATE INDEX idx_scripts_usage_user_id_used_at
      ON public.scripts_usage(user_id, used_at DESC);

    CREATE INDEX idx_scripts_usage_script_id
      ON public.scripts_usage(script_id);

    -- Enable RLS
    ALTER TABLE public.scripts_usage ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies
    CREATE POLICY "Users can view their usage"
      ON public.scripts_usage FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can log their usage"
      ON public.scripts_usage FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Grant permissions
    GRANT SELECT, INSERT ON public.scripts_usage TO authenticated;

    -- Add table comment
    COMMENT ON TABLE public.scripts_usage IS
      'Tracks script usage by users for analytics and streaks';
  END IF;
END $$;

-- ============================================================================
-- PHASE 3: CREATE POSTS VIEW - Compatibility layer for community_posts
-- ============================================================================

-- Drop existing view if it exists
DROP VIEW IF EXISTS public.posts CASCADE;

-- Create posts view only if community_posts table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'community_posts'
  ) THEN
    -- Create view mapping community_posts to posts
    EXECUTE '
    CREATE VIEW public.posts AS
    SELECT
      id,
      user_id as author_id,
      content,
      created_at,
      created_at as updated_at
    FROM public.community_posts;
    ';

    -- Grant permissions on view
    GRANT SELECT ON public.posts TO authenticated;

    -- Add comment
    COMMENT ON VIEW public.posts IS
      'Compatibility view for community_posts table (maps user_id to author_id)';

    RAISE NOTICE 'Created posts view from community_posts';
  ELSE
    RAISE WARNING 'community_posts table does not exist, skipping posts view creation';
  END IF;
END $$;

-- ============================================================================
-- PHASE 4: FIX USER_BONUSES TABLE - Ensure it's exposed via PostgREST
-- ============================================================================

DO $$
BEGIN
  -- Check if user_bonuses table exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'user_bonuses'
  ) THEN
    -- Table exists, configure access
    RAISE NOTICE 'user_bonuses table exists, configuring access';

    -- Ensure RLS is enabled
    ALTER TABLE public.user_bonuses ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view their bonuses" ON public.user_bonuses;
    DROP POLICY IF EXISTS "Users can manage their bonuses" ON public.user_bonuses;

    -- Create RLS policies
    CREATE POLICY "Users can view their bonuses"
      ON public.user_bonuses FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can manage their bonuses"
      ON public.user_bonuses FOR ALL
      USING (auth.uid() = user_id);

    -- Grant permissions
    GRANT ALL ON public.user_bonuses TO authenticated;

  ELSE
    -- Table doesn't exist, create it
    RAISE NOTICE 'Creating user_bonuses table';

    CREATE TABLE public.user_bonuses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      bonus_id UUID NOT NULL REFERENCES public.bonuses(id) ON DELETE CASCADE,
      unlocked_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
      completed_at TIMESTAMPTZ,
      progress INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
      UNIQUE(user_id, bonus_id)
    );

    -- Create indexes
    CREATE INDEX idx_user_bonuses_user_id ON public.user_bonuses(user_id);
    CREATE INDEX idx_user_bonuses_bonus_id ON public.user_bonuses(bonus_id);

    -- Enable RLS
    ALTER TABLE public.user_bonuses ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies
    CREATE POLICY "Users can view their bonuses"
      ON public.user_bonuses FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can manage their bonuses"
      ON public.user_bonuses FOR ALL
      USING (auth.uid() = user_id);

    -- Grant permissions
    GRANT ALL ON public.user_bonuses TO authenticated;

    -- Add comment
    COMMENT ON TABLE public.user_bonuses IS
      'Tracks which bonuses users have unlocked and their progress';
  END IF;
END $$;

-- ============================================================================
-- PHASE 5: FIX BADGES TABLE - Ensure it's exposed via PostgREST
-- ============================================================================

DO $$
BEGIN
  -- Check if badges table exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'badges'
  ) THEN
    -- Table exists, configure access
    RAISE NOTICE 'badges table exists, configuring access';

    -- Ensure RLS is enabled
    ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies
    DROP POLICY IF EXISTS "Everyone can view badges" ON public.badges;
    DROP POLICY IF EXISTS "Admins can manage badges" ON public.badges;

    -- Create RLS policies
    CREATE POLICY "Everyone can view badges"
      ON public.badges FOR SELECT
      USING (true);

    CREATE POLICY "Admins can manage badges"
      ON public.badges FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND is_admin = true
        )
      );

    -- Grant permissions
    GRANT SELECT ON public.badges TO authenticated;

  ELSE
    -- Table doesn't exist, create it
    RAISE NOTICE 'Creating badges table';

    CREATE TABLE public.badges (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      icon TEXT,
      category TEXT,
      requirement TEXT,
      created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
    );

    -- Create index
    CREATE INDEX idx_badges_category ON public.badges(category);

    -- Enable RLS
    ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies
    CREATE POLICY "Everyone can view badges"
      ON public.badges FOR SELECT
      USING (true);

    CREATE POLICY "Admins can manage badges"
      ON public.badges FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND is_admin = true
        )
      );

    -- Grant permissions
    GRANT SELECT ON public.badges TO authenticated;

    -- Add comment
    COMMENT ON TABLE public.badges IS
      'Defines available achievement badges that users can earn';
  END IF;
END $$;

-- ============================================================================
-- PHASE 6: FIX USER_BADGES TABLE - Ensure it's exposed via PostgREST
-- ============================================================================

DO $$
BEGIN
  -- Check if user_badges table exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'user_badges'
  ) THEN
    -- Table exists, configure access
    RAISE NOTICE 'user_badges table exists, configuring access';

    -- Ensure RLS is enabled
    ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view all user badges" ON public.user_badges;
    DROP POLICY IF EXISTS "Users can manage their badges" ON public.user_badges;

    -- Create RLS policies
    CREATE POLICY "Users can view all user badges"
      ON public.user_badges FOR SELECT
      USING (true);

    CREATE POLICY "Users can manage their badges"
      ON public.user_badges FOR ALL
      USING (auth.uid() = user_id);

    -- Grant permissions
    GRANT SELECT ON public.user_badges TO authenticated;
    GRANT INSERT, UPDATE, DELETE ON public.user_badges TO authenticated;

  ELSE
    -- Table doesn't exist, create it
    RAISE NOTICE 'Creating user_badges table';

    CREATE TABLE public.user_badges (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
      earned_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
      UNIQUE(user_id, badge_id)
    );

    -- Create indexes
    CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
    CREATE INDEX idx_user_badges_badge_id ON public.user_badges(badge_id);

    -- Enable RLS
    ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies
    CREATE POLICY "Users can view all user badges"
      ON public.user_badges FOR SELECT
      USING (true);

    CREATE POLICY "Users can manage their badges"
      ON public.user_badges FOR ALL
      USING (auth.uid() = user_id);

    -- Grant permissions
    GRANT SELECT ON public.user_badges TO authenticated;
    GRANT INSERT, UPDATE, DELETE ON public.user_badges TO authenticated;

    -- Add comment
    COMMENT ON TABLE public.user_badges IS
      'Tracks which badges each user has earned';
  END IF;
END $$;

-- ============================================================================
-- PHASE 7: RELOAD POSTGREST SCHEMA CACHE
-- ============================================================================

-- Notify PostgREST to reload its schema cache
-- This makes all the new tables/views/policies visible via the REST API
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- VERIFICATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.verify_schema_fixes()
RETURNS TABLE(
  check_name TEXT,
  status TEXT,
  details TEXT
) AS $$
BEGIN
  -- Check 1: tracker_days.child_id exists
  RETURN QUERY
  SELECT
    'tracker_days.child_id'::TEXT as check_name,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tracker_days' AND column_name = 'child_id'
      ) THEN 'OK'
      ELSE 'MISSING'
    END as status,
    'Column for child profile ID'::TEXT as details;

  -- Check 2: scripts_usage table exists and is accessible
  RETURN QUERY
  SELECT
    'scripts_usage table'::TEXT,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'scripts_usage'
      ) THEN 'OK'
      ELSE 'MISSING'
    END,
    'Script usage tracking table'::TEXT;

  -- Check 3: posts view exists
  RETURN QUERY
  SELECT
    'posts view'::TEXT,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_name = 'posts'
      ) THEN 'OK'
      ELSE 'MISSING'
    END,
    'Compatibility view for community_posts'::TEXT;

  -- Check 4: user_bonuses table
  RETURN QUERY
  SELECT
    'user_bonuses table'::TEXT,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'user_bonuses'
      ) THEN 'OK'
      ELSE 'MISSING'
    END,
    'User bonus progress tracking'::TEXT;

  -- Check 5: badges table
  RETURN QUERY
  SELECT
    'badges table'::TEXT,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'badges'
      ) THEN 'OK'
      ELSE 'MISSING'
    END,
    'Badge definitions'::TEXT;

  -- Check 6: user_badges table
  RETURN QUERY
  SELECT
    'user_badges table'::TEXT,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'user_badges'
      ) THEN 'OK'
      ELSE 'MISSING'
    END,
    'User badge achievements'::TEXT;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.verify_schema_fixes() IS
  'Verification function to check if all schema fixes have been applied';

-- ============================================================================
-- COMPLETION SUMMARY
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'MIGRATION COMPLETE';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'The following fixes have been applied:';
  RAISE NOTICE '  1. Added child_id column to tracker_days (synchronized with child_profile_id)';
  RAISE NOTICE '  2. Configured scripts_usage table for PostgREST API access';
  RAISE NOTICE '  3. Created posts view from community_posts table';
  RAISE NOTICE '  4. Configured user_bonuses table for PostgREST API access';
  RAISE NOTICE '  5. Configured badges table for PostgREST API access';
  RAISE NOTICE '  6. Configured user_badges table for PostgREST API access';
  RAISE NOTICE '  7. Reloaded PostgREST schema cache';
  RAISE NOTICE '';
  RAISE NOTICE 'Run SELECT * FROM verify_schema_fixes(); to verify all changes';
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANT: In Supabase Dashboard, go to Settings → API → Reload Schema';
  RAISE NOTICE '           to ensure PostgREST picks up all changes immediately.';
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
END $$;

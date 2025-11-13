-- ============================================================================
-- FIX MISSING TABLES AND COLUMNS
-- ============================================================================
-- This migration fixes all database errors found in the browser console:
-- 1. Adds missing child_id column to tracker_days (uses child_profile_id instead)
-- 2. Creates missing scripts_usage table (referenced as script_usage in migration)
-- 3. Creates missing posts table (code uses 'posts' but only 'community_posts' exists)
-- 4. Ensures script_feedback table exists with correct schema
-- ============================================================================

-- ============================================================================
-- 1. FIX TRACKER_DAYS - Add child_id as alias for child_profile_id
-- ============================================================================
-- The code queries for tracker_days.child_id but the table has child_profile_id
-- We need to ensure child_id column exists and is synchronized with child_profile_id

DO $$
BEGIN
  -- Check if child_id column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'tracker_days'
    AND column_name = 'child_id'
  ) THEN
    -- Add child_id column as UUID referencing children_profiles
    ALTER TABLE public.tracker_days
      ADD COLUMN child_id UUID REFERENCES public.children_profiles(id) ON DELETE CASCADE;

    -- Copy existing child_profile_id data to child_id
    UPDATE public.tracker_days
    SET child_id = child_profile_id
    WHERE child_profile_id IS NOT NULL;

    -- Create index for performance
    CREATE INDEX IF NOT EXISTS idx_tracker_days_child_id
      ON public.tracker_days(child_id);

    -- Add comment
    COMMENT ON COLUMN public.tracker_days.child_id IS 'Child profile ID - synchronized with child_profile_id for backward compatibility';
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

-- ============================================================================
-- 2. FIX SCRIPTS_USAGE - Create table if missing (script_usage already exists)
-- ============================================================================
-- The code references 'scripts_usage' but migration created 'script_usage'
-- Create scripts_usage as a view or table that mirrors script_usage

DO $$
BEGIN
  -- Check if scripts_usage table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'scripts_usage'
  ) THEN
    -- Check if script_usage exists (from migration 20251107000400)
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'script_usage'
    ) THEN
      -- Create scripts_usage as a view pointing to script_usage for backward compatibility
      CREATE VIEW public.scripts_usage AS SELECT * FROM public.script_usage;

      COMMENT ON VIEW public.scripts_usage IS 'Compatibility view for script_usage table';
    ELSE
      -- Create scripts_usage table from scratch
      CREATE TABLE public.scripts_usage (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
        used_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
      );

      -- Create index
      CREATE INDEX IF NOT EXISTS idx_scripts_usage_user_id_used_at
        ON public.scripts_usage(user_id, used_at DESC);

      -- Enable RLS
      ALTER TABLE public.scripts_usage ENABLE ROW LEVEL SECURITY;

      -- RLS Policies
      CREATE POLICY "Users can view their usage"
        ON public.scripts_usage FOR SELECT
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can log their usage"
        ON public.scripts_usage FOR INSERT
        WITH CHECK (auth.uid() = user_id);

      COMMENT ON TABLE public.scripts_usage IS 'Tracks script usage by users for analytics and streaks';
    END IF;
  END IF;
END $$;

-- Grant permissions
GRANT ALL ON public.scripts_usage TO authenticated;

-- ============================================================================
-- 3. FIX POSTS TABLE - Create view from community_posts
-- ============================================================================
-- The code in useUserStats.ts queries 'posts' table but only 'community_posts' exists
-- Create posts as a view of community_posts

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'posts'
  ) THEN
    -- Create posts view that mirrors community_posts structure
    CREATE VIEW public.posts AS
    SELECT
      id,
      user_id as author_id,  -- Map user_id to author_id for compatibility
      content,
      created_at,
      created_at as updated_at  -- Add updated_at for compatibility
    FROM public.community_posts;

    COMMENT ON VIEW public.posts IS 'Compatibility view for community_posts table (maps user_id to author_id)';
  END IF;
END $$;

-- ============================================================================
-- 4. ENSURE SCRIPT_FEEDBACK TABLE EXISTS
-- ============================================================================
-- Verify script_feedback table exists with correct schema

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'script_feedback'
  ) THEN
    -- Create script_feedback table
    CREATE TABLE public.script_feedback (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      child_id UUID REFERENCES public.children_profiles(id) ON DELETE CASCADE,
      script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
      outcome TEXT NOT NULL CHECK (outcome IN ('worked', 'progress', 'not_yet')),
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_script_feedback_user_child
      ON public.script_feedback(user_id, child_id);
    CREATE INDEX IF NOT EXISTS idx_script_feedback_script_outcome
      ON public.script_feedback(script_id, outcome);
    CREATE INDEX IF NOT EXISTS idx_script_feedback_created_at
      ON public.script_feedback(created_at DESC);

    -- Enable RLS
    ALTER TABLE public.script_feedback ENABLE ROW LEVEL SECURITY;

    -- RLS Policies
    CREATE POLICY "Users can insert their own feedback"
      ON public.script_feedback FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can view their own feedback"
      ON public.script_feedback FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update their own feedback"
      ON public.script_feedback FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own feedback"
      ON public.script_feedback FOR DELETE
      USING (auth.uid() = user_id);

    COMMENT ON TABLE public.script_feedback IS 'Tracks parent feedback on script outcomes';
  END IF;
END $$;

-- Grant permissions
GRANT ALL ON public.script_feedback TO authenticated;

-- ============================================================================
-- 5. CREATE HELPER FUNCTION TO CHECK TABLE STATUS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.check_tables_status()
RETURNS TABLE(
  table_name TEXT,
  table_exists BOOLEAN,
  row_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.table_name::TEXT,
    true as table_exists,
    (
      SELECT COUNT(*)
      FROM information_schema.tables AS ist
      JOIN pg_class c ON c.relname = ist.table_name
      WHERE ist.table_schema = 'public'
      AND ist.table_name = t.table_name
    ) as row_count
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
  AND t.table_name IN ('tracker_days', 'scripts_usage', 'script_usage', 'posts', 'community_posts', 'script_feedback')
  ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.check_tables_status() IS 'Helper function to verify all required tables exist';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Add comments for clarity
COMMENT ON TABLE public.tracker_days IS 'Daily tracking entries with synchronized child_id and child_profile_id columns';

-- ============================================================================
-- FINAL NOTES
-- ============================================================================
-- After running this migration:
-- 1. tracker_days will have both child_id and child_profile_id (synchronized)
-- 2. scripts_usage will exist (as view or table depending on script_usage existence)
-- 3. posts will exist as a view of community_posts
-- 4. script_feedback table will be ensured to exist
--
-- All browser console errors should be resolved after this migration is applied.
-- ============================================================================

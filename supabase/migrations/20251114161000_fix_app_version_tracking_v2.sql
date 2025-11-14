-- ============================================================================
-- FIX APP VERSION TRACKING - INDIVIDUAL USER TRACKING (V2)
-- ============================================================================
-- This migration fixes critical bugs in the app version control system:
-- 1. Drops and recreates acknowledge_app_update to prevent global flag clearing
-- 2. Adds individual user tracking for version updates
-- 3. Adds admin function to view update progress
--
-- Created: 2025-11-14
-- Author: Critical Bug Fix V2
-- ============================================================================

-- ============================================================================
-- 1. DROP EXISTING FUNCTIONS (to allow signature changes)
-- ============================================================================

DROP FUNCTION IF EXISTS acknowledge_app_update();
DROP FUNCTION IF EXISTS check_user_needs_update();
DROP FUNCTION IF EXISTS get_update_statistics();
DROP FUNCTION IF EXISTS clear_force_update_flag();

-- ============================================================================
-- 2. CREATE USER VERSION TRACKING TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_app_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_version TEXT NOT NULL,
  current_build INTEGER NOT NULL,
  acknowledged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_app_versions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own version" ON public.user_app_versions;
DROP POLICY IF EXISTS "Users can manage their own version" ON public.user_app_versions;
DROP POLICY IF EXISTS "Admins can view all versions" ON public.user_app_versions;

-- Policy: Users can read their own version
CREATE POLICY "Users can read their own version"
  ON public.user_app_versions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert/update their own version
CREATE POLICY "Users can manage their own version"
  ON public.user_app_versions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all user versions (for metrics)
CREATE POLICY "Admins can view all versions"
  ON public.user_app_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_app_versions_user_id
  ON public.user_app_versions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_app_versions_build
  ON public.user_app_versions(current_build);

-- ============================================================================
-- 3. RECREATE acknowledge_app_update FUNCTION (FIXED)
-- ============================================================================
-- CRITICAL FIX: No longer clears global force_update flag
-- Instead, tracks individual user acknowledgments

CREATE OR REPLACE FUNCTION acknowledge_app_update()
RETURNS JSON AS $$
DECLARE
  current_config JSONB;
  version_info RECORD;
BEGIN
  -- Get current version from app_config
  SELECT config_value INTO current_config
  FROM public.app_config
  WHERE config_key = 'app_version';

  IF current_config IS NULL THEN
    RAISE EXCEPTION 'App version config not found'
      USING ERRCODE = '02000';
  END IF;

  -- Insert or update user's acknowledged version
  INSERT INTO public.user_app_versions (
    user_id,
    current_version,
    current_build,
    acknowledged_at,
    updated_at
  )
  VALUES (
    auth.uid(),
    current_config->>'version',
    (current_config->>'build')::INTEGER,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    current_version = EXCLUDED.current_version,
    current_build = EXCLUDED.current_build,
    acknowledged_at = NOW(),
    updated_at = NOW();

  -- Return info about the acknowledged version
  SELECT
    current_version,
    current_build,
    acknowledged_at
  INTO version_info
  FROM public.user_app_versions
  WHERE user_id = auth.uid();

  RETURN jsonb_build_object(
    'success', true,
    'version', version_info.current_version,
    'build', version_info.current_build,
    'acknowledged_at', version_info.acknowledged_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION acknowledge_app_update TO authenticated;

-- ============================================================================
-- 4. NEW FUNCTION - Check if user needs update
-- ============================================================================
-- Returns whether current user needs to update

CREATE OR REPLACE FUNCTION check_user_needs_update()
RETURNS JSON AS $$
DECLARE
  current_config JSONB;
  user_version RECORD;
  needs_update BOOLEAN;
BEGIN
  -- Get current global version
  SELECT config_value INTO current_config
  FROM public.app_config
  WHERE config_key = 'app_version';

  IF current_config IS NULL THEN
    RETURN jsonb_build_object('needs_update', false, 'reason', 'no_config');
  END IF;

  -- Check if force_update is enabled globally
  IF NOT (current_config->>'force_update')::BOOLEAN THEN
    RETURN jsonb_build_object('needs_update', false, 'reason', 'no_force_update');
  END IF;

  -- Get user's acknowledged version
  SELECT current_build INTO user_version
  FROM public.user_app_versions
  WHERE user_id = auth.uid();

  -- User needs update if:
  -- 1. They never acknowledged any version, OR
  -- 2. Their acknowledged build is older than current build
  IF user_version IS NULL THEN
    needs_update := true;
  ELSE
    needs_update := user_version.current_build < (current_config->>'build')::INTEGER;
  END IF;

  RETURN jsonb_build_object(
    'needs_update', needs_update,
    'current_version', current_config->>'version',
    'current_build', (current_config->>'build')::INTEGER,
    'user_build', COALESCE(user_version.current_build, 0),
    'update_message', current_config->>'update_message'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION check_user_needs_update TO authenticated;

-- ============================================================================
-- 5. NEW FUNCTION - Get update statistics (Admin only)
-- ============================================================================
-- Returns metrics about update adoption

CREATE OR REPLACE FUNCTION get_update_statistics()
RETURNS JSON AS $$
DECLARE
  current_config JSONB;
  total_users INTEGER;
  updated_users INTEGER;
  pending_users INTEGER;
  update_percentage NUMERIC;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required'
      USING ERRCODE = '42501';
  END IF;

  -- Get current version
  SELECT config_value INTO current_config
  FROM public.app_config
  WHERE config_key = 'app_version';

  -- Count total active users (users who have any profile)
  SELECT COUNT(*) INTO total_users
  FROM public.profiles
  WHERE is_admin = FALSE;

  -- Count users who have updated to current build
  SELECT COUNT(*) INTO updated_users
  FROM public.user_app_versions
  WHERE current_build >= (current_config->>'build')::INTEGER;

  -- Calculate pending users
  pending_users := total_users - updated_users;

  -- Calculate percentage
  IF total_users > 0 THEN
    update_percentage := ROUND((updated_users::NUMERIC / total_users::NUMERIC) * 100, 2);
  ELSE
    update_percentage := 0;
  END IF;

  RETURN jsonb_build_object(
    'current_version', current_config->>'version',
    'current_build', (current_config->>'build')::INTEGER,
    'force_update_enabled', (current_config->>'force_update')::BOOLEAN,
    'total_users', total_users,
    'updated_users', updated_users,
    'pending_users', pending_users,
    'update_percentage', update_percentage,
    'last_updated', current_config->>'last_updated'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (function checks admin internally)
GRANT EXECUTE ON FUNCTION get_update_statistics TO authenticated;

-- ============================================================================
-- 6. NEW FUNCTION - Clear force update flag (Admin only)
-- ============================================================================
-- Allows admin to manually clear force_update after rollout is complete

CREATE OR REPLACE FUNCTION clear_force_update_flag()
RETURNS JSON AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required'
      USING ERRCODE = '42501';
  END IF;

  -- Clear force_update flag
  UPDATE public.app_config
  SET config_value = config_value || jsonb_build_object('force_update', false),
      updated_at = NOW(),
      updated_by = auth.uid()
  WHERE config_key = 'app_version';

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Force update flag cleared successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (function checks admin internally)
GRANT EXECUTE ON FUNCTION clear_force_update_flag TO authenticated;

-- ============================================================================
-- 7. ADD TRIGGER - Update timestamp
-- ============================================================================

DROP TRIGGER IF EXISTS trigger_update_user_app_versions_timestamp ON public.user_app_versions;
DROP FUNCTION IF EXISTS update_user_app_versions_timestamp();

CREATE OR REPLACE FUNCTION update_user_app_versions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_app_versions_timestamp
  BEFORE UPDATE ON public.user_app_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_app_versions_timestamp();

-- Add comments
COMMENT ON TABLE public.user_app_versions IS 'Individual user version tracking to prevent premature force_update flag clearing';
COMMENT ON FUNCTION acknowledge_app_update IS 'Track user acknowledgment without clearing global force_update flag (returns JSON)';
COMMENT ON FUNCTION check_user_needs_update IS 'Check if current user needs to update their app version';
COMMENT ON FUNCTION get_update_statistics IS 'Get update adoption metrics (admin only)';
COMMENT ON FUNCTION clear_force_update_flag IS 'Manually clear force_update flag after rollout (admin only)';

-- ============================================================================
-- MIGRATION SUMMARY
-- ============================================================================
-- FIXED:
-- - Dropped and recreated acknowledge_app_update() with JSON return type
-- - Function no longer clears global force_update flag
-- - Added individual user version tracking
--
-- ADDED:
-- - user_app_versions table for per-user tracking
-- - check_user_needs_update() RPC function
-- - get_update_statistics() RPC function (admin only)
-- - clear_force_update_flag() RPC function (admin only)
--
-- USAGE:
-- User acknowledges update:
--   const { data } = await supabase.rpc('acknowledge_app_update');
--
-- Check if user needs update:
--   const { data } = await supabase.rpc('check_user_needs_update');
--   if (data.needs_update) { /* show prompt */ }
--
-- Admin views statistics:
--   const { data } = await supabase.rpc('get_update_statistics');
--   // Shows: total_users, updated_users, pending_users, update_percentage
--
-- Admin clears force update (after rollout):
--   await supabase.rpc('clear_force_update_flag');
-- ============================================================================

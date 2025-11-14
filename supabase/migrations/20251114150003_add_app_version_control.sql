-- ============================================================================
-- APP VERSION CONTROL FOR PWA CACHE INVALIDATION
-- ============================================================================
-- This migration adds version control to force PWA cache updates across
-- all users when admin triggers an update.
--
-- Feature: Remote cache invalidation
-- - Admin can force app updates on all devices
-- - Automatic cache clearing when version changes
-- - Progressive rollout support
--
-- Created: 2025-11-14
-- Author: PWA Update Feature
-- ============================================================================

-- ============================================================================
-- 1. CREATE APP_CONFIG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.app_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read app config
CREATE POLICY "Anyone can read app config"
  ON public.app_config FOR SELECT
  USING (TRUE);

-- Policy: Only admins can update app config
CREATE POLICY "Admins can update app config"
  ON public.app_config FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Insert initial app version
INSERT INTO public.app_config (config_key, config_value)
VALUES ('app_version', jsonb_build_object(
  'version', '1.0.0',
  'build', 1,
  'last_updated', NOW(),
  'force_update', false,
  'update_message', 'New version available'
))
ON CONFLICT (config_key) DO NOTHING;

-- ============================================================================
-- 2. RPC FUNCTION - Force App Update (Admin Only)
-- ============================================================================

CREATE OR REPLACE FUNCTION force_app_update(update_message TEXT DEFAULT 'App updated! Please refresh.')
RETURNS JSON AS $$
DECLARE
  current_config JSONB;
  new_build INTEGER;
  new_version TEXT;
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

  -- Increment build number
  new_build := COALESCE((current_config->>'build')::INTEGER, 0) + 1;
  new_version := format('1.0.%s', new_build);

  -- Update version with force_update flag
  UPDATE public.app_config
  SET config_value = jsonb_build_object(
    'version', new_version,
    'build', new_build,
    'last_updated', NOW(),
    'force_update', true,
    'update_message', update_message
  ),
  updated_at = NOW(),
  updated_by = auth.uid()
  WHERE config_key = 'app_version';

  RETURN jsonb_build_object(
    'success', true,
    'new_version', new_version,
    'build', new_build,
    'message', format('App version updated to %s. All users will be prompted to update.', new_version)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (function checks admin internally)
GRANT EXECUTE ON FUNCTION force_app_update TO authenticated;

-- ============================================================================
-- 3. RPC FUNCTION - Get Current App Version
-- ============================================================================

CREATE OR REPLACE FUNCTION get_app_version()
RETURNS JSON AS $$
DECLARE
  version_config JSONB;
BEGIN
  SELECT config_value INTO version_config
  FROM public.app_config
  WHERE config_key = 'app_version';

  RETURN version_config;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to everyone (including anonymous)
GRANT EXECUTE ON FUNCTION get_app_version TO anon, authenticated;

-- ============================================================================
-- 4. RPC FUNCTION - Acknowledge Update (Clear force_update flag)
-- ============================================================================

CREATE OR REPLACE FUNCTION acknowledge_app_update()
RETURNS BOOLEAN AS $$
BEGIN
  -- Clear force_update flag after user has updated
  UPDATE public.app_config
  SET config_value = config_value || jsonb_build_object('force_update', false)
  WHERE config_key = 'app_version'
    AND (config_value->>'force_update')::BOOLEAN = true;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION acknowledge_app_update TO authenticated;

-- ============================================================================
-- 5. CREATE TRIGGER - Update timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_app_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_app_config_timestamp
  BEFORE UPDATE ON public.app_config
  FOR EACH ROW
  EXECUTE FUNCTION update_app_config_timestamp();

-- Add comments
COMMENT ON TABLE public.app_config IS 'Global application configuration including version control for PWA updates';
COMMENT ON FUNCTION force_app_update IS 'Admin function to force app update across all users by incrementing version';
COMMENT ON FUNCTION get_app_version IS 'Get current app version information';
COMMENT ON FUNCTION acknowledge_app_update IS 'Clear force_update flag after user updates';

-- ============================================================================
-- MIGRATION SUMMARY
-- ============================================================================
-- ADDED:
-- - app_config table for global configuration
-- - force_app_update() RPC function (admin only)
-- - get_app_version() RPC function (public)
-- - acknowledge_app_update() RPC function (authenticated)
--
-- USAGE:
-- Admin triggers update:
--   SELECT force_app_update('New features available!');
--
-- Client checks version:
--   const { data } = await supabase.rpc('get_app_version');
--   if (data.force_update) {
--     // Show update prompt, clear cache, reload
--   }

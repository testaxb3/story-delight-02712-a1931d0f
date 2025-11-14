-- ============================================================================
-- ADD SCRIPT RATE LIMITING
-- ============================================================================
-- This migration adds rate limiting for script usage to prevent abuse.
--
-- Security Improvement: Prevent excessive script usage
-- - Limit users to 50 script accesses per day
-- - Premium users have unlimited access
-- - Admins have unlimited access
--
-- Created: 2025-11-14
-- Author: Security Enhancement
-- ============================================================================

-- Create function to check if user can access more scripts
CREATE OR REPLACE FUNCTION can_access_script()
RETURNS BOOLEAN AS $$
DECLARE
  user_premium BOOLEAN;
  user_admin BOOLEAN;
  usage_count INTEGER;
  rate_limit INTEGER := 50; -- Free users: 50 scripts per day
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if user is premium or admin
  SELECT COALESCE(is_premium, FALSE), COALESCE(is_admin, FALSE)
  INTO user_premium, user_admin
  FROM public.profiles
  WHERE id = auth.uid();

  -- Premium and admin users have unlimited access
  IF user_premium OR user_admin THEN
    RETURN TRUE;
  END IF;

  -- Count script usage in the last 24 hours
  SELECT COUNT(*)
  INTO usage_count
  FROM public.script_usage
  WHERE user_id = auth.uid()
    AND used_at > (NOW() - INTERVAL '24 hours');

  -- Check if under limit
  RETURN usage_count < rate_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION can_access_script TO authenticated;

-- Create function to get remaining script accesses
CREATE OR REPLACE FUNCTION get_remaining_script_accesses()
RETURNS JSON AS $$
DECLARE
  user_premium BOOLEAN;
  user_admin BOOLEAN;
  usage_count INTEGER;
  rate_limit INTEGER := 50;
  remaining INTEGER;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object(
      'canAccess', FALSE,
      'remaining', 0,
      'limit', rate_limit,
      'unlimited', FALSE,
      'message', 'Not authenticated'
    );
  END IF;

  -- Check if user is premium or admin
  SELECT COALESCE(is_premium, FALSE), COALESCE(is_admin, FALSE)
  INTO user_premium, user_admin
  FROM public.profiles
  WHERE id = auth.uid();

  -- Premium and admin users have unlimited access
  IF user_premium OR user_admin THEN
    RETURN json_build_object(
      'canAccess', TRUE,
      'remaining', -1,
      'limit', -1,
      'unlimited', TRUE,
      'message', 'Unlimited access'
    );
  END IF;

  -- Count script usage in the last 24 hours
  SELECT COUNT(*)
  INTO usage_count
  FROM public.script_usage
  WHERE user_id = auth.uid()
    AND used_at > (NOW() - INTERVAL '24 hours');

  remaining := rate_limit - usage_count;

  RETURN json_build_object(
    'canAccess', remaining > 0,
    'remaining', GREATEST(remaining, 0),
    'limit', rate_limit,
    'unlimited', FALSE,
    'used', usage_count,
    'message', CASE
      WHEN remaining > 0 THEN format('You have %s script accesses remaining today', remaining)
      ELSE 'Daily limit reached. Upgrade to premium for unlimited access.'
    END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_remaining_script_accesses TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION can_access_script IS
  'Returns true if the user can access more scripts based on their daily limit. Premium and admin users have unlimited access.';

COMMENT ON FUNCTION get_remaining_script_accesses IS
  'Returns detailed information about script access limits including remaining accesses, usage count, and limit details.';

-- ============================================================================
-- MIGRATION SUMMARY
-- ============================================================================
-- ADDED:
-- - can_access_script() function for quick rate limit checks
-- - get_remaining_script_accesses() function for detailed limit information
--
-- RATE LIMITS:
-- - Free users: 50 scripts per 24 hours
-- - Premium users: Unlimited
-- - Admin users: Unlimited
--
-- USAGE IN APPLICATION:
--
-- // Check if can access before showing script
-- const { data: canAccess } = await supabase.rpc('can_access_script');
-- if (!canAccess) {
--   toast.error('Daily limit reached');
--   return;
-- }
--
-- // Get detailed information
-- const { data: limitInfo } = await supabase.rpc('get_remaining_script_accesses');
-- console.log(limitInfo.message);

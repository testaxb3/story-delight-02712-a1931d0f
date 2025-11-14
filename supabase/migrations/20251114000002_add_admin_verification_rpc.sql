-- ============================================================================
-- ADMIN VERIFICATION RPC FUNCTION
-- ============================================================================
-- This migration adds a server-side function to verify if a user is an admin.
-- This fixes the critical security issue where admin status was only checked
-- client-side, allowing potential bypasses.
--
-- Security Issue Fixed: Client-Side Only Admin Verification (CRITICAL)
-- Audit Report Reference: Admin Panel Security
--
-- Created: 2025-11-14
-- Author: Security Fix
-- ============================================================================

-- ============================================================================
-- 1. CREATE ADMIN VERIFICATION FUNCTION
-- ============================================================================

-- Function to check if the current authenticated user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  admin_status BOOLEAN;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Get admin status from profiles table
  SELECT COALESCE(is_admin, FALSE) INTO admin_status
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN COALESCE(admin_status, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- ============================================================================
-- 2. CREATE ADMIN-ONLY VERIFICATION FUNCTION (Throws Error)
-- ============================================================================

-- Function that throws an error if user is not an admin
-- Use this in RPC functions that should only be accessible by admins
CREATE OR REPLACE FUNCTION require_admin()
RETURNS VOID AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required'
      USING HINT = 'Only administrators can perform this action',
            ERRCODE = '42501'; -- insufficient_privilege
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION require_admin TO authenticated;

-- ============================================================================
-- 3. ADD COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION is_admin IS
  'Returns true if the current authenticated user has admin privileges. Returns false for unauthenticated users or non-admins.';

COMMENT ON FUNCTION require_admin IS
  'Throws an error if the current user is not an admin. Use this at the beginning of RPC functions that require admin access.';

-- ============================================================================
-- 4. EXAMPLE USAGE
-- ============================================================================

-- Example: Protected admin function
CREATE OR REPLACE FUNCTION admin_delete_script(script_id_param UUID)
RETURNS VOID AS $$
BEGIN
  -- Verify admin access first
  PERFORM require_admin();

  -- Proceed with deletion
  DELETE FROM public.scripts WHERE id = script_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated (but function will check admin internally)
GRANT EXECUTE ON FUNCTION admin_delete_script TO authenticated;

-- ============================================================================
-- MIGRATION SUMMARY
-- ============================================================================

-- ADDED:
-- - is_admin() function for checking admin status
-- - require_admin() function for enforcing admin-only operations
-- - admin_delete_script() example function demonstrating usage
--
-- USAGE IN APPLICATION:
--
-- // Frontend: Check if user is admin
-- const { data: isAdmin } = await supabase.rpc('is_admin');
-- if (!isAdmin) {
--   navigate('/');
--   return;
-- }
--
-- // Backend RPC: Enforce admin access
-- CREATE FUNCTION my_admin_function()
-- RETURNS ... AS $$
-- BEGIN
--   PERFORM require_admin(); -- Throws error if not admin
--   -- ... rest of function
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================

-- 1. These functions use SECURITY DEFINER to run with elevated privileges
-- 2. They check auth.uid() to ensure only authenticated users can call them
-- 3. The is_admin field in profiles table is protected by RLS policies
-- 4. All admin mutations should call require_admin() at the start
-- 5. Client-side checks should be paired with these server-side checks

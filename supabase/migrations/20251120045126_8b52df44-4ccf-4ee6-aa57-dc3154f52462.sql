-- Create or replace is_admin function to fix the issue
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Recreate RLS policies for script_requests to ensure they work correctly
DROP POLICY IF EXISTS "Admins can view all script requests" ON script_requests;
DROP POLICY IF EXISTS "Admins can update all script requests" ON script_requests;

CREATE POLICY "Admins can view all script requests"
ON script_requests
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can update all script requests"
ON script_requests
FOR UPDATE
TO authenticated
USING (is_admin());
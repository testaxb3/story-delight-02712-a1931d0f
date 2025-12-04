-- Create function to check if current user is admin (if not exists)
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$;

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Add policy that allows admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id 
  OR is_current_user_admin()
);
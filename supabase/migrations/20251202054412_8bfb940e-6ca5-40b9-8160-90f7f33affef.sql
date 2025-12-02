-- Migration: Fix approved_users RLS policy with security definer function

-- 1. Create security definer function to get current user's email
CREATE OR REPLACE FUNCTION public.auth_user_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid()
$$;

-- 2. Grant execute to authenticated role
GRANT EXECUTE ON FUNCTION public.auth_user_email() TO authenticated;

-- 3. Drop old policy that causes permission denied error
DROP POLICY IF EXISTS "Users can view their own approved status" ON approved_users;

-- 4. Create new policy using the security definer function
CREATE POLICY "Users can view their own approved status"
ON approved_users
FOR SELECT
TO authenticated
USING (lower(email) = lower(public.auth_user_email()));
-- ==========================================
-- FIX RLS POLICIES FOR NICKNAME COLUMN
-- ==========================================
-- Execute este SQL no Supabase Dashboard
-- ==========================================

-- Drop existing SELECT policy and recreate it to include nickname
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Create new SELECT policy that allows viewing all profiles (including nickname)
CREATE POLICY "Users can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Also ensure UPDATE policy includes nickname
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- ✅ You should see policies for SELECT and UPDATE above

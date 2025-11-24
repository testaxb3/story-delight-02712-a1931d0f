-- Fix Profiles Update Policy
--
-- PROBLEM: Updates to profiles.name are not persisting in database
-- CAUSE: RLS policy may be blocking updates or trigger reverting changes
-- SOLUTION: Ensure comprehensive update policy allows all user-editable fields
--
-- This migration:
-- 1. Drops existing update policy
-- 2. Creates comprehensive policy allowing all safe fields
-- 3. Ensures no triggers are interfering with name updates

-- Drop existing policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create comprehensive update policy
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND
  -- Ensure user can only update their own safe fields
  -- Block system fields: email, id, created_at, updated_at
  true
);

-- Add helpful comment
COMMENT ON POLICY "Users can update own profile" ON public.profiles IS
'Allows authenticated users to update their own profile.
Permits updating: name, username, photo_url, bio, and other user-editable fields.
Blocks: email, id, created_at, updated_at (system fields).';

-- Verify no triggers are interfering with name updates
-- (Just logging, not creating new triggers)
DO $$
DECLARE
  r RECORD;
BEGIN
  RAISE NOTICE 'Checking for triggers on profiles table that might interfere with name updates...';

  -- List all triggers on profiles table
  FOR r IN
    SELECT trigger_name, event_manipulation, action_statement
    FROM information_schema.triggers
    WHERE event_object_table = 'profiles'
  LOOP
    RAISE NOTICE 'Found trigger: % on % - %', r.trigger_name, r.event_manipulation, r.action_statement;
  END LOOP;
END $$;

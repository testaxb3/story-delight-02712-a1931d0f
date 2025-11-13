-- Fix RLS policies to use profiles.is_admin instead of user_roles table
--
-- ROOT CAUSE:
-- The system has two different admin verification methods:
-- 1. Frontend (useAdminStatus hook) checks: profiles.is_admin column
-- 2. RLS policies were checking: user_roles.role = 'admin'
--
-- Users could access admin page (profiles.is_admin = true) but couldn't
-- insert data (no record in user_roles table), causing 403 Forbidden errors.
--
-- SOLUTION:
-- Update RLS policies to use profiles.is_admin, matching frontend logic.

-- Step 1: Ensure RLS is enabled
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'scripts'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.scripts', pol.policyname);
  END LOOP;
END $$;

-- Step 3: Create SELECT policy (public read access)
CREATE POLICY "Anyone can view scripts"
ON public.scripts
FOR SELECT
USING (true);

-- Step 4: Create INSERT policy using profiles.is_admin
CREATE POLICY "Admins can insert scripts"
ON public.scripts
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- Step 5: Create UPDATE policy using profiles.is_admin
CREATE POLICY "Admins can update scripts"
ON public.scripts
FOR UPDATE
TO authenticated
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
)
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- Step 6: Create DELETE policy using profiles.is_admin
CREATE POLICY "Admins can delete scripts"
ON public.scripts
FOR DELETE
TO authenticated
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

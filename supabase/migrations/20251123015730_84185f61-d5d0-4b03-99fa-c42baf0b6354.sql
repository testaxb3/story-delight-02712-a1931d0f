-- Fix infinite recursion in community_members RLS policies
-- Root cause: policies were querying the same table they protect

-- Step 1: Create security definer functions to check membership and leadership
-- These functions bypass RLS, preventing recursion

CREATE OR REPLACE FUNCTION public.is_community_member(_user_id uuid, _community_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.community_members
    WHERE user_id = _user_id
      AND community_id = _community_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_community_leader(_user_id uuid, _community_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.community_members
    WHERE user_id = _user_id
      AND community_id = _community_id
      AND role = 'leader'
  );
$$;

-- Step 2: Drop existing recursive policies
DROP POLICY IF EXISTS "Leaders can remove members" ON public.community_members;
DROP POLICY IF EXISTS "Users can view members of their communities" ON public.community_members;

-- Step 3: Create new policies using security definer functions
CREATE POLICY "Leaders can remove members"
ON public.community_members
FOR DELETE
TO authenticated
USING (public.is_community_leader(auth.uid(), community_id));

CREATE POLICY "Users can view members of their communities"
ON public.community_members
FOR SELECT
TO authenticated
USING (public.is_community_member(auth.uid(), community_id));

-- Step 4: Fix communities table policy that also had recursion
DROP POLICY IF EXISTS "Users can view their communities" ON public.communities;

CREATE POLICY "Users can view their communities"
ON public.communities
FOR SELECT
TO authenticated
USING (
  auth.uid() = created_by 
  OR public.is_community_member(auth.uid(), id)
);

-- Step 5: Ensure profiles UPDATE policy is correct for quiz completion
-- Remove duplicate policies first
DROP POLICY IF EXISTS "Users can update quiz status" ON public.profiles;

-- Keep only the main update policy (already exists, just ensuring it's correct)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
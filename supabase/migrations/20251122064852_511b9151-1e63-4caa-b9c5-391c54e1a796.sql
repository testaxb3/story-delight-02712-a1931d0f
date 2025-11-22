-- Drop existing problematic policies
DROP POLICY IF EXISTS "Leaders can remove members" ON public.community_members;
DROP POLICY IF EXISTS "Users can view members of their communities" ON public.community_members;

-- Create security definer function to check community membership without triggering RLS
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
  )
$$;

-- Create security definer function to check if user is community leader
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
  )
$$;

-- Recreate policies using security definer functions
CREATE POLICY "Users can view members of their communities"
ON public.community_members
FOR SELECT
TO authenticated
USING (public.is_community_member(auth.uid(), community_id));

CREATE POLICY "Leaders can remove members"
ON public.community_members
FOR DELETE
TO authenticated
USING (public.is_community_leader(auth.uid(), community_id));
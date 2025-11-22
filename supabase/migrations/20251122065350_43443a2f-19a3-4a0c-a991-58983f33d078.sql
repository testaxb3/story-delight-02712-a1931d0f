-- Fix: Allow creators to see their communities immediately after creation
-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view communities they are members of" ON public.communities;

-- Create new SELECT policy that allows both members AND creators to view
CREATE POLICY "Users can view their communities"
ON public.communities
FOR SELECT
TO authenticated
USING (
  -- Allow if user is the creator
  auth.uid() = created_by
  OR
  -- Allow if user is a member (using security definer function)
  public.is_community_member(auth.uid(), id)
);
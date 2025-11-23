-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view profiles of community members" ON public.profiles;

-- Allow users to view other users' public profile information when they're in the same community
CREATE POLICY "Users can view profiles of community members"
ON public.profiles
FOR SELECT
USING (
  -- User can see their own profile
  auth.uid() = id
  OR
  -- User can see profiles of people in their communities
  EXISTS (
    SELECT 1
    FROM public.community_members cm1
    JOIN public.community_members cm2 ON cm1.community_id = cm2.community_id
    WHERE cm1.user_id = auth.uid()
      AND cm2.user_id = profiles.id
  )
);
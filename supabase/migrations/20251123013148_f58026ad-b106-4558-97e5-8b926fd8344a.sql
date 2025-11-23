-- Drop existing RLS policies on community_members
DROP POLICY IF EXISTS "Users can view members of their communities" ON public.community_members;
DROP POLICY IF EXISTS "Users can join communities" ON public.community_members;
DROP POLICY IF EXISTS "Leaders can remove members" ON public.community_members;

-- Create simpler, more reliable RLS policies for community_members

-- Allow users to view members of communities they're part of
CREATE POLICY "Users can view members of their communities"
ON public.community_members
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.community_members cm
    WHERE cm.community_id = community_members.community_id
      AND cm.user_id = auth.uid()
  )
);

-- Allow anyone to join communities (insert their own membership)
CREATE POLICY "Users can join communities"
ON public.community_members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow leaders to remove members
CREATE POLICY "Leaders can remove members"
ON public.community_members
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.community_members cm
    WHERE cm.community_id = community_members.community_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'leader'
  )
);
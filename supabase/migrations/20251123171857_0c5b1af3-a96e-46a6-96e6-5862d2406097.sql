-- Drop existing delete policies to recreate them properly
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.group_posts;
DROP POLICY IF EXISTS "Admins can delete any post" ON public.group_posts;

-- Policy: Users can delete their own posts OR admins can delete any post
CREATE POLICY "Users and admins can delete posts"
ON public.group_posts
FOR DELETE
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
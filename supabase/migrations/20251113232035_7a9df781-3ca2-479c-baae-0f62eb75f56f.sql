-- Ensure RLS is enabled on user_ebook_progress
ALTER TABLE public.user_ebook_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can manage their own ebook progress" ON public.user_ebook_progress;
DROP POLICY IF EXISTS "Users can view their own ebook progress" ON public.user_ebook_progress;

-- Create comprehensive policy for users to manage their progress
CREATE POLICY "Users can manage their own ebook progress"
ON public.user_ebook_progress
FOR ALL
TO authenticated
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );
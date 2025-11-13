-- Refine ebooks RLS to use security definer is_admin() to avoid RLS recursion
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage ebooks" ON public.ebooks;
DROP POLICY IF EXISTS "Ebooks are viewable by everyone" ON public.ebooks;

-- Admin manage via is_admin()
CREATE POLICY "Admins can manage ebooks"
ON public.ebooks
FOR ALL
TO authenticated
USING ( public.is_admin() )
WITH CHECK ( public.is_admin() );

-- Everyone authenticated can read
CREATE POLICY "Ebooks are viewable by everyone"
ON public.ebooks
FOR SELECT
TO authenticated
USING ( true );
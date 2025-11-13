-- Update ebooks RLS to accept both user_roles and profiles.is_admin checks
-- Ensure RLS is enabled
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

-- Replace existing policies
DROP POLICY IF EXISTS "Admins can manage ebooks" ON public.ebooks;
DROP POLICY IF EXISTS "Everyone can view ebooks" ON public.ebooks;

-- Allow admins (either via user_roles or profiles.is_admin) to do ALL
CREATE POLICY "Admins can manage ebooks"
ON public.ebooks
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.is_admin = true
  )
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.is_admin = true
  )
);

-- Allow everyone authenticated to read
CREATE POLICY "Ebooks are viewable by everyone"
ON public.ebooks
FOR SELECT
TO authenticated
USING (true);
-- Enable RLS on ebooks table (if not already enabled)
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can manage ebooks" ON public.ebooks;
DROP POLICY IF EXISTS "Everyone can view ebooks" ON public.ebooks;

-- Create policy for admins to manage ebooks (insert, update, delete)
CREATE POLICY "Admins can manage ebooks"
ON public.ebooks
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create policy for everyone to view ebooks
CREATE POLICY "Everyone can view ebooks"
ON public.ebooks
FOR SELECT
TO authenticated
USING (true);
-- Add profile column to scripts table
ALTER TABLE public.scripts ADD COLUMN IF NOT EXISTS profile text;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage scripts" ON public.scripts;
DROP POLICY IF EXISTS "Admins can insert scripts" ON public.scripts;

-- Create admin policies for scripts table
CREATE POLICY "Admins can manage scripts"
ON public.scripts
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert scripts"
ON public.scripts
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
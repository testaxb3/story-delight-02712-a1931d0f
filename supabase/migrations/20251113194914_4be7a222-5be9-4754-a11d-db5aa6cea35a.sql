-- Create post_flags table for reporting inappropriate content
CREATE TABLE IF NOT EXISTS public.post_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.post_flags ENABLE ROW LEVEL SECURITY;

-- Users can flag posts (insert their own flags)
CREATE POLICY "Users can flag posts"
ON public.post_flags
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view their own flags
CREATE POLICY "Users can view their own flags"
ON public.post_flags
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all flags using security definer function
CREATE POLICY "Admins can view all flags"
ON public.post_flags
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete flags
CREATE POLICY "Admins can delete flags"
ON public.post_flags
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_post_flags_post_id ON public.post_flags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_flags_user_id ON public.post_flags(user_id);
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS child_profile text;

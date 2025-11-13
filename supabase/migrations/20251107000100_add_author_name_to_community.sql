-- Ensure community posts and comments capture the author display name
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS author_name text;

ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS author_name text;

UPDATE public.community_posts
SET author_name = COALESCE(author_name, 'Community Member');

UPDATE public.comments
SET author_name = COALESCE(author_name, 'Community Member');

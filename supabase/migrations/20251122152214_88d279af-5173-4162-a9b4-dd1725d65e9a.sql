-- Drop constraint if exists (ignore error if doesn't exist)
DO $$ 
BEGIN
  ALTER TABLE public.group_posts DROP CONSTRAINT IF EXISTS group_posts_user_id_fkey;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Create the foreign key relationship between group_posts and profiles
ALTER TABLE public.group_posts
ADD CONSTRAINT group_posts_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;
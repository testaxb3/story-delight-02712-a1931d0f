
ALTER TABLE public.community_posts
ADD CONSTRAINT community_posts_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;


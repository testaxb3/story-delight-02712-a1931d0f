-- Add foreign key constraint between group_posts and profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'group_posts_user_id_fkey'
    ) THEN
        ALTER TABLE public.group_posts
        ADD CONSTRAINT group_posts_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_user_id ON public.group_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_community_id ON public.group_posts(community_id);
CREATE INDEX IF NOT EXISTS idx_group_reactions_post_id ON public.group_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_group_reactions_user_id ON public.group_reactions(user_id);
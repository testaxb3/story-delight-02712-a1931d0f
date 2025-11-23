-- Add foreign key constraint between community_members and profiles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'community_members_user_id_fkey'
    ) THEN
        ALTER TABLE public.community_members
        ADD CONSTRAINT community_members_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_community_members_community_user ON public.community_members(community_id, user_id);
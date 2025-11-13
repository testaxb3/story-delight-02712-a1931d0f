-- Add is_seed_post field to community_posts table
-- This allows us to create "seed" posts that appear real but are admin-created

ALTER TABLE community_posts
ADD COLUMN IF NOT EXISTS is_seed_post BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS author_name TEXT,
ADD COLUMN IF NOT EXISTS author_brain_type TEXT,
ADD COLUMN IF NOT EXISTS post_type TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_community_posts_seed ON community_posts(is_seed_post);

-- Comments explaining the fields
COMMENT ON COLUMN community_posts.is_seed_post IS 'Flag indicating if this is a seed/example post created by admin to populate the community. These posts are shown to all users to create sense of active community.';
COMMENT ON COLUMN community_posts.author_name IS 'For seed posts: fictional author name. For real posts: NULL (use profiles table).';
COMMENT ON COLUMN community_posts.author_brain_type IS 'For seed posts: brain type (INTENSE/DISTRACTED/DEFIANT). For real posts: NULL (use child profiles).';
COMMENT ON COLUMN community_posts.post_type IS 'Type of post: win, question, lesson, or general.';

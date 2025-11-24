-- Add community_id column to community_posts
ALTER TABLE community_posts 
ADD COLUMN community_id uuid REFERENCES communities(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_community_posts_community_id ON community_posts(community_id);

-- Update RLS policies to check community membership
DROP POLICY IF EXISTS "Users can create their own posts" ON community_posts;
DROP POLICY IF EXISTS "Public read posts" ON community_posts;

-- Allow members to create posts in their communities
CREATE POLICY "Members can create posts in their communities"
ON community_posts FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND (
    community_id IS NULL -- Global posts
    OR EXISTS (
      SELECT 1 FROM community_members
      WHERE community_id = community_posts.community_id
      AND user_id = auth.uid()
    )
  )
);

-- Allow viewing posts from communities user is member of, or global posts
CREATE POLICY "Users can view community posts"
ON community_posts FOR SELECT
USING (
  community_id IS NULL -- Global posts
  OR EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = community_posts.community_id
    AND user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM communities
    WHERE id = community_posts.community_id
    AND is_official = true
  )
);
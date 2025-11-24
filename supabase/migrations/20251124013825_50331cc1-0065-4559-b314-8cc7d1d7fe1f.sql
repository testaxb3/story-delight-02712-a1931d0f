-- Add missing columns to community_posts table
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS script_used text,
ADD COLUMN IF NOT EXISTS duration_minutes integer,
ADD COLUMN IF NOT EXISTS result_type text CHECK (result_type IN ('success', 'partial', 'needs_practice'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_community_posts_result_type ON community_posts(result_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
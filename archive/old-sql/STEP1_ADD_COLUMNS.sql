-- ========================================
-- STEP 1: ADD COLUMNS TO community_posts
-- Execute este SQL primeiro
-- ========================================

ALTER TABLE community_posts
ADD COLUMN IF NOT EXISTS is_seed_post BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS author_name TEXT,
ADD COLUMN IF NOT EXISTS author_brain_type TEXT,
ADD COLUMN IF NOT EXISTS post_type TEXT;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_community_posts_seed ON community_posts(is_seed_post);

-- Verify columns were added
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'community_posts'
  AND column_name IN ('is_seed_post', 'author_name', 'author_brain_type', 'post_type')
ORDER BY column_name;

-- If you see all 4 columns listed above, proceed to STEP2_INSERT_POSTS.sql
SELECT '✅ Columns added successfully! Now execute STEP2_INSERT_POSTS.sql' as next_step;

-- =====================================================
-- PERFORMANCE OPTIMIZATION: Add Missing Database Indexes
-- =====================================================
-- Migration: 20251113000004_add_performance_indexes.sql
-- Purpose: Add indexes to frequently queried columns to improve query performance
-- Impact: Significant performance improvement for:
--   - User activity queries (script usage, feedback, favorites)
--   - Community post queries
--   - Tracker queries
--   - Video progress tracking
-- Created: 2025-11-13
-- =====================================================

-- =====================================================
-- 1. Script Usage Table Indexes
-- =====================================================
-- Purpose: Optimize queries that fetch user's script usage history
-- Common query patterns:
--   - SELECT * FROM script_usage WHERE user_id = ? ORDER BY created_at DESC
--   - SELECT COUNT(*) FROM script_usage WHERE user_id = ? AND script_id = ?
--   - SELECT * FROM script_usage WHERE script_id = ? ORDER BY created_at DESC

CREATE INDEX IF NOT EXISTS idx_script_usage_user_created
  ON public.script_usage(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

COMMENT ON INDEX idx_script_usage_user_created IS
  'Optimizes queries fetching user script usage history ordered by date';

CREATE INDEX IF NOT EXISTS idx_script_usage_script_created
  ON public.script_usage(script_id, created_at DESC)
  WHERE script_id IS NOT NULL;

COMMENT ON INDEX idx_script_usage_script_created IS
  'Optimizes queries fetching usage history for a specific script';

CREATE INDEX IF NOT EXISTS idx_script_usage_user_script
  ON public.script_usage(user_id, script_id)
  WHERE user_id IS NOT NULL AND script_id IS NOT NULL;

COMMENT ON INDEX idx_script_usage_user_script IS
  'Optimizes queries checking if user has used a specific script';

-- =====================================================
-- 2. Script Feedback Table Indexes
-- =====================================================
-- Purpose: Optimize queries that fetch user's feedback on scripts
-- Common query patterns:
--   - SELECT * FROM script_feedback WHERE user_id = ? ORDER BY created_at DESC
--   - SELECT * FROM script_feedback WHERE script_id = ? ORDER BY created_at DESC
--   - SELECT * FROM script_feedback WHERE user_id = ? AND script_id = ?

CREATE INDEX IF NOT EXISTS idx_script_feedback_user_created
  ON public.script_feedback(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

COMMENT ON INDEX idx_script_feedback_user_created IS
  'Optimizes queries fetching user feedback history ordered by date';

CREATE INDEX IF NOT EXISTS idx_script_feedback_script_created
  ON public.script_feedback(script_id, created_at DESC)
  WHERE script_id IS NOT NULL;

COMMENT ON INDEX idx_script_feedback_script_created IS
  'Optimizes queries fetching feedback for a specific script';

CREATE INDEX IF NOT EXISTS idx_script_feedback_user_script
  ON public.script_feedback(user_id, script_id)
  WHERE user_id IS NOT NULL AND script_id IS NOT NULL;

COMMENT ON INDEX idx_script_feedback_user_script IS
  'Optimizes queries checking user feedback for specific script';

-- =====================================================
-- 3. Favorite Scripts Table Indexes
-- =====================================================
-- Purpose: Optimize queries that fetch user's favorite scripts
-- Common query patterns:
--   - SELECT * FROM favorite_scripts WHERE user_id = ? ORDER BY created_at DESC
--   - SELECT COUNT(*) FROM favorite_scripts WHERE user_id = ? AND script_id = ?

CREATE INDEX IF NOT EXISTS idx_favorite_scripts_user_created
  ON public.favorite_scripts(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

COMMENT ON INDEX idx_favorite_scripts_user_created IS
  'Optimizes queries fetching user favorite scripts ordered by when they were favorited';

CREATE INDEX IF NOT EXISTS idx_favorite_scripts_script
  ON public.favorite_scripts(script_id, user_id)
  WHERE script_id IS NOT NULL;

COMMENT ON INDEX idx_favorite_scripts_script IS
  'Optimizes queries checking which users favorited a specific script';

-- =====================================================
-- 4. Community Posts Table Indexes
-- =====================================================
-- Purpose: Optimize community post queries
-- Common query patterns:
--   - SELECT * FROM community_posts WHERE user_id = ? ORDER BY created_at DESC
--   - SELECT * FROM community_posts ORDER BY created_at DESC LIMIT 20
--   - SELECT * FROM community_posts WHERE is_seed_post = true

CREATE INDEX IF NOT EXISTS idx_community_posts_user_created
  ON public.community_posts(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

COMMENT ON INDEX idx_community_posts_user_created IS
  'Optimizes queries fetching user posts ordered by date';

CREATE INDEX IF NOT EXISTS idx_community_posts_created
  ON public.community_posts(created_at DESC);

COMMENT ON INDEX idx_community_posts_created IS
  'Optimizes queries fetching recent posts across all users';

CREATE INDEX IF NOT EXISTS idx_community_posts_seed
  ON public.community_posts(is_seed_post, created_at DESC)
  WHERE is_seed_post = true;

COMMENT ON INDEX idx_community_posts_seed IS
  'Optimizes queries fetching seed posts (fake community posts for social proof)';

-- =====================================================
-- 5. Post Comments Table Indexes
-- =====================================================
-- Purpose: Optimize comment queries
-- Common query patterns:
--   - SELECT * FROM post_comments WHERE post_id = ? ORDER BY created_at ASC
--   - SELECT COUNT(*) FROM post_comments WHERE post_id = ?
--   - SELECT * FROM post_comments WHERE user_id = ? ORDER BY created_at DESC

CREATE INDEX IF NOT EXISTS idx_post_comments_post_created
  ON public.post_comments(post_id, created_at ASC)
  WHERE post_id IS NOT NULL;

COMMENT ON INDEX idx_post_comments_post_created IS
  'Optimizes queries fetching comments for a post ordered chronologically';

CREATE INDEX IF NOT EXISTS idx_post_comments_user_created
  ON public.post_comments(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

COMMENT ON INDEX idx_post_comments_user_created IS
  'Optimizes queries fetching user comments ordered by date';

-- =====================================================
-- 6. Post Likes Table Indexes
-- =====================================================
-- Purpose: Optimize like/reaction queries
-- Common query patterns:
--   - SELECT * FROM post_likes WHERE post_id = ?
--   - SELECT COUNT(*) FROM post_likes WHERE post_id = ?
--   - SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?

CREATE INDEX IF NOT EXISTS idx_post_likes_post
  ON public.post_likes(post_id, user_id)
  WHERE post_id IS NOT NULL;

COMMENT ON INDEX idx_post_likes_post IS
  'Optimizes queries fetching likes/reactions for a post';

CREATE INDEX IF NOT EXISTS idx_post_likes_user_post
  ON public.post_likes(user_id, post_id)
  WHERE user_id IS NOT NULL AND post_id IS NOT NULL;

COMMENT ON INDEX idx_post_likes_user_post IS
  'Optimizes queries checking if user liked a specific post';

-- =====================================================
-- 7. Tracker Days Table Indexes
-- =====================================================
-- Purpose: Optimize tracker queries
-- Common query patterns:
--   - SELECT * FROM tracker_days WHERE child_id = ? AND date = ?
--   - SELECT * FROM tracker_days WHERE user_id = ? ORDER BY date DESC
--   - SELECT * FROM tracker_days WHERE child_id = ? ORDER BY date DESC

CREATE INDEX IF NOT EXISTS idx_tracker_days_child_date
  ON public.tracker_days(child_id, date DESC)
  WHERE child_id IS NOT NULL;

COMMENT ON INDEX idx_tracker_days_child_date IS
  'Optimizes queries fetching tracker data for a child ordered by date';

CREATE INDEX IF NOT EXISTS idx_tracker_days_user_date
  ON public.tracker_days(user_id, date DESC)
  WHERE user_id IS NOT NULL;

COMMENT ON INDEX idx_tracker_days_user_date IS
  'Optimizes queries fetching tracker data for a user across all children';

-- =====================================================
-- 8. Video Progress Table Indexes
-- =====================================================
-- Purpose: Optimize video progress tracking queries
-- Common query patterns:
--   - SELECT * FROM video_progress WHERE user_id = ? AND video_id = ?
--   - SELECT * FROM video_progress WHERE user_id = ? ORDER BY updated_at DESC

CREATE INDEX IF NOT EXISTS idx_video_progress_user_video
  ON public.video_progress(user_id, video_id)
  WHERE user_id IS NOT NULL AND video_id IS NOT NULL;

COMMENT ON INDEX idx_video_progress_user_video IS
  'Optimizes queries fetching user progress for a specific video';

CREATE INDEX IF NOT EXISTS idx_video_progress_user_updated
  ON public.video_progress(user_id, updated_at DESC)
  WHERE user_id IS NOT NULL;

COMMENT ON INDEX idx_video_progress_user_updated IS
  'Optimizes queries fetching recently watched videos for a user';

-- =====================================================
-- 9. Child Profiles Table Indexes
-- =====================================================
-- Purpose: Optimize child profile queries
-- Common query patterns:
--   - SELECT * FROM child_profiles WHERE parent_id = ?
--   - SELECT * FROM child_profiles WHERE parent_id = ? AND id = ?

CREATE INDEX IF NOT EXISTS idx_child_profiles_parent
  ON public.child_profiles(parent_id, created_at DESC)
  WHERE parent_id IS NOT NULL;

COMMENT ON INDEX idx_child_profiles_parent IS
  'Optimizes queries fetching all children for a parent';

-- =====================================================
-- 10. User Progress Table Indexes
-- =====================================================
-- Purpose: Optimize user progress queries
-- Common query patterns:
--   - SELECT * FROM user_progress WHERE user_id = ?
--   - SELECT * FROM user_progress WHERE user_id = ? AND child_profile_id = ?

CREATE INDEX IF NOT EXISTS idx_user_progress_user_child
  ON public.user_progress(user_id, child_profile_id)
  WHERE user_id IS NOT NULL;

COMMENT ON INDEX idx_user_progress_user_child IS
  'Optimizes queries fetching progress for a user and specific child';

-- =====================================================
-- Analysis and Verification
-- =====================================================

-- To verify index usage, run this query after the migration:
-- SELECT
--   schemaname,
--   tablename,
--   indexname,
--   idx_scan as scans,
--   idx_tup_read as tuples_read,
--   idx_tup_fetch as tuples_fetched
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;

-- To check index sizes:
-- SELECT
--   tablename,
--   indexname,
--   pg_size_pretty(pg_relation_size(indexrelid)) as size
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY pg_relation_size(indexrelid) DESC;

-- =====================================================
-- Performance Impact Estimate
-- =====================================================
-- BEFORE: Queries without indexes perform sequential scans (O(n))
-- AFTER: Queries with indexes perform index scans (O(log n))
--
-- Expected improvements:
-- - User script usage queries: 10-100x faster
-- - Community post loading: 5-50x faster
-- - Comment count aggregation: 10-100x faster
-- - Favorite script checks: 100-1000x faster
-- - Tracker queries: 10-50x faster
--
-- For a table with 10,000 rows:
-- - Sequential scan: ~100-500ms
-- - Index scan: ~1-5ms
-- =====================================================

-- ========================================
-- DELETE ALL SEED POSTS
-- Execute this to clean up duplicates
-- ========================================

DELETE FROM community_posts
WHERE is_seed_post = true;

-- Verify deletion
SELECT COUNT(*) as remaining_seed_posts
FROM community_posts
WHERE is_seed_post = true;

-- Should show 0 remaining seed posts
SELECT '✅ All seed posts deleted! Now run EXECUTE_SEED_POSTS.sql ONCE to add them back.' as message;

-- Delete all community posts to start fresh
DELETE FROM community_posts;

-- Reset any related counters in profiles if needed
UPDATE profiles 
SET posts_count = 0 
WHERE posts_count > 0;
-- Function to get user likes count correctly
-- This function counts the total likes received on a user's posts
-- excluding seed posts (which are fake community posts)

CREATE OR REPLACE FUNCTION get_user_likes_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  likes_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO likes_count
  FROM post_likes pl
  INNER JOIN community_posts cp ON pl.post_id = cp.id
  WHERE cp.user_id = target_user_id AND cp.is_seed_post = false;

  RETURN COALESCE(likes_count, 0);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_likes_count(UUID) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION get_user_likes_count(UUID) IS 'Returns the total number of likes received on all posts by a specific user (excluding seed posts)';

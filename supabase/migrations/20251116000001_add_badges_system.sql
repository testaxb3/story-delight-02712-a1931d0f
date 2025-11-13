-- Function to update user badges based on activity
CREATE OR REPLACE FUNCTION update_user_badges(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  posts_count int;
  comments_count int;
  likes_received int;
  current_badges text[];
  new_badges text[] := '{}';
BEGIN
  -- Get activity counts
  SELECT COUNT(*) INTO posts_count
  FROM community_posts
  WHERE user_id = target_user_id AND is_seed_post = false;

  SELECT COUNT(*) INTO comments_count
  FROM post_comments
  WHERE user_id = target_user_id;

  SELECT COUNT(*) INTO likes_received
  FROM post_likes pl
  INNER JOIN community_posts cp ON cp.id = pl.post_id
  WHERE cp.user_id = target_user_id AND cp.is_seed_post = false;

  -- Determine badges
  IF posts_count >= 10 THEN
    new_badges := array_append(new_badges, 'active_member');
  END IF;

  IF comments_count >= 20 THEN
    new_badges := array_append(new_badges, 'helpful_parent');
  END IF;

  IF likes_received >= 50 THEN
    new_badges := array_append(new_badges, 'top_contributor');
  END IF;

  -- Update profile with new badges
  UPDATE profiles
  SET badges = new_badges
  WHERE id = target_user_id;
END;
$$;

-- Trigger to update badges when a post is created
CREATE OR REPLACE FUNCTION trigger_update_badges_on_post()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM update_user_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

-- Trigger to update badges when a comment is created
CREATE OR REPLACE FUNCTION trigger_update_badges_on_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM update_user_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

-- Trigger to update badges when a like is given
CREATE OR REPLACE FUNCTION trigger_update_badges_on_like()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  post_author_id uuid;
BEGIN
  -- Get the post author
  SELECT user_id INTO post_author_id
  FROM community_posts
  WHERE id = NEW.post_id;

  -- Update badges for post author
  IF post_author_id IS NOT NULL THEN
    PERFORM update_user_badges(post_author_id);
  END IF;

  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS update_badges_on_post ON community_posts;
CREATE TRIGGER update_badges_on_post
  AFTER INSERT ON community_posts
  FOR EACH ROW
  WHEN (NEW.is_seed_post = false)
  EXECUTE FUNCTION trigger_update_badges_on_post();

DROP TRIGGER IF EXISTS update_badges_on_comment ON post_comments;
CREATE TRIGGER update_badges_on_comment
  AFTER INSERT ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_badges_on_comment();

DROP TRIGGER IF EXISTS update_badges_on_like ON post_likes;
CREATE TRIGGER update_badges_on_like
  AFTER INSERT ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_badges_on_like();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_user_badges(uuid) TO authenticated;

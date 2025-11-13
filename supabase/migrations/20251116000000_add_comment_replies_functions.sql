-- Function to increment comment replies count
CREATE OR REPLACE FUNCTION increment_comment_replies(comment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE post_comments
  SET replies_count = COALESCE(replies_count, 0) + 1
  WHERE id = comment_id;
END;
$$;

-- Function to decrement comment replies count
CREATE OR REPLACE FUNCTION decrement_comment_replies(comment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE post_comments
  SET replies_count = GREATEST(COALESCE(replies_count, 0) - 1, 0)
  WHERE id = comment_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_comment_replies(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_comment_replies(uuid) TO authenticated;

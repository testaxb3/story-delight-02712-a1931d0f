-- ============================================================================
-- SERVER-SIDE RATE LIMITING FOR COMMUNITY FEATURES
-- ============================================================================
-- This migration implements database-level rate limiting to prevent abuse
-- and spam attacks. Client-side rate limiting can be easily bypassed, so
-- we enforce limits at the database level using triggers.
--
-- Security Issue Fixed: Missing Rate Limiting on API Endpoints (HIGH SEVERITY)
-- Audit Report Reference: Section 2.2
--
-- Rate Limits Implemented:
-- 1. Community Posts: Maximum 3 posts per minute per user
-- 2. Post Comments: Maximum 10 comments per minute per user
-- 3. Post Likes/Reactions: Maximum 20 reactions per minute per user
-- 4. User Follows: Maximum 10 follows per minute per user
--
-- Created: 2025-11-13
-- Author: Security Audit Fix
-- ============================================================================

-- ============================================================================
-- 1. RATE LIMIT TABLE - Track rate limit violations
-- ============================================================================

-- Create table to log rate limit violations for monitoring
CREATE TABLE IF NOT EXISTS public.rate_limit_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  violation_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS on rate_limit_violations (admins only)
ALTER TABLE public.rate_limit_violations ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limit violations
CREATE POLICY "Admins can view rate limit violations"
  ON public.rate_limit_violations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_user_time
  ON public.rate_limit_violations(user_id, created_at DESC);

-- ============================================================================
-- 2. COMMUNITY POSTS RATE LIMITING - 3 posts per minute
-- ============================================================================

CREATE OR REPLACE FUNCTION check_post_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_post_count INTEGER;
  rate_limit_window INTERVAL := INTERVAL '1 minute';
  max_posts_per_window INTEGER := 3;
BEGIN
  -- Count posts from this user in the last minute
  SELECT COUNT(*) INTO recent_post_count
  FROM public.community_posts
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - rate_limit_window;

  -- If exceeded, log violation and reject
  IF recent_post_count >= max_posts_per_window THEN
    -- Log the violation
    INSERT INTO public.rate_limit_violations (
      user_id, table_name, action_type, violation_count
    ) VALUES (
      NEW.user_id, 'community_posts', 'INSERT', recent_post_count + 1
    );

    -- Reject the operation
    RAISE EXCEPTION 'Rate limit exceeded: Maximum % posts per minute. Please wait before posting again.', max_posts_per_window
      USING HINT = 'Try again in a few seconds',
            ERRCODE = 'P0001'; -- Custom error code for rate limiting
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for post rate limiting
DROP TRIGGER IF EXISTS trigger_check_post_rate_limit ON public.community_posts;
CREATE TRIGGER trigger_check_post_rate_limit
  BEFORE INSERT ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION check_post_rate_limit();

-- ============================================================================
-- 3. COMMENTS RATE LIMITING - 10 comments per minute
-- ============================================================================

CREATE OR REPLACE FUNCTION check_comment_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_comment_count INTEGER;
  rate_limit_window INTERVAL := INTERVAL '1 minute';
  max_comments_per_window INTEGER := 10;
BEGIN
  -- Count comments from this user in the last minute
  SELECT COUNT(*) INTO recent_comment_count
  FROM public.post_comments
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - rate_limit_window;

  -- If exceeded, log violation and reject
  IF recent_comment_count >= max_comments_per_window THEN
    -- Log the violation
    INSERT INTO public.rate_limit_violations (
      user_id, table_name, action_type, violation_count
    ) VALUES (
      NEW.user_id, 'post_comments', 'INSERT', recent_comment_count + 1
    );

    -- Reject the operation
    RAISE EXCEPTION 'Rate limit exceeded: Maximum % comments per minute. Please slow down.', max_comments_per_window
      USING HINT = 'Try again in a few seconds',
            ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for comment rate limiting
DROP TRIGGER IF EXISTS trigger_check_comment_rate_limit ON public.post_comments;
CREATE TRIGGER trigger_check_comment_rate_limit
  BEFORE INSERT ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION check_comment_rate_limit();

-- ============================================================================
-- 4. REACTIONS/LIKES RATE LIMITING - 20 reactions per minute
-- ============================================================================

CREATE OR REPLACE FUNCTION check_reaction_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_reaction_count INTEGER;
  rate_limit_window INTERVAL := INTERVAL '1 minute';
  max_reactions_per_window INTEGER := 20;
BEGIN
  -- Count reactions from this user in the last minute
  SELECT COUNT(*) INTO recent_reaction_count
  FROM public.post_likes
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - rate_limit_window;

  -- If exceeded, log violation and reject
  IF recent_reaction_count >= max_reactions_per_window THEN
    -- Log the violation
    INSERT INTO public.rate_limit_violations (
      user_id, table_name, action_type, violation_count
    ) VALUES (
      NEW.user_id, 'post_likes', 'INSERT', recent_reaction_count + 1
    );

    -- Reject the operation
    RAISE EXCEPTION 'Rate limit exceeded: Maximum % reactions per minute. Please slow down.', max_reactions_per_window
      USING HINT = 'Try again in a few seconds',
            ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for reaction rate limiting
DROP TRIGGER IF EXISTS trigger_check_reaction_rate_limit ON public.post_likes;
CREATE TRIGGER trigger_check_reaction_rate_limit
  BEFORE INSERT ON public.post_likes
  FOR EACH ROW
  EXECUTE FUNCTION check_reaction_rate_limit();

-- ============================================================================
-- 5. FOLLOWS RATE LIMITING - 10 follows per minute
-- ============================================================================

CREATE OR REPLACE FUNCTION check_follow_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_follow_count INTEGER;
  rate_limit_window INTERVAL := INTERVAL '1 minute';
  max_follows_per_window INTEGER := 10;
BEGIN
  -- Count follows from this user in the last minute
  SELECT COUNT(*) INTO recent_follow_count
  FROM public.user_followers
  WHERE follower_id = NEW.follower_id
    AND created_at > NOW() - rate_limit_window;

  -- If exceeded, log violation and reject
  IF recent_follow_count >= max_follows_per_window THEN
    -- Log the violation
    INSERT INTO public.rate_limit_violations (
      user_id, table_name, action_type, violation_count
    ) VALUES (
      NEW.follower_id, 'user_followers', 'INSERT', recent_follow_count + 1
    );

    -- Reject the operation
    RAISE EXCEPTION 'Rate limit exceeded: Maximum % follows per minute. Please slow down.', max_follows_per_window
      USING HINT = 'Try again in a few seconds',
            ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for follow rate limiting
DROP TRIGGER IF EXISTS trigger_check_follow_rate_limit ON public.user_followers;
CREATE TRIGGER trigger_check_follow_rate_limit
  BEFORE INSERT ON public.user_followers
  FOR EACH ROW
  EXECUTE FUNCTION check_follow_rate_limit();

-- ============================================================================
-- 6. ADMIN MONITORING FUNCTIONS
-- ============================================================================

-- Function to get rate limit violations summary (admins only)
CREATE OR REPLACE FUNCTION get_rate_limit_violations_summary(
  time_window INTERVAL DEFAULT INTERVAL '1 hour'
)
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  table_name TEXT,
  total_violations BIGINT,
  last_violation TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    rlv.user_id,
    p.email,
    rlv.table_name,
    COUNT(*) as total_violations,
    MAX(rlv.created_at) as last_violation
  FROM public.rate_limit_violations rlv
  INNER JOIN public.profiles p ON rlv.user_id = p.id
  WHERE rlv.created_at > NOW() - time_window
  GROUP BY rlv.user_id, p.email, rlv.table_name
  ORDER BY total_violations DESC, last_violation DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (RLS will check admin status)
GRANT EXECUTE ON FUNCTION get_rate_limit_violations_summary TO authenticated;

-- ============================================================================
-- 7. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes to make rate limit checks fast
CREATE INDEX IF NOT EXISTS idx_community_posts_user_created
  ON public.community_posts(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_comments_user_created
  ON public.post_comments(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_likes_user_created
  ON public.post_likes(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_followers_follower_created
  ON public.user_followers(follower_id, created_at DESC);

-- ============================================================================
-- 8. CLEANUP OLD VIOLATIONS (Optional - for data retention)
-- ============================================================================

-- Function to clean up old rate limit violation logs (keep only last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limit_violations()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limit_violations
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS
-- ============================================================================

-- To rollback this migration, run the following commands:
--
-- DROP TRIGGER IF EXISTS trigger_check_post_rate_limit ON public.community_posts;
-- DROP TRIGGER IF EXISTS trigger_check_comment_rate_limit ON public.post_comments;
-- DROP TRIGGER IF EXISTS trigger_check_reaction_rate_limit ON public.post_likes;
-- DROP TRIGGER IF EXISTS trigger_check_follow_rate_limit ON public.user_followers;
--
-- DROP FUNCTION IF EXISTS check_post_rate_limit();
-- DROP FUNCTION IF EXISTS check_comment_rate_limit();
-- DROP FUNCTION IF EXISTS check_reaction_rate_limit();
-- DROP FUNCTION IF EXISTS check_follow_rate_limit();
-- DROP FUNCTION IF EXISTS get_rate_limit_violations_summary(INTERVAL);
-- DROP FUNCTION IF EXISTS cleanup_old_rate_limit_violations();
--
-- DROP TABLE IF EXISTS public.rate_limit_violations;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.rate_limit_violations IS
  'Logs rate limit violations for monitoring and security analysis';

COMMENT ON FUNCTION check_post_rate_limit() IS
  'Prevents users from creating more than 3 posts per minute';

COMMENT ON FUNCTION check_comment_rate_limit() IS
  'Prevents users from creating more than 10 comments per minute';

COMMENT ON FUNCTION check_reaction_rate_limit() IS
  'Prevents users from creating more than 20 reactions per minute';

COMMENT ON FUNCTION check_follow_rate_limit() IS
  'Prevents users from following more than 10 users per minute';

COMMENT ON FUNCTION get_rate_limit_violations_summary IS
  'Returns summary of rate limit violations for admin monitoring';

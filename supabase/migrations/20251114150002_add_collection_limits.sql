-- ============================================================================
-- ADD COLLECTION LIMITS AND VALIDATION
-- ============================================================================
-- This migration adds collection limits to prevent abuse and excessive
-- database usage.
--
-- Security Improvement: Resource limits
-- - Prevent unlimited growth of user data
-- - Protect database performance
-- - Enforce reasonable usage patterns
--
-- Created: 2025-11-14
-- Author: Security Enhancement
-- ============================================================================

-- ============================================================================
-- 1. CHILD PROFILES - Limit to 10 per user
-- ============================================================================

CREATE OR REPLACE FUNCTION check_child_profiles_limit()
RETURNS TRIGGER AS $$
DECLARE
  child_count INTEGER;
  max_children INTEGER := 10;
BEGIN
  -- Count existing children for this parent
  SELECT COUNT(*)
  INTO child_count
  FROM public.child_profiles
  WHERE parent_id = NEW.parent_id;

  -- Check limit
  IF child_count >= max_children THEN
    RAISE EXCEPTION 'Maximum number of child profiles (%) reached', max_children
      USING HINT = format('You can have up to % child profiles. Please delete an existing profile to add a new one.', max_children),
            ERRCODE = '23514'; -- check_violation
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for child profiles limit
DROP TRIGGER IF EXISTS trigger_check_child_profiles_limit ON public.child_profiles;
CREATE TRIGGER trigger_check_child_profiles_limit
  BEFORE INSERT ON public.child_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_child_profiles_limit();

-- ============================================================================
-- 2. SCRIPT FEEDBACK - Limit to 500 per user
-- ============================================================================

CREATE OR REPLACE FUNCTION check_script_feedback_limit()
RETURNS TRIGGER AS $$
DECLARE
  feedback_count INTEGER;
  max_feedback INTEGER := 500;
BEGIN
  -- Count existing feedback for this user
  SELECT COUNT(*)
  INTO feedback_count
  FROM public.script_feedback
  WHERE user_id = NEW.user_id;

  -- Check limit
  IF feedback_count >= max_feedback THEN
    RAISE EXCEPTION 'Maximum number of feedback entries (%) reached', max_feedback
      USING HINT = format('You have reached the maximum of % feedback entries.', max_feedback),
            ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for script feedback limit
DROP TRIGGER IF EXISTS trigger_check_script_feedback_limit ON public.script_feedback;
CREATE TRIGGER trigger_check_script_feedback_limit
  BEFORE INSERT ON public.script_feedback
  FOR EACH ROW
  EXECUTE FUNCTION check_script_feedback_limit();

-- ============================================================================
-- 3. COMMUNITY POSTS - Limit to 1000 per user
-- ============================================================================

CREATE OR REPLACE FUNCTION check_community_posts_limit()
RETURNS TRIGGER AS $$
DECLARE
  post_count INTEGER;
  max_posts INTEGER := 1000;
BEGIN
  -- Count existing posts for this user
  SELECT COUNT(*)
  INTO post_count
  FROM public.community_posts
  WHERE user_id = NEW.user_id;

  -- Check limit
  IF post_count >= max_posts THEN
    RAISE EXCEPTION 'Maximum number of posts (%) reached', max_posts
      USING HINT = format('You have reached the maximum of % posts.', max_posts),
            ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for community posts limit
DROP TRIGGER IF EXISTS trigger_check_community_posts_limit ON public.community_posts;
CREATE TRIGGER trigger_check_community_posts_limit
  BEFORE INSERT ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION check_community_posts_limit();

-- ============================================================================
-- 4. POST COMMENTS - Limit to 5000 per user
-- ============================================================================

CREATE OR REPLACE FUNCTION check_post_comments_limit()
RETURNS TRIGGER AS $$
DECLARE
  comment_count INTEGER;
  max_comments INTEGER := 5000;
BEGIN
  -- Count existing comments for this user
  SELECT COUNT(*)
  INTO comment_count
  FROM public.post_comments
  WHERE user_id = NEW.user_id;

  -- Check limit
  IF comment_count >= max_comments THEN
    RAISE EXCEPTION 'Maximum number of comments (%) reached', max_comments
      USING HINT = format('You have reached the maximum of % comments.', max_comments),
            ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for post comments limit
DROP TRIGGER IF EXISTS trigger_check_post_comments_limit ON public.post_comments;
CREATE TRIGGER trigger_check_post_comments_limit
  BEFORE INSERT ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION check_post_comments_limit();

-- ============================================================================
-- 5. VALIDATION: Child Profile Name Length
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_child_profile_name()
RETURNS TRIGGER AS $$
BEGIN
  -- Check name length
  IF LENGTH(TRIM(NEW.name)) < 2 THEN
    RAISE EXCEPTION 'Child name must be at least 2 characters long'
      USING ERRCODE = '23514';
  END IF;

  IF LENGTH(TRIM(NEW.name)) > 50 THEN
    RAISE EXCEPTION 'Child name must be at most 50 characters long'
      USING ERRCODE = '23514';
  END IF;

  -- Trim and clean name
  NEW.name := TRIM(NEW.name);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for name validation
DROP TRIGGER IF EXISTS trigger_validate_child_profile_name ON public.child_profiles;
CREATE TRIGGER trigger_validate_child_profile_name
  BEFORE INSERT OR UPDATE ON public.child_profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_child_profile_name();

-- ============================================================================
-- 6. RPC FUNCTIONS - Get collection counts
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_collection_counts()
RETURNS JSON AS $$
DECLARE
  child_count INTEGER;
  feedback_count INTEGER;
  post_count INTEGER;
  comment_count INTEGER;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object(
      'error', 'Not authenticated'
    );
  END IF;

  -- Count child profiles
  SELECT COUNT(*) INTO child_count
  FROM public.child_profiles
  WHERE parent_id = auth.uid();

  -- Count feedback
  SELECT COUNT(*) INTO feedback_count
  FROM public.script_feedback
  WHERE user_id = auth.uid();

  -- Count posts
  SELECT COUNT(*) INTO post_count
  FROM public.community_posts
  WHERE user_id = auth.uid();

  -- Count comments
  SELECT COUNT(*) INTO comment_count
  FROM public.post_comments
  WHERE user_id = auth.uid();

  RETURN json_build_object(
    'child_profiles', json_build_object(
      'count', child_count,
      'limit', 10,
      'remaining', 10 - child_count
    ),
    'feedback', json_build_object(
      'count', feedback_count,
      'limit', 500,
      'remaining', 500 - feedback_count
    ),
    'posts', json_build_object(
      'count', post_count,
      'limit', 1000,
      'remaining', 1000 - post_count
    ),
    'comments', json_build_object(
      'count', comment_count,
      'limit', 5000,
      'remaining', 5000 - comment_count
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_user_collection_counts TO authenticated;

-- Add comments
COMMENT ON FUNCTION get_user_collection_counts IS
  'Returns counts and limits for all user collections';

-- ============================================================================
-- MIGRATION SUMMARY
-- ============================================================================
-- ADDED:
-- - Trigger limits for child_profiles (max 10)
-- - Trigger limits for script_feedback (max 500)
-- - Trigger limits for community_posts (max 1000)
-- - Trigger limits for post_comments (max 5000)
-- - Validation for child profile names (2-50 chars)
-- - RPC function to get collection counts
--
-- BENEFITS:
-- - Prevent database abuse
-- - Protect system resources
-- - Enforce data quality
-- - Better error messages

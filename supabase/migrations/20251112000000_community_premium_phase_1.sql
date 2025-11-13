-- ============================================================================
-- COMMUNITY PREMIUM - PHASE 1 (MUST-HAVE)
-- ============================================================================
-- This migration adds all Phase 1 features for the premium community platform:
-- 1. Posts with Images (thumbnails)
-- 2. Multiple Reactions (7 types)
-- 3. Nested Comments (threads)
-- 4. Complete User Profiles (bio, badges, follow system)
-- 5. Advanced Search (full-text search)
-- 6. Real-time Notifications
-- ============================================================================

-- ============================================================================
-- 1. POSTS WITH IMAGES - Add thumbnail support
-- ============================================================================

-- Add thumbnail URL to community_posts (image_url already exists)
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS image_thumbnail_url TEXT;

-- Create index for posts with images
CREATE INDEX IF NOT EXISTS idx_community_posts_has_image
  ON public.community_posts(image_url) WHERE image_url IS NOT NULL;

-- ============================================================================
-- 2. MULTIPLE REACTIONS - 7 types of reactions
-- ============================================================================

-- Add reaction_type to post_likes
-- Types: 'like' (❤️), 'love' (💕), 'strong' (💪), 'empathy' (🤗),
--        'celebrate' (🎉), 'insightful' (💡), 'helpful' (🙌)
DO $$
BEGIN
  -- Create ENUM type for reactions
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reaction_type') THEN
    CREATE TYPE public.reaction_type AS ENUM (
      'like',      -- ❤️ Like
      'love',      -- 💕 Love
      'strong',    -- 💪 Strong
      'empathy',   -- 🤗 Empathy
      'celebrate', -- 🎉 Celebrate
      'insightful',-- 💡 Insightful
      'helpful'    -- 🙌 Helpful
    );
  END IF;
END $$;

-- Add reaction_type column
ALTER TABLE public.post_likes
  ADD COLUMN IF NOT EXISTS reaction_type public.reaction_type NOT NULL DEFAULT 'like';

-- Create index for reaction counts
CREATE INDEX IF NOT EXISTS idx_post_likes_reaction_type
  ON public.post_likes(post_id, reaction_type);

-- ============================================================================
-- 3. NESTED COMMENTS - Thread support
-- ============================================================================

-- Add parent_comment_id for nested replies
ALTER TABLE public.post_comments
  ADD COLUMN IF NOT EXISTS parent_comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE;

-- Add replies_count for caching
ALTER TABLE public.post_comments
  ADD COLUMN IF NOT EXISTS replies_count INTEGER NOT NULL DEFAULT 0;

-- Create index for comment threads
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id
  ON public.post_comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;

-- Create function to update replies_count
CREATE OR REPLACE FUNCTION update_comment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL THEN
    UPDATE public.post_comments
    SET replies_count = replies_count + 1
    WHERE id = NEW.parent_comment_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL THEN
    UPDATE public.post_comments
    SET replies_count = GREATEST(0, replies_count - 1)
    WHERE id = OLD.parent_comment_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for replies_count
DROP TRIGGER IF EXISTS trigger_update_comment_replies_count ON public.post_comments;
CREATE TRIGGER trigger_update_comment_replies_count
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_replies_count();

-- ============================================================================
-- 4. COMPLETE USER PROFILES - Bio, badges, follow system
-- ============================================================================

-- Add profile fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS followers_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS following_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS posts_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likes_received_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments_count INTEGER NOT NULL DEFAULT 0;

-- Create user_followers table
CREATE TABLE IF NOT EXISTS public.user_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),

  -- Prevent self-following and duplicate follows
  CHECK (follower_id != following_id),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS on user_followers
ALTER TABLE public.user_followers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_followers
CREATE POLICY "Users can view all follows"
  ON public.user_followers FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own follows"
  ON public.user_followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
  ON public.user_followers FOR DELETE
  USING (auth.uid() = follower_id);

-- Create indexes for follow relationships
CREATE INDEX IF NOT EXISTS idx_user_followers_follower
  ON public.user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_following
  ON public.user_followers(following_id);

-- Create function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment following_count for follower
    UPDATE public.profiles
    SET following_count = following_count + 1
    WHERE id = NEW.follower_id;

    -- Increment followers_count for followed user
    UPDATE public.profiles
    SET followers_count = followers_count + 1
    WHERE id = NEW.following_id;

  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement following_count for follower
    UPDATE public.profiles
    SET following_count = GREATEST(0, following_count - 1)
    WHERE id = OLD.follower_id;

    -- Decrement followers_count for followed user
    UPDATE public.profiles
    SET followers_count = GREATEST(0, followers_count - 1)
    WHERE id = OLD.following_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for follower counts
DROP TRIGGER IF EXISTS trigger_update_follower_counts ON public.user_followers;
CREATE TRIGGER trigger_update_follower_counts
  AFTER INSERT OR DELETE ON public.user_followers
  FOR EACH ROW
  EXECUTE FUNCTION update_follower_counts();

-- Create function to update user stats (posts, likes, comments)
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update posts_count
  IF TG_TABLE_NAME = 'community_posts' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.profiles
      SET posts_count = posts_count + 1
      WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.profiles
      SET posts_count = GREATEST(0, posts_count - 1)
      WHERE id = OLD.user_id;
    END IF;
  END IF;

  -- Update comments_count
  IF TG_TABLE_NAME = 'post_comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.profiles
      SET comments_count = comments_count + 1
      WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.profiles
      SET comments_count = GREATEST(0, comments_count - 1)
      WHERE id = OLD.user_id;
    END IF;
  END IF;

  -- Update likes_received_count (for post authors)
  IF TG_TABLE_NAME = 'post_likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.profiles p
      SET likes_received_count = likes_received_count + 1
      FROM public.community_posts cp
      WHERE cp.id = NEW.post_id AND p.id = cp.user_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.profiles p
      SET likes_received_count = GREATEST(0, likes_received_count - 1)
      FROM public.community_posts cp
      WHERE cp.id = OLD.post_id AND p.id = cp.user_id;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for user stats
DROP TRIGGER IF EXISTS trigger_update_posts_stats ON public.community_posts;
CREATE TRIGGER trigger_update_posts_stats
  AFTER INSERT OR DELETE ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

DROP TRIGGER IF EXISTS trigger_update_comments_stats ON public.post_comments;
CREATE TRIGGER trigger_update_comments_stats
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

DROP TRIGGER IF EXISTS trigger_update_likes_stats ON public.post_likes;
CREATE TRIGGER trigger_update_likes_stats
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Create function to auto-assign badges based on stats
CREATE OR REPLACE FUNCTION auto_assign_badges()
RETURNS TRIGGER AS $$
DECLARE
  new_badges TEXT[] := NEW.badges;
BEGIN
  -- Active Member: 10+ posts
  IF NEW.posts_count >= 10 AND NOT ('Active Member' = ANY(new_badges)) THEN
    new_badges := array_append(new_badges, 'Active Member');
  END IF;

  -- Helpful Parent: 20+ comments
  IF NEW.comments_count >= 20 AND NOT ('Helpful Parent' = ANY(new_badges)) THEN
    new_badges := array_append(new_badges, 'Helpful Parent');
  END IF;

  -- Top Contributor: 50+ likes received
  IF NEW.likes_received_count >= 50 AND NOT ('Top Contributor' = ANY(new_badges)) THEN
    new_badges := array_append(new_badges, 'Top Contributor');
  END IF;

  -- Rising Star: 10+ followers
  IF NEW.followers_count >= 10 AND NOT ('Rising Star' = ANY(new_badges)) THEN
    new_badges := array_append(new_badges, 'Rising Star');
  END IF;

  -- Community Leader: 100+ posts
  IF NEW.posts_count >= 100 AND NOT ('Community Leader' = ANY(new_badges)) THEN
    new_badges := array_append(new_badges, 'Community Leader');
  END IF;

  NEW.badges := new_badges;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-assigning badges
DROP TRIGGER IF EXISTS trigger_auto_assign_badges ON public.profiles;
CREATE TRIGGER trigger_auto_assign_badges
  BEFORE UPDATE OF posts_count, comments_count, likes_received_count, followers_count ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_badges();

-- ============================================================================
-- 5. ADVANCED SEARCH - Full-text search
-- ============================================================================

-- Add full-text search column
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'A');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector
DROP TRIGGER IF EXISTS trigger_update_search_vector ON public.community_posts;
CREATE TRIGGER trigger_update_search_vector
  BEFORE INSERT OR UPDATE OF content ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_community_posts_search
  ON public.community_posts USING GIN(search_vector);

-- Update existing posts with search vectors
UPDATE public.community_posts
SET search_vector = to_tsvector('english', COALESCE(content, ''))
WHERE search_vector IS NULL;

-- ============================================================================
-- 6. REAL-TIME NOTIFICATIONS
-- ============================================================================

-- Check if notifications table already exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'notifications'
  ) THEN
    CREATE TABLE public.notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      read BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
    );

    ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view own notifications"
      ON public.notifications FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update own notifications"
      ON public.notifications FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Add notification_type enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE public.notification_type AS ENUM (
      'like',     -- Someone liked your post
      'comment',  -- Someone commented on your post
      'reply',    -- Someone replied to your comment
      'mention',  -- Someone mentioned you
      'follow'    -- Someone followed you
    );
  END IF;
END $$;

-- Modify notifications table structure if it exists
DO $$
BEGIN
  -- Add type_enum column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'type_enum'
  ) THEN
    ALTER TABLE public.notifications
      ADD COLUMN type_enum public.notification_type;
  END IF;

  -- Add related_post_id for linking to posts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'related_post_id'
  ) THEN
    ALTER TABLE public.notifications
      ADD COLUMN related_post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE;
  END IF;

  -- Add related_comment_id for linking to comments
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'related_comment_id'
  ) THEN
    ALTER TABLE public.notifications
      ADD COLUMN related_comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE;
  END IF;

  -- Add actor_id (who triggered the notification)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'actor_id'
  ) THEN
    ALTER TABLE public.notifications
      ADD COLUMN actor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read
  ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON public.notifications(created_at DESC);

-- Create function to send notification
CREATE OR REPLACE FUNCTION send_notification(
  p_user_id UUID,
  p_type public.notification_type,
  p_title TEXT,
  p_message TEXT,
  p_actor_id UUID DEFAULT NULL,
  p_related_post_id UUID DEFAULT NULL,
  p_related_comment_id UUID DEFAULT NULL,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  -- Don't send notification to self
  IF p_user_id = p_actor_id THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.notifications (
    user_id,
    type_enum,
    title,
    message,
    actor_id,
    related_post_id,
    related_comment_id,
    link,
    read
  )
  VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_actor_id,
    p_related_post_id,
    p_related_comment_id,
    p_link,
    false
  )
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to notify on post like
CREATE OR REPLACE FUNCTION notify_on_post_like()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
  liker_name TEXT;
BEGIN
  -- Get post author
  SELECT user_id INTO post_author_id
  FROM public.community_posts
  WHERE id = NEW.post_id;

  -- Get liker name
  SELECT COALESCE(name, email) INTO liker_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Send notification
  PERFORM send_notification(
    post_author_id,
    'like'::public.notification_type,
    'New reaction on your post',
    liker_name || ' reacted to your post',
    NEW.user_id,
    NEW.post_id,
    NULL,
    '/community?post=' || NEW.post_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for post like notifications
DROP TRIGGER IF EXISTS trigger_notify_on_post_like ON public.post_likes;
CREATE TRIGGER trigger_notify_on_post_like
  AFTER INSERT ON public.post_likes
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_post_like();

-- Create function to notify on comment
CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
  parent_comment_author_id UUID;
  commenter_name TEXT;
BEGIN
  -- Get commenter name
  SELECT COALESCE(name, email) INTO commenter_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- If this is a reply to a comment
  IF NEW.parent_comment_id IS NOT NULL THEN
    -- Get parent comment author
    SELECT user_id INTO parent_comment_author_id
    FROM public.post_comments
    WHERE id = NEW.parent_comment_id;

    -- Notify parent comment author
    PERFORM send_notification(
      parent_comment_author_id,
      'reply'::public.notification_type,
      'New reply to your comment',
      commenter_name || ' replied to your comment',
      NEW.user_id,
      NEW.post_id,
      NEW.id,
      '/community?post=' || NEW.post_id
    );
  ELSE
    -- Get post author
    SELECT user_id INTO post_author_id
    FROM public.community_posts
    WHERE id = NEW.post_id;

    -- Notify post author
    PERFORM send_notification(
      post_author_id,
      'comment'::public.notification_type,
      'New comment on your post',
      commenter_name || ' commented on your post',
      NEW.user_id,
      NEW.post_id,
      NEW.id,
      '/community?post=' || NEW.post_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for comment notifications
DROP TRIGGER IF EXISTS trigger_notify_on_comment ON public.post_comments;
CREATE TRIGGER trigger_notify_on_comment
  AFTER INSERT ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_comment();

-- Create function to notify on follow
CREATE OR REPLACE FUNCTION notify_on_follow()
RETURNS TRIGGER AS $$
DECLARE
  follower_name TEXT;
BEGIN
  -- Get follower name
  SELECT COALESCE(name, email) INTO follower_name
  FROM public.profiles
  WHERE id = NEW.follower_id;

  -- Notify followed user
  PERFORM send_notification(
    NEW.following_id,
    'follow'::public.notification_type,
    'New follower',
    follower_name || ' started following you',
    NEW.follower_id,
    NULL,
    NULL,
    '/profile/' || NEW.follower_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for follow notifications
DROP TRIGGER IF EXISTS trigger_notify_on_follow ON public.user_followers;
CREATE TRIGGER trigger_notify_on_follow
  AFTER INSERT ON public.user_followers
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_follow();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT ALL ON public.user_followers TO authenticated;
GRANT ALL ON public.notifications TO authenticated;

-- ============================================================================
-- FINAL COMMENTS
-- ============================================================================

COMMENT ON TABLE public.user_followers IS 'Stores follower/following relationships between users';
COMMENT ON TABLE public.notifications IS 'Real-time notifications for community interactions';
COMMENT ON COLUMN public.community_posts.search_vector IS 'Full-text search vector for post content';
COMMENT ON COLUMN public.post_likes.reaction_type IS 'Type of reaction (like, love, strong, empathy, celebrate, insightful, helpful)';
COMMENT ON COLUMN public.post_comments.parent_comment_id IS 'Parent comment ID for nested replies (threads)';
COMMENT ON COLUMN public.profiles.badges IS 'Array of earned badges (Active Member, Helpful Parent, etc.)';

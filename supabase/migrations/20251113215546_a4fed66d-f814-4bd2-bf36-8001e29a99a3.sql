-- ============================================================================
-- FIX: Robust notifications to avoid NULL user_id and loops
-- ============================================================================

-- 1) Update send_notification to safely skip when recipient is NULL or self
CREATE OR REPLACE FUNCTION public.send_notification(
  p_user_id uuid,
  p_type public.notification_type,
  p_title text,
  p_message text,
  p_actor_id uuid DEFAULT NULL::uuid,
  p_related_post_id uuid DEFAULT NULL::uuid,
  p_related_comment_id uuid DEFAULT NULL::uuid,
  p_link text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  -- Skip if recipient is null
  IF p_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Skip self-notifications
  IF p_actor_id IS NOT NULL AND p_user_id = p_actor_id THEN
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
$$;

-- 2) Harden notify_on_post_like and notify_on_comment to avoid NULL targets
CREATE OR REPLACE FUNCTION public.notify_on_post_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post_author_id UUID;
  liker_name TEXT;
BEGIN
  -- Get post author
  SELECT user_id INTO post_author_id
  FROM public.community_posts
  WHERE id = NEW.post_id;

  -- If the post has no real author (e.g., seed post), skip
  IF post_author_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get liker name
  SELECT COALESCE(name, email) INTO liker_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Send notification
  PERFORM public.send_notification(
    post_author_id,
    'like'::public.notification_type,
    'New reaction on your post',
    COALESCE(liker_name, 'Someone') || ' reacted to your post',
    NEW.user_id,
    NEW.post_id,
    NULL,
    '/community?post=' || NEW.post_id
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post_author_id UUID;
  parent_comment_author_id UUID;
  commenter_name TEXT;
  target_user_id UUID;
BEGIN
  -- Get commenter name
  SELECT COALESCE(name, email) INTO commenter_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  IF NEW.parent_comment_id IS NOT NULL THEN
    SELECT user_id INTO parent_comment_author_id
    FROM public.post_comments
    WHERE id = NEW.parent_comment_id;
    target_user_id := parent_comment_author_id;
  ELSE
    SELECT user_id INTO post_author_id
    FROM public.community_posts
    WHERE id = NEW.post_id;
    target_user_id := post_author_id;
  END IF;

  -- If no valid target (e.g., seed post with null user), skip
  IF target_user_id IS NULL OR target_user_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  PERFORM public.send_notification(
    target_user_id,
    CASE WHEN NEW.parent_comment_id IS NOT NULL THEN 'reply'::public.notification_type ELSE 'comment'::public.notification_type END,
    CASE WHEN NEW.parent_comment_id IS NOT NULL THEN 'New reply to your comment' ELSE 'New comment on your post' END,
    COALESCE(commenter_name, 'Someone') || CASE WHEN NEW.parent_comment_id IS NOT NULL THEN ' replied to your comment' ELSE ' commented on your post' END,
    NEW.user_id,
    NEW.post_id,
    NEW.id,
    '/community?post=' || NEW.post_id
  );

  RETURN NEW;
END;
$$;

-- 3) Ensure triggers exist (idempotent creation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_notify_on_post_like'
  ) THEN
    CREATE TRIGGER trg_notify_on_post_like
    AFTER INSERT ON public.post_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_post_like();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_notify_on_comment'
  ) THEN
    CREATE TRIGGER trg_notify_on_comment
    AFTER INSERT ON public.post_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_comment();
  END IF;
END $$;

-- 4) Optional: REPLICA IDENTITY FULL for realtime stability
ALTER TABLE public.post_comments REPLICA IDENTITY FULL;
ALTER TABLE public.post_likes REPLICA IDENTITY FULL;

-- 5) Add publication for realtime (no-op if exists)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments, public.post_likes;
  EXCEPTION WHEN undefined_object THEN
    -- publication might already include tables; ignore
    NULL;
  END;
END $$;

-- End of patch

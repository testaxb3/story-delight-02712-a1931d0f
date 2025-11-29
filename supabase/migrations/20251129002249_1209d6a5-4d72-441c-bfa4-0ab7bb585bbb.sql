-- Add new notification types to enum
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'new_ebook';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'new_video';

-- Update CHECK constraint to include all types
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (
  type IN (
    'script_request', 'comment', 'like', 'reply', 'follow', 'new_content', 
    'system', 'refund_response', 'new_script', 'new_ebook', 'new_video',
    'admin_script_request', 'admin_refund_request'
  )
);

-- =====================================================
-- TRIGGER: Notify users when new SCRIPT is added
-- =====================================================
CREATE OR REPLACE FUNCTION public.notify_new_script()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only notify for published/active scripts
  PERFORM net.http_post(
    url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo'
    ),
    body := jsonb_build_object(
      'type', 'new_script',
      'target_profile', COALESCE(NEW.profile, 'ALL'),
      'title', '📝 New Script Available!',
      'message', '"' || NEW.title || '" - Perfect for ' || COALESCE(NEW.profile, 'all') || ' children',
      'data', jsonb_build_object(
        'script_id', NEW.id,
        'link', '/scripts/' || NEW.id
      )
    )
  );

  RETURN NEW;
END;
$$;

-- Create trigger for new scripts
DROP TRIGGER IF EXISTS on_new_script_notify ON scripts;
CREATE TRIGGER on_new_script_notify
  AFTER INSERT ON scripts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_script();

-- =====================================================
-- TRIGGER: Notify users when new EBOOK is added
-- =====================================================
CREATE OR REPLACE FUNCTION public.notify_new_ebook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Broadcast to all users
  PERFORM net.http_post(
    url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo'
    ),
    body := jsonb_build_object(
      'type', 'new_ebook',
      'target_profile', 'ALL',
      'title', '📚 New Ebook Available!',
      'message', '"' || NEW.title || '" - Start reading now',
      'data', jsonb_build_object(
        'ebook_id', NEW.id,
        'ebook_slug', NEW.slug,
        'link', '/ebooks/' || NEW.slug
      )
    )
  );

  RETURN NEW;
END;
$$;

-- Create trigger for new ebooks
DROP TRIGGER IF EXISTS on_new_ebook_notify ON ebooks;
CREATE TRIGGER on_new_ebook_notify
  AFTER INSERT ON ebooks
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_ebook();

-- =====================================================
-- TRIGGER: Notify users when new VIDEO is added
-- =====================================================
CREATE OR REPLACE FUNCTION public.notify_new_video()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Broadcast to all users
  PERFORM net.http_post(
    url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo'
    ),
    body := jsonb_build_object(
      'type', 'new_video',
      'target_profile', 'ALL',
      'title', '🎬 New Video Available!',
      'message', '"' || NEW.title || '" - Watch now',
      'data', jsonb_build_object(
        'video_id', NEW.id,
        'link', '/videos/' || NEW.id
      )
    )
  );

  RETURN NEW;
END;
$$;

-- Create trigger for new videos
DROP TRIGGER IF EXISTS on_new_video_notify ON videos;
CREATE TRIGGER on_new_video_notify
  AFTER INSERT ON videos
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_video();
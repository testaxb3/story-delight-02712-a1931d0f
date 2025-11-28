-- Enable pg_net extension for HTTP requests from database
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- =====================================================
-- TRIGGER 1: Notify when new script is created
-- =====================================================
CREATE OR REPLACE FUNCTION public.notify_new_script()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_profile_title TEXT;
BEGIN
  -- Only notify if script has a profile
  IF NEW.profile IS NOT NULL THEN
    v_profile_title := CASE NEW.profile
      WHEN 'INTENSE' THEN 'Intense'
      WHEN 'DISTRACTED' THEN 'Distracted'
      WHEN 'DEFIANT' THEN 'Defiant'
      ELSE NEW.profile
    END;
    
    PERFORM extensions.http_post(
      url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTcwNjYsImV4cCI6MjA2MTQzMzA2Nn0.eP1Kt9OEDM7mGBZFd9_CgiZBnCuLi53xsZ9yHKvV5W4'
      ),
      body := jsonb_build_object(
        'type', 'new_script',
        'target_profile', NEW.profile,
        'title', '🧠 New Script for ' || v_profile_title || ' Brain!',
        'message', '"' || LEFT(NEW.title, 50) || '" was just added!',
        'data', jsonb_build_object('script_id', NEW.id)
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on scripts table
DROP TRIGGER IF EXISTS trigger_notify_new_script ON scripts;
CREATE TRIGGER trigger_notify_new_script
AFTER INSERT ON scripts
FOR EACH ROW
EXECUTE FUNCTION notify_new_script();

-- =====================================================
-- TRIGGER 2: Notify user when admin responds to refund
-- =====================================================
CREATE OR REPLACE FUNCTION public.notify_refund_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Only notify if message is from admin
  IF NEW.sender_type = 'admin' THEN
    -- Get the user_id from refund_requests
    SELECT user_id INTO v_user_id
    FROM refund_requests
    WHERE id = NEW.refund_request_id;
    
    IF v_user_id IS NOT NULL THEN
      PERFORM extensions.http_post(
        url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTcwNjYsImV4cCI6MjA2MTQzMzA2Nn0.eP1Kt9OEDM7mGBZFd9_CgiZBnCuLi53xsZ9yHKvV5W4'
        ),
        body := jsonb_build_object(
          'type', 'refund_update',
          'target_user_id', v_user_id,
          'title', '💬 Refund Update',
          'message', 'You have a new message about your refund request'
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on refund_messages table
DROP TRIGGER IF EXISTS trigger_notify_refund_message ON refund_messages;
CREATE TRIGGER trigger_notify_refund_message
AFTER INSERT ON refund_messages
FOR EACH ROW
EXECUTE FUNCTION notify_refund_message();

-- =====================================================
-- FUNCTION: Get users who need tracker reminder
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_tracker_reminder_player_ids()
RETURNS TABLE(player_id text, user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ups.onesignal_player_id, ups.user_id
  FROM user_push_subscriptions ups
  WHERE ups.is_active = true
    -- User has not logged today
    AND NOT EXISTS (
      SELECT 1 FROM tracker_days td
      WHERE td.user_id = ups.user_id
        AND td.date = CURRENT_DATE
        AND td.completed = true
    )
    -- User has logged at least once (active user)
    AND EXISTS (
      SELECT 1 FROM tracker_days td
      WHERE td.user_id = ups.user_id
        AND td.completed = true
    );
END;
$$;
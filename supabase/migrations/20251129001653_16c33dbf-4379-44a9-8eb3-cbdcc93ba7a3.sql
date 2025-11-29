-- Fix: Change extensions.http_post to net.http_post
CREATE OR REPLACE FUNCTION public.notify_admin_script_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_record RECORD;
  requester_name TEXT;
BEGIN
  -- Get requester name
  SELECT COALESCE(name, email, 'A user') INTO requester_name
  FROM profiles WHERE id = NEW.user_id;

  -- Create in-app notification for each admin
  FOR admin_record IN SELECT id FROM profiles WHERE is_admin = true
  LOOP
    INSERT INTO notifications (user_id, type_enum, type, title, message, actor_id, link, read)
    VALUES (
      admin_record.id,
      'script_request',
      'script_request',
      '📝 New Script Request',
      requester_name || ' requested: ' || LEFT(NEW.situation_description, 60) || '...',
      NEW.user_id,
      '/admin/script-requests',
      false
    );
  END LOOP;

  -- FIXED: Use net.http_post instead of extensions.http_post
  PERFORM net.http_post(
    url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTcwNjYsImV4cCI6MjA2MTQzMzA2Nn0.eP1Kt9OEDM7mGBZFd9_CgiZBnCuLi53xsZ9yHKvV5W4'
    ),
    body := jsonb_build_object(
      'type', 'admin_script_request',
      'title', '📝 New Script Request',
      'message', requester_name || ' requested: ' || LEFT(NEW.situation_description, 60) || '...',
      'data', jsonb_build_object('request_id', NEW.id)
    )
  );

  RETURN NEW;
END;
$$;
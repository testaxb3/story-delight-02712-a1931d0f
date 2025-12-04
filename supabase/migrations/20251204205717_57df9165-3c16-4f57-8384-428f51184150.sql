-- Add new notification types to enum
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'script_request_update';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'admin_alert';

-- Update trigger to use correct type_enum and proper link
CREATE OR REPLACE FUNCTION notify_script_request_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_admin_ids UUID[];
BEGIN
  IF NEW.sender_type = 'admin' THEN
    -- Get user who owns the script request
    SELECT user_id INTO v_user_id FROM script_requests WHERE id = NEW.script_request_id;
    
    IF v_user_id IS NOT NULL THEN
      -- In-app notification to user
      INSERT INTO notifications (user_id, type, type_enum, title, message, link)
      VALUES (
        v_user_id, 
        'script_request_update', 
        'script_request_update'::notification_type,
        '📝 Script Request Update', 
        'You have a new message about your script request', 
        '/script-request-status'
      );

      -- Push notification to user
      PERFORM net.http_post(
        url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo'
        ),
        body := jsonb_build_object(
          'type', 'script_request_message',
          'target_user_id', v_user_id,
          'title', '📝 Script Request Update',
          'message', 'You have a new message about your script request',
          'data', jsonb_build_object('link', '/script-request-status')
        )
      );
    END IF;
  ELSIF NEW.sender_type = 'user' THEN
    -- Notify all admins when user sends message
    INSERT INTO notifications (user_id, type, type_enum, title, message, link)
    SELECT id, 'admin_alert', 'admin_alert'::notification_type, '💬 New Script Request Message', 
           'A user sent a message about their script request', '/admin'
    FROM profiles WHERE is_admin = true;

    -- Push to admins
    PERFORM net.http_post(
      url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo'
      ),
      body := jsonb_build_object(
        'type', 'admin_script_request_message',
        'title', '💬 New Script Request Message',
        'message', 'A user sent a message about their script request',
        'data', jsonb_build_object('link', '/admin')
      )
    );
  END IF;
  RETURN NEW;
END;
$$;
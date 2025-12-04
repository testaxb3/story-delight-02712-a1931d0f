-- Fix notify_admin_refund_request to include push notification
CREATE OR REPLACE FUNCTION public.notify_admin_refund_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_admin_ids UUID[];
  v_admin_id UUID;
BEGIN
  -- Get all admin IDs
  SELECT ARRAY_AGG(id) INTO v_admin_ids
  FROM profiles
  WHERE is_admin = true;

  -- Create in-app notification for each admin
  IF v_admin_ids IS NOT NULL THEN
    FOREACH v_admin_id IN ARRAY v_admin_ids
    LOOP
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        v_admin_id,
        'admin_alert',
        '💰 New Refund Request',
        'A customer has requested a refund: ' || NEW.customer_name,
        '/admin?tab=refunds'
      );
    END LOOP;
  END IF;

  -- Send push notification to admins
  PERFORM net.http_post(
    url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo'
    ),
    body := jsonb_build_object(
      'type', 'admin_refund_request',
      'title', '💰 New Refund Request',
      'message', 'A customer has requested a refund: ' || NEW.customer_name,
      'data', jsonb_build_object(
        'refund_id', NEW.id,
        'link', '/admin?tab=refunds'
      )
    )
  );

  RETURN NEW;
END;
$function$;

-- Fix notify_refund_message to use correct net.http_post namespace
CREATE OR REPLACE FUNCTION public.notify_refund_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
      -- Create in-app notification
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        v_user_id,
        'refund_update',
        '💬 Refund Update',
        'You have a new message about your refund request',
        '/refund-status'
      );

      -- Send push notification using correct namespace
      PERFORM net.http_post(
        url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo'
        ),
        body := jsonb_build_object(
          'type', 'refund_update',
          'target_user_id', v_user_id,
          'title', '💬 Refund Update',
          'message', 'You have a new message about your refund request',
          'data', jsonb_build_object(
            'refund_id', NEW.refund_request_id,
            'link', '/refund-status'
          )
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Create function to notify user when script request is updated
CREATE OR REPLACE FUNCTION public.notify_script_request_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only notify if status changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Create in-app notification
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      NEW.user_id,
      'script_request_update',
      '📝 Script Request Update',
      CASE NEW.status
        WHEN 'in_review' THEN 'Your script request is now being reviewed!'
        WHEN 'completed' THEN 'Great news! Your requested script has been created!'
        WHEN 'rejected' THEN 'Your script request has been reviewed. Check for details.'
        ELSE 'Your script request status has been updated.'
      END,
      '/request-script'
    );

    -- Send push notification
    PERFORM net.http_post(
      url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo'
      ),
      body := jsonb_build_object(
        'type', 'script_request_update',
        'target_user_id', NEW.user_id,
        'title', '📝 Script Request Update',
        'message', CASE NEW.status
          WHEN 'in_review' THEN 'Your script request is now being reviewed!'
          WHEN 'completed' THEN 'Great news! Your requested script has been created!'
          WHEN 'rejected' THEN 'Your script request has been reviewed.'
          ELSE 'Your script request status has been updated.'
        END,
        'data', jsonb_build_object(
          'request_id', NEW.id,
          'status', NEW.status,
          'link', '/request-script'
        )
      )
    );
  END IF;

  RETURN NEW;
END;
$function$;

-- Create trigger for script request updates (if not exists)
DROP TRIGGER IF EXISTS on_script_request_update ON script_requests;
CREATE TRIGGER on_script_request_update
  AFTER UPDATE ON script_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_script_request_update();

-- Ensure trigger exists for refund requests
DROP TRIGGER IF EXISTS on_refund_request_created ON refund_requests;
CREATE TRIGGER on_refund_request_created
  AFTER INSERT ON refund_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_refund_request();
-- Add new notification types to enum
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'script_request';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'refund_request';

-- Create function to get admin player IDs for push notifications
CREATE OR REPLACE FUNCTION get_admin_player_ids()
RETURNS TABLE(player_id text, user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT ups.onesignal_player_id, ups.user_id
  FROM user_push_subscriptions ups
  INNER JOIN profiles p ON p.id = ups.user_id
  WHERE p.is_admin = true AND ups.is_active = true;
END;
$$;

-- Trigger function to notify admins of new script requests
CREATE OR REPLACE FUNCTION notify_admin_script_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  RETURN NEW;
END;
$$;

-- Trigger function to notify admins of new refund requests
CREATE OR REPLACE FUNCTION notify_admin_refund_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Create in-app notification for each admin
  FOR admin_record IN SELECT id FROM profiles WHERE is_admin = true
  LOOP
    INSERT INTO notifications (user_id, type_enum, type, title, message, actor_id, link, read)
    VALUES (
      admin_record.id,
      'refund_request',
      'refund_request',
      '💰 New Refund Request',
      NEW.customer_name || ' - Reason: ' || NEW.reason_type,
      NEW.user_id,
      '/admin/refunds',
      false
    );
  END LOOP;

  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS on_script_request_created ON script_requests;
CREATE TRIGGER on_script_request_created
  AFTER INSERT ON script_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_script_request();

DROP TRIGGER IF EXISTS on_refund_request_created ON refund_requests;
CREATE TRIGGER on_refund_request_created
  AFTER INSERT ON refund_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_refund_request();
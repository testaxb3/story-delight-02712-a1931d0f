-- Create script_request_messages table
CREATE TABLE public.script_request_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  script_request_id UUID NOT NULL REFERENCES public.script_requests(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'user')),
  sender_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.script_request_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages for their requests
CREATE POLICY "Users can view messages for their requests"
  ON public.script_request_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.script_requests sr 
      WHERE sr.id = script_request_id AND sr.user_id = auth.uid()
    )
    OR is_current_user_admin()
  );

-- Users can insert messages for their own requests
CREATE POLICY "Users can insert messages for their requests"
  ON public.script_request_messages FOR INSERT
  WITH CHECK (
    sender_type = 'user' AND sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.script_requests sr 
      WHERE sr.id = script_request_id AND sr.user_id = auth.uid()
    )
  );

-- Admins can insert messages
CREATE POLICY "Admins can insert messages"
  ON public.script_request_messages FOR INSERT
  WITH CHECK (is_current_user_admin() AND sender_type = 'admin');

-- Users and admins can update read status
CREATE POLICY "Users and admins can update read status"
  ON public.script_request_messages FOR UPDATE
  USING (
    is_current_user_admin() OR EXISTS (
      SELECT 1 FROM public.script_requests sr 
      WHERE sr.id = script_request_id AND sr.user_id = auth.uid()
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.script_request_messages;

-- Create notification trigger for script request messages
CREATE OR REPLACE FUNCTION public.notify_script_request_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_user_name TEXT;
BEGIN
  IF NEW.sender_type = 'admin' THEN
    -- Get user_id from the script request
    SELECT user_id INTO v_user_id FROM script_requests WHERE id = NEW.script_request_id;
    
    IF v_user_id IS NOT NULL THEN
      -- In-app notification for user
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        v_user_id,
        'script_request_update',
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
    -- Get user name for notification
    SELECT COALESCE(name, email) INTO v_user_name FROM profiles WHERE id = NEW.sender_id;
    
    -- In-app notification for all admins
    INSERT INTO notifications (user_id, type, title, message, link)
    SELECT id, 'admin_alert', '💬 New Script Request Message', 
           COALESCE(v_user_name, 'A user') || ' sent a message about their script request', '/admin'
    FROM profiles WHERE is_admin = true;

    -- Push notification to admins
    PERFORM net.http_post(
      url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo'
      ),
      body := jsonb_build_object(
        'type', 'admin_script_request_message',
        'title', '💬 New Script Request Message',
        'message', COALESCE(v_user_name, 'A user') || ' sent a message about their script request',
        'data', jsonb_build_object('link', '/admin')
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_script_request_message_created
  AFTER INSERT ON public.script_request_messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_script_request_message();
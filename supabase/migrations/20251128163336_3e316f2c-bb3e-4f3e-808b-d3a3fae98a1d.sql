-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- Grant usage to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule daily tracker reminder at 6PM UTC
SELECT cron.schedule(
  'tracker-daily-reminder',
  '0 18 * * *',
  $$
  SELECT extensions.http_post(
    url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTcwNjYsImV4cCI6MjA2MTQzMzA2Nn0.eP1Kt9OEDM7mGBZFd9_CgiZBnCuLi53xsZ9yHKvV5W4"}'::jsonb,
    body := '{"type": "tracker_reminder", "title": "📊 Don''t Break Your Streak!", "message": "Log today''s progress to keep your streak going!"}'::jsonb
  );
  $$
);
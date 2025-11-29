-- Create cron job for tracker daily reminder using pg_net
SELECT cron.schedule(
  'tracker-daily-reminder',
  '0 18 * * *',
  $$
  SELECT net.http_post(
    url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/send-push-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo"}'::jsonb,
    body := '{"type": "tracker_reminder", "title": "📊 Don''t Break Your Streak!", "message": "Log today''s progress to keep your streak going!"}'::jsonb
  );
  $$
);
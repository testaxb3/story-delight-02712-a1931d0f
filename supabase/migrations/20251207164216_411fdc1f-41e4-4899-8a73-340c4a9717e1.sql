
-- Schedule daily reminder cron job at 14:00 UTC (morning for US customers)
SELECT cron.schedule(
  'send-account-reminders',
  '0 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/reminder-uncreated-accounts',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

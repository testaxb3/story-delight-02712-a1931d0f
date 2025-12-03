-- Schedule quiz re-engagement job to run every 6 hours
-- This checks for users who created accounts but haven't completed the quiz after 24h
SELECT cron.schedule(
  'quiz-reengagement-24h',
  '0 */6 * * *', -- At minute 0 past every 6th hour (00:00, 06:00, 12:00, 18:00 UTC)
  $$
  SELECT net.http_post(
    url := 'https://iogceaotdodvugrmogpp.supabase.co/functions/v1/quiz-reengagement',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo"}'::jsonb,
    body := '{"type": "24h"}'::jsonb
  ) AS request_id;
  $$
);
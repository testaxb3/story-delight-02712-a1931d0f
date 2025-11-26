-- Fix tracker_days dates: Calculate sequential dates based on each user's earliest created_at
WITH user_start_dates AS (
  SELECT 
    user_id,
    MIN(created_at)::date as start_date
  FROM tracker_days
  GROUP BY user_id
)
UPDATE tracker_days td
SET 
  date = (usd.start_date + (td.day_number - 1))::date,
  updated_at = NOW()
FROM user_start_dates usd
WHERE td.user_id = usd.user_id;
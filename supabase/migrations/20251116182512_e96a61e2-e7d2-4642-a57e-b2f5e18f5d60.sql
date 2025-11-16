-- Create optimized dashboard stats view
-- Aggregates all dashboard queries into a single efficient view
CREATE OR REPLACE VIEW dashboard_stats AS
WITH user_data AS (
  SELECT 
    p.id as user_id,
    p.premium,
    p.brain_profile
  FROM profiles p
),
tracker_summary AS (
  SELECT 
    user_id,
    AVG(stress_level) as avg_stress,
    COUNT(*) FILTER (WHERE completed = true) as total_entries,
    -- Count meltdowns in first 7 days
    COUNT(*) FILTER (
      WHERE meltdown_count IN ('1', '2', '3+') 
      AND day_number <= 7
    ) as meltdowns_before,
    -- Count meltdowns after day 7
    COUNT(*) FILTER (
      WHERE meltdown_count IN ('1', '2', '3+') 
      AND day_number > 7
    ) as meltdowns_after
  FROM tracker_days
  WHERE completed = true
  GROUP BY user_id
),
scripts_usage_count AS (
  SELECT 
    user_id,
    COUNT(DISTINCT script_id) as unique_scripts_used,
    COUNT(*) as total_script_uses
  FROM scripts_usage
  GROUP BY user_id
),
content_totals AS (
  SELECT 
    (SELECT COUNT(*) FROM scripts) as total_scripts,
    (SELECT COUNT(*) FROM videos) as total_videos,
    (SELECT COUNT(*) FROM pdfs) as total_pdfs
),
today_stats AS (
  SELECT 
    COUNT(DISTINCT su.user_id) as scripts_today_count,
    COUNT(*) as script_uses_today
  FROM scripts_usage su
  WHERE su.used_at >= CURRENT_DATE
),
week_stats AS (
  SELECT 
    COUNT(DISTINCT su.user_id) as active_users_week,
    COUNT(*) as script_uses_week
  FROM scripts_usage su
  WHERE su.used_at >= CURRENT_DATE - INTERVAL '7 days'
),
community_stats AS (
  SELECT 
    COUNT(*) as posts_this_week
  FROM community_posts
  WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
)
SELECT 
  ud.user_id,
  -- Tracker summary
  COALESCE(ts.avg_stress, 0) as average_stress,
  COALESCE(ts.total_entries, 0) as total_tracker_entries,
  COALESCE(ts.meltdowns_before, 0) as meltdowns_before_day_7,
  COALESCE(ts.meltdowns_after, 0) as meltdowns_after_day_7,
  -- Scripts usage
  COALESCE(suc.unique_scripts_used, 0) as unique_scripts_used,
  COALESCE(suc.total_script_uses, 0) as total_script_uses,
  -- Content counts (same for all users)
  ct.total_scripts,
  ct.total_videos,
  ct.total_pdfs,
  -- Today stats (same for all users)
  tds.scripts_today_count,
  tds.script_uses_today,
  -- Week stats (same for all users)
  ws.active_users_week,
  ws.script_uses_week,
  -- Community stats (same for all users)
  cs.posts_this_week
FROM user_data ud
CROSS JOIN content_totals ct
CROSS JOIN today_stats tds
CROSS JOIN week_stats ws
CROSS JOIN community_stats cs
LEFT JOIN tracker_summary ts ON ud.user_id = ts.user_id
LEFT JOIN scripts_usage_count suc ON ud.user_id = suc.user_id;

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_scripts_usage_user_date ON scripts_usage(user_id, used_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracker_days_user_completed ON tracker_days(user_id, completed) WHERE completed = true;

-- Grant access to authenticated users
GRANT SELECT ON dashboard_stats TO authenticated;
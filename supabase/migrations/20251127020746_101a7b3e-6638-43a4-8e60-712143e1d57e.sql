-- Fix streak calculation to use completed_at instead of programmatic date
-- This ensures streak reflects real engagement, not programmatic date values

-- First, ensure all completed tracker_days have completed_at populated
UPDATE tracker_days
SET completed_at = (date::timestamp + interval '12 hours')
WHERE completed = true 
  AND completed_at IS NULL;

-- Drop dependent views with CASCADE
DROP VIEW IF EXISTS leaderboard_cache CASCADE;
DROP VIEW IF EXISTS user_achievements_stats CASCADE;

-- Recreate user_achievements_stats with corrected streak calculation using completed_at
CREATE VIEW user_achievements_stats AS
WITH streak_data AS (
  SELECT 
    user_id,
    child_profile_id,
    DATE(completed_at) as completion_date,
    completed,
    ROW_NUMBER() OVER (PARTITION BY user_id, child_profile_id ORDER BY DATE(completed_at) DESC) as row_num,
    DATE(completed_at) - (ROW_NUMBER() OVER (PARTITION BY user_id, child_profile_id ORDER BY DATE(completed_at) DESC))::integer as date_group
  FROM tracker_days
  WHERE completed = true 
    AND completed_at IS NOT NULL
),
current_streak_calc AS (
  SELECT 
    user_id,
    child_profile_id,
    COUNT(*) as current_streak
  FROM streak_data
  WHERE date_group = (
    SELECT date_group 
    FROM streak_data sd2 
    WHERE sd2.user_id = streak_data.user_id 
      AND sd2.child_profile_id = streak_data.child_profile_id
      AND sd2.row_num = 1
  )
  AND completion_date >= CURRENT_DATE - interval '30 days'
  GROUP BY user_id, child_profile_id
),
longest_streak_calc AS (
  SELECT 
    user_id,
    child_profile_id,
    MAX(streak_count) as longest_streak
  FROM (
    SELECT 
      user_id,
      child_profile_id,
      date_group,
      COUNT(*) as streak_count
    FROM streak_data
    GROUP BY user_id, child_profile_id, date_group
  ) grouped_streaks
  GROUP BY user_id, child_profile_id
),
user_stats AS (
  SELECT 
    td.user_id,
    td.child_profile_id,
    COUNT(DISTINCT CASE WHEN td.completed THEN td.id END) as days_completed,
    COUNT(DISTINCT su.id) as scripts_used,
    COUNT(DISTINCT CASE WHEN vp.completed THEN vp.video_id END) as videos_watched,
    COUNT(DISTINCT cp.id) as posts_created
  FROM tracker_days td
  LEFT JOIN script_usage su ON su.user_id = td.user_id
  LEFT JOIN video_progress vp ON vp.user_id = td.user_id
  LEFT JOIN community_posts cp ON cp.user_id = td.user_id AND cp.is_seed_post = false
  GROUP BY td.user_id, td.child_profile_id
)
SELECT 
  us.user_id,
  us.child_profile_id,
  COALESCE(csc.current_streak, 0) as current_streak,
  COALESCE(lsc.longest_streak, 0) as longest_streak,
  us.days_completed,
  us.scripts_used,
  us.videos_watched,
  us.posts_created
FROM user_stats us
LEFT JOIN current_streak_calc csc ON csc.user_id = us.user_id AND csc.child_profile_id = us.child_profile_id
LEFT JOIN longest_streak_calc lsc ON lsc.user_id = us.user_id AND lsc.child_profile_id = us.child_profile_id;

-- Recreate leaderboard_cache view
CREATE VIEW leaderboard_cache AS
SELECT 
  p.id,
  p.name,
  p.username,
  p.photo_url,
  p.brain_profile,
  COALESCE(uas.current_streak, 0) as current_streak,
  COALESCE(uas.longest_streak, 0) as longest_streak,
  COALESCE(uas.days_completed, 0) as days_completed,
  COALESCE(uas.scripts_used, 0) as scripts_used,
  p.created_at
FROM profiles p
LEFT JOIN user_achievements_stats uas ON uas.user_id = p.id
WHERE p.is_admin = false
ORDER BY uas.current_streak DESC NULLS LAST, p.created_at ASC;
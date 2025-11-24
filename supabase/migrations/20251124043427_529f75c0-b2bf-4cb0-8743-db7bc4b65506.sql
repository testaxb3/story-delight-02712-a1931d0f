-- Drop and recreate user_achievements_stats view with proper streak calculation
DROP VIEW IF EXISTS user_achievements_stats CASCADE;

CREATE VIEW user_achievements_stats AS
WITH user_data AS (
  SELECT 
    p.id as user_id,
    COUNT(DISTINCT td.id) FILTER (WHERE td.completed = true) as days_completed,
    COUNT(DISTINCT su.script_id) as scripts_used,
    COUNT(DISTINCT vp.video_id) FILTER (WHERE vp.completed = true) as videos_watched,
    COUNT(DISTINCT cp.id) FILTER (WHERE cp.is_seed_post = false) as posts_created,
    COUNT(DISTINCT pl.id) FILTER (WHERE pl.user_id != p.id) as reactions_received,
    COUNT(DISTINCT CASE 
      WHEN EXTRACT(HOUR FROM td.created_at) >= 22 OR EXTRACT(HOUR FROM td.created_at) <= 4 
      THEN td.id 
    END) as night_logs,
    COUNT(DISTINCT CASE 
      WHEN EXTRACT(HOUR FROM td.created_at) >= 5 AND EXTRACT(HOUR FROM td.created_at) <= 9 
      THEN td.id 
    END) as morning_logs
  FROM profiles p
  LEFT JOIN tracker_days td ON td.user_id = p.id
  LEFT JOIN scripts_usage su ON su.user_id = p.id
  LEFT JOIN video_progress vp ON vp.user_id = p.id
  LEFT JOIN community_posts cp ON cp.user_id = p.id
  LEFT JOIN post_likes pl ON pl.post_id IN (SELECT id FROM community_posts WHERE user_id = p.id)
  GROUP BY p.id
),
streak_data AS (
  SELECT 
    user_id,
    date,
    completed,
    LAG(date) OVER (PARTITION BY user_id ORDER BY date) as prev_date
  FROM tracker_days
  WHERE completed = true
  ORDER BY user_id, date DESC
),
streak_calc AS (
  SELECT 
    user_id,
    date,
    CASE 
      WHEN prev_date IS NULL THEN 1
      WHEN date - prev_date = 1 THEN 0
      ELSE 1
    END as is_break
  FROM streak_data
),
user_streaks AS (
  SELECT 
    user_id,
    SUM(is_break) OVER (PARTITION BY user_id ORDER BY date DESC) as streak_group,
    date
  FROM streak_calc
),
current_streaks AS (
  SELECT 
    user_id,
    COUNT(*) as current_streak
  FROM user_streaks
  WHERE streak_group = 0
  GROUP BY user_id
),
longest_streaks AS (
  SELECT 
    user_id,
    MAX(streak_length) as longest_streak
  FROM (
    SELECT 
      user_id,
      streak_group,
      COUNT(*) as streak_length
    FROM user_streaks
    GROUP BY user_id, streak_group
  ) streak_lengths
  GROUP BY user_id
)
SELECT 
  ud.user_id,
  ud.days_completed,
  ud.scripts_used,
  ud.videos_watched,
  ud.posts_created,
  ud.reactions_received,
  ud.night_logs,
  ud.morning_logs,
  COALESCE(cs.current_streak, 0) as current_streak,
  COALESCE(ls.longest_streak, 0) as longest_streak
FROM user_data ud
LEFT JOIN current_streaks cs ON cs.user_id = ud.user_id
LEFT JOIN longest_streaks ls ON ls.user_id = ud.user_id;
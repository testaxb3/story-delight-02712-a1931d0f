-- Fix current_streak calculation in user_achievements_stats view
-- Issue: "completion_date - row_number()" formula doesn't work for DESC ordering
-- Solution: Use LAG and SUM to explicitly detect streak breaks

DROP VIEW IF EXISTS leaderboard_cache CASCADE;
DROP VIEW IF EXISTS user_achievements_stats CASCADE;

-- Recreate user_achievements_stats with fixed current_streak logic
CREATE VIEW user_achievements_stats AS
WITH streak_data AS (
  SELECT 
    user_id,
    child_profile_id,
    date(completed_at) AS completion_date,
    row_number() OVER (
      PARTITION BY user_id, child_profile_id 
      ORDER BY date(completed_at) DESC
    ) AS rn
  FROM tracker_days
  WHERE completed = true 
    AND completed_at IS NOT NULL
),
ordered_days AS (
  SELECT 
    user_id,
    child_profile_id,
    completion_date,
    LAG(completion_date) OVER (
      PARTITION BY user_id, child_profile_id 
      ORDER BY completion_date DESC
    ) AS prev_date
  FROM streak_data
),
streak_breaks AS (
  SELECT 
    *,
    SUM(CASE 
      WHEN prev_date IS NULL THEN 0
      WHEN prev_date - completion_date = 1 THEN 0  -- consecutive day
      ELSE 1  -- streak break
    END) OVER (
      PARTITION BY user_id, child_profile_id 
      ORDER BY completion_date DESC
    ) AS streak_group
  FROM ordered_days
),
current_streak_calc AS (
  SELECT 
    user_id,
    child_profile_id,
    COUNT(*) AS current_streak
  FROM streak_breaks
  WHERE streak_group = 0  -- only current streak (first group)
    AND completion_date >= CURRENT_DATE - INTERVAL '1 day'  -- streak still valid
  GROUP BY user_id, child_profile_id
),
longest_streak_calc AS (
  SELECT 
    user_id,
    child_profile_id,
    MAX(streak_length) AS longest_streak
  FROM (
    SELECT 
      user_id,
      child_profile_id,
      streak_group,
      COUNT(*) AS streak_length
    FROM (
      SELECT 
        user_id,
        child_profile_id,
        completion_date,
        completion_date - row_number() OVER (
          PARTITION BY user_id, child_profile_id 
          ORDER BY completion_date
        )::integer AS streak_group
      FROM streak_data
    ) t
    GROUP BY user_id, child_profile_id, streak_group
  ) streaks
  GROUP BY user_id, child_profile_id
),
user_stats AS (
  SELECT 
    td.user_id,
    td.child_profile_id,
    COUNT(DISTINCT CASE WHEN td.completed THEN td.id ELSE NULL END) AS days_completed,
    COUNT(DISTINCT su.script_id) AS scripts_used,
    COUNT(DISTINCT CASE WHEN vp.completed THEN vp.video_id ELSE NULL END) AS videos_watched,
    COUNT(DISTINCT cp.id) AS posts_created,
    0 AS reactions_received,
    0 AS badges_unlocked
  FROM tracker_days td
  LEFT JOIN script_usage su ON su.user_id = td.user_id
  LEFT JOIN video_progress vp ON vp.user_id = td.user_id
  LEFT JOIN community_posts cp ON cp.user_id = td.user_id
  WHERE td.child_profile_id IS NOT NULL
  GROUP BY td.user_id, td.child_profile_id
)
SELECT 
  us.user_id,
  us.child_profile_id,
  COALESCE(csc.current_streak, 0) AS current_streak,
  COALESCE(lsc.longest_streak, 0) AS longest_streak,
  us.days_completed,
  us.scripts_used,
  us.videos_watched,
  us.posts_created,
  us.reactions_received,
  us.badges_unlocked
FROM user_stats us
LEFT JOIN current_streak_calc csc 
  ON csc.user_id = us.user_id AND csc.child_profile_id = us.child_profile_id
LEFT JOIN longest_streak_calc lsc 
  ON lsc.user_id = us.user_id AND lsc.child_profile_id = us.child_profile_id;

-- Recreate leaderboard_cache view
CREATE VIEW leaderboard_cache AS
SELECT 
  p.id,
  p.name,
  p.username,
  p.photo_url,
  p.brain_profile,
  uas.current_streak,
  uas.longest_streak,
  uas.days_completed,
  uas.scripts_used,
  uas.videos_watched,
  uas.posts_created,
  p.posts_count,
  p.likes_received_count,
  p.comments_count
FROM profiles p
LEFT JOIN user_achievements_stats uas ON p.id = uas.user_id
WHERE p.quiz_completed = true;
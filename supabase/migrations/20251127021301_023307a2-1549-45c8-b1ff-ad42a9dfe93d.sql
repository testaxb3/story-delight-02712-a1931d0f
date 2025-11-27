-- Fix streak logic to not penalize for not logging today yet
-- The current logic breaks streak if user hasn't logged today, which is incorrect
-- Streak should be maintained if user logged yesterday

DROP VIEW IF EXISTS user_achievements_stats CASCADE;

CREATE VIEW user_achievements_stats AS
WITH streak_data AS (
  SELECT 
    user_id,
    child_profile_id,
    DATE(completed_at) as completion_date,
    ROW_NUMBER() OVER (PARTITION BY user_id, child_profile_id ORDER BY DATE(completed_at) DESC) as rn
  FROM tracker_days
  WHERE completed = true AND completed_at IS NOT NULL
),
current_streak_calc AS (
  SELECT 
    user_id,
    child_profile_id,
    COUNT(*) as current_streak
  FROM (
    SELECT 
      user_id,
      child_profile_id,
      completion_date,
      completion_date - (ROW_NUMBER() OVER (PARTITION BY user_id, child_profile_id ORDER BY completion_date DESC))::integer as grp
    FROM streak_data
    WHERE 
      -- Include if completed today OR yesterday (don't penalize for not logging today yet)
      completion_date >= CURRENT_DATE - INTERVAL '1 day'
      OR (
        -- Or if it's part of consecutive sequence from yesterday backwards
        completion_date <= CURRENT_DATE - INTERVAL '1 day'
        AND completion_date >= (
          SELECT MIN(sd.completion_date)
          FROM streak_data sd
          WHERE sd.user_id = streak_data.user_id
            AND sd.child_profile_id = streak_data.child_profile_id
            AND sd.completion_date >= CURRENT_DATE - INTERVAL '1 day'
        ) - INTERVAL '100 days'
      )
  ) t
  WHERE grp = (
    SELECT MIN(grp2)
    FROM (
      SELECT 
        completion_date - (ROW_NUMBER() OVER (PARTITION BY user_id, child_profile_id ORDER BY completion_date DESC))::integer as grp2
      FROM streak_data sd2
      WHERE sd2.user_id = t.user_id 
        AND sd2.child_profile_id = t.child_profile_id
        AND sd2.completion_date >= CURRENT_DATE - INTERVAL '1 day'
    ) sub
  )
  GROUP BY user_id, child_profile_id, grp
),
longest_streak_calc AS (
  SELECT 
    user_id,
    child_profile_id,
    MAX(streak_length) as longest_streak
  FROM (
    SELECT 
      user_id,
      child_profile_id,
      COUNT(*) as streak_length
    FROM (
      SELECT 
        user_id,
        child_profile_id,
        completion_date,
        completion_date - (ROW_NUMBER() OVER (PARTITION BY user_id, child_profile_id ORDER BY completion_date))::integer as grp
      FROM streak_data
    ) t
    GROUP BY user_id, child_profile_id, grp
  ) streaks
  GROUP BY user_id, child_profile_id
),
user_stats AS (
  SELECT 
    td.user_id,
    td.child_profile_id,
    COUNT(DISTINCT CASE WHEN td.completed THEN td.id END) as days_completed,
    COUNT(DISTINCT su.script_id) as scripts_used,
    COUNT(DISTINCT CASE WHEN vp.completed THEN vp.video_id END) as videos_watched,
    COUNT(DISTINCT cp.id) as posts_created,
    0 as reactions_received,
    0 as badges_unlocked
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
  COALESCE(csc.current_streak, 0) as current_streak,
  COALESCE(lsc.longest_streak, 0) as longest_streak,
  us.days_completed,
  us.scripts_used,
  us.videos_watched,
  us.posts_created,
  us.reactions_received,
  us.badges_unlocked
FROM user_stats us
LEFT JOIN current_streak_calc csc ON csc.user_id = us.user_id AND csc.child_profile_id = us.child_profile_id
LEFT JOIN longest_streak_calc lsc ON lsc.user_id = us.user_id AND lsc.child_profile_id = us.child_profile_id;

-- Recreate dependent view
DROP VIEW IF EXISTS leaderboard_cache;

CREATE VIEW leaderboard_cache AS
SELECT 
  p.id,
  p.name,
  p.photo_url,
  p.brain_profile,
  COALESCE(uas.current_streak, 0) as current_streak,
  COALESCE(uas.longest_streak, 0) as longest_streak,
  COALESCE(uas.days_completed, 0) as days_completed,
  COALESCE(uas.scripts_used, 0) as scripts_used,
  p.posts_count,
  p.likes_received_count
FROM profiles p
LEFT JOIN user_achievements_stats uas ON uas.user_id = p.id
WHERE p.premium = true
ORDER BY uas.current_streak DESC NULLS LAST, uas.longest_streak DESC NULLS LAST
LIMIT 100;
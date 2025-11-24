-- Fix streak calculation in user_achievements_stats view
-- The current implementation calls calculate_user_streak twice per user which is inefficient
-- and may be causing the streak values to return 0

-- Drop the old view
DROP VIEW IF EXISTS user_achievements_stats CASCADE;

-- Create an improved view with better streak calculation
CREATE OR REPLACE VIEW user_achievements_stats AS
WITH streak_calc AS (
  SELECT 
    p.id as user_id,
    COALESCE(s.current_streak, 0) as current_streak,
    COALESCE(s.longest_streak, 0) as longest_streak
  FROM profiles p
  LEFT JOIN LATERAL (
    SELECT 
      current_streak,
      longest_streak
    FROM calculate_user_streak(p.id)
  ) s ON true
)
SELECT 
  p.id as user_id,
  
  -- Streak stats from CTE
  COALESCE(sc.current_streak, 0) as current_streak,
  COALESCE(sc.longest_streak, 0) as longest_streak,
  
  -- Days completed
  COALESCE(COUNT(DISTINCT CASE WHEN td.completed = true THEN td.date END), 0) as days_completed,
  
  -- Scripts used (distinct scripts)
  COALESCE(COUNT(DISTINCT su.script_id), 0) as scripts_used,
  
  -- Videos watched (distinct videos completed)
  COALESCE(COUNT(DISTINCT CASE WHEN vp.completed = true THEN vp.video_id END), 0) as videos_watched,
  
  -- Community posts
  COALESCE(COUNT(DISTINCT cp.id), 0) as posts_created,
  
  -- Reactions received on posts
  COALESCE(COUNT(DISTINCT pl.id), 0) as reactions_received,
  
  -- Badges unlocked
  COALESCE(COUNT(DISTINCT ub.badge_id), 0) as badges_unlocked,
  
  -- Special tracking for time-based achievements
  COALESCE(COUNT(DISTINCT CASE 
    WHEN EXTRACT(HOUR FROM td.completed_at) >= 0 AND EXTRACT(HOUR FROM td.completed_at) < 8 
    THEN td.date 
  END), 0) as morning_logs,
  
  COALESCE(COUNT(DISTINCT CASE 
    WHEN EXTRACT(HOUR FROM td.completed_at) >= 0 AND EXTRACT(HOUR FROM td.completed_at) < 6 
    THEN td.date 
  END), 0) as night_logs

FROM profiles p
LEFT JOIN streak_calc sc ON sc.user_id = p.id
LEFT JOIN tracker_days td ON td.user_id = p.id
LEFT JOIN script_usage su ON su.user_id = p.id
LEFT JOIN video_progress vp ON vp.user_id = p.id
LEFT JOIN community_posts cp ON cp.user_id = p.id
LEFT JOIN post_likes pl ON pl.post_id = cp.id
LEFT JOIN user_badges ub ON ub.user_id = p.id

GROUP BY p.id, sc.current_streak, sc.longest_streak;

-- Grant select permissions
GRANT SELECT ON user_achievements_stats TO authenticated;

COMMENT ON VIEW user_achievements_stats IS
'Aggregates user achievement statistics for gamification system.
Fixed: Uses LATERAL join and CTE for more efficient streak calculation.';
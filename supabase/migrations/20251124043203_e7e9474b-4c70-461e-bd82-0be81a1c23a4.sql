-- Fix leaderboard to show longest_streak instead of current_streak
-- The current implementation shows current_streak which is often 0

DROP VIEW IF EXISTS leaderboard;

CREATE OR REPLACE VIEW leaderboard AS
SELECT
  ROW_NUMBER() OVER (ORDER BY ua.longest_streak DESC, ua.days_completed DESC) as rank,
  'Parent ' || SUBSTRING(p.id::text, 1, 4) as anonymous_name,
  p.brain_profile,
  ua.days_completed as completed_days,
  ua.longest_streak as current_streak,
  MAX(td.date) as last_active_date
FROM profiles p
INNER JOIN user_achievements_stats ua ON ua.user_id = p.id
LEFT JOIN tracker_days td ON td.user_id = p.id AND td.completed = true
WHERE ua.days_completed > 0
GROUP BY p.id, p.brain_profile, ua.longest_streak, ua.days_completed
ORDER BY rank
LIMIT 100;

GRANT SELECT ON leaderboard TO authenticated;

COMMENT ON VIEW leaderboard IS
'Public leaderboard showing top users by longest streak (not current streak).
Fixed: Now shows longest_streak as current_streak column to preserve backward compatibility.';
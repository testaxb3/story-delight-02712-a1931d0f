-- Create leaderboard view combining profiles and achievements
CREATE OR REPLACE VIEW leaderboard_cache AS
SELECT 
  p.id,
  p.name as full_name,
  p.photo_url,
  COALESCE(uas.scripts_used, 0) as scripts_used,
  COALESCE(uas.current_streak, 0) as current_streak,
  COALESCE(uas.longest_streak, 0) as longest_streak,
  COALESCE(uas.days_completed, 0) + COALESCE(uas.scripts_used, 0) * 10 + COALESCE(uas.longest_streak, 0) * 5 as total_xp
FROM profiles p
LEFT JOIN user_achievements_stats uas ON uas.user_id = p.id
WHERE p.id IS NOT NULL
ORDER BY total_xp DESC, longest_streak DESC;
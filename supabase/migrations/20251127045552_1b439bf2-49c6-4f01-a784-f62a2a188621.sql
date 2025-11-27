-- DROP AND RECREATE check_and_unlock_badges WITH CORRECT SIGNATURE
DROP FUNCTION IF EXISTS check_and_unlock_badges(UUID);

CREATE FUNCTION check_and_unlock_badges(p_user_id UUID)
RETURNS TABLE(badge_id UUID, badge_name TEXT) AS $$
DECLARE
  v_stats RECORD;
  v_badge RECORD;
  v_requirement TEXT;
  v_requirement_value INTEGER;
  v_current_value INTEGER;
  v_unlocked BOOLEAN;
BEGIN
  SELECT * INTO v_stats FROM user_achievements_stats_aggregated WHERE user_id = p_user_id;
  IF NOT FOUND THEN RETURN; END IF;

  FOR v_badge IN 
    SELECT b.id, b.name, b.requirement FROM badges b
    WHERE NOT EXISTS (SELECT 1 FROM user_badges ub WHERE ub.user_id = p_user_id AND ub.badge_id = b.id)
  LOOP
    v_unlocked := FALSE;
    IF v_badge.requirement IS NOT NULL THEN
      v_requirement := split_part(v_badge.requirement, ':', 1);
      v_requirement_value := split_part(v_badge.requirement, ':', 2)::INTEGER;
      
      v_current_value := CASE v_requirement
        WHEN 'streak_days' THEN v_stats.current_streak
        WHEN 'scripts_used' THEN v_stats.scripts_used
        WHEN 'videos_watched' THEN v_stats.videos_watched
        WHEN 'posts_created' THEN v_stats.posts_created
        WHEN 'tracker_entries' THEN v_stats.days_completed
        ELSE 0
      END;
      
      IF v_current_value >= v_requirement_value THEN v_unlocked := TRUE; END IF;
    END IF;

    IF v_unlocked THEN
      INSERT INTO user_badges (user_id, badge_id, unlocked_at)
      VALUES (p_user_id, v_badge.id, NOW())
      ON CONFLICT (user_id, badge_id) DO NOTHING;
      badge_id := v_badge.id;
      badge_name := v_badge.name;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
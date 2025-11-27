-- Create aggregated VIEW for user achievements stats
CREATE OR REPLACE VIEW user_achievements_stats_aggregated AS
SELECT 
  user_id,
  MAX(current_streak) AS current_streak,
  MAX(longest_streak) AS longest_streak,
  MAX(days_completed) AS days_completed,
  MAX(scripts_used) AS scripts_used,
  MAX(videos_watched) AS videos_watched,
  MAX(posts_created) AS posts_created,
  MAX(reactions_received) AS reactions_received,
  MAX(badges_unlocked) AS badges_unlocked
FROM user_achievements_stats
GROUP BY user_id;

-- Drop and recreate check_and_unlock_badges function
DROP FUNCTION IF EXISTS check_and_unlock_badges(UUID);

CREATE OR REPLACE FUNCTION check_and_unlock_badges(p_user_id UUID)
RETURNS TABLE(badge_id UUID, badge_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stats RECORD;
  v_badge RECORD;
  v_requirement TEXT;
  v_requirement_value INTEGER;
  v_current_value INTEGER;
  v_unlocked BOOLEAN;
BEGIN
  -- Use aggregated view
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
$$;

-- Drop and recreate get_user_achievements_enriched function
DROP FUNCTION IF EXISTS get_user_achievements_enriched(UUID);

CREATE OR REPLACE FUNCTION get_user_achievements_enriched(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
  v_stats JSONB;
  v_badges JSONB;
  v_unlocked_count INTEGER;
  v_total_count INTEGER;
BEGIN
  -- Use aggregated view and convert to JSON
  SELECT to_jsonb(uas.*) INTO v_stats
  FROM user_achievements_stats_aggregated uas
  WHERE uas.user_id = p_user_id;

  IF v_stats IS NULL THEN
    RETURN jsonb_build_object(
      'badges', '[]'::JSONB,
      'stats', jsonb_build_object(
        'unlockedCount', 0,
        'totalCount', 0,
        'percentage', 0,
        'currentStreak', 0,
        'longestStreak', 0
      )
    );
  END IF;

  WITH enriched_badges AS (
    SELECT
      b.id,
      b.name,
      b.description,
      b.icon,
      b.category,
      b.rarity,
      b.requirement,
      CASE
        WHEN ub.user_id IS NOT NULL THEN TRUE
        ELSE FALSE
      END as unlocked,
      ub.unlocked_at,
      CASE
        WHEN ub.user_id IS NULL THEN calculate_badge_progress(b.requirement, v_stats)
        ELSE NULL
      END as progress
    FROM badges b
    LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = p_user_id
    ORDER BY b.category, b.name
  )
  SELECT
    COALESCE(jsonb_agg(to_jsonb(eb.*)), '[]'::JSONB),
    COUNT(*) FILTER (WHERE unlocked),
    COUNT(*)
  INTO v_badges, v_unlocked_count, v_total_count
  FROM enriched_badges eb;

  v_result := jsonb_build_object(
    'badges', v_badges,
    'stats', jsonb_build_object(
      'unlockedCount', v_unlocked_count,
      'totalCount', v_total_count,
      'percentage', CASE
        WHEN v_total_count > 0 THEN ROUND((v_unlocked_count::NUMERIC / v_total_count::NUMERIC) * 100)
        ELSE 0
      END,
      'currentStreak', (v_stats->>'current_streak')::INTEGER,
      'longestStreak', (v_stats->>'longest_streak')::INTEGER
    )
  );

  RETURN v_result;
END;
$$;
-- ============================================================================
-- FIX ACHIEVEMENTS RPC - GROUP BY Error
-- Fixes: column "bs.unlocked_count" must appear in the GROUP BY clause
-- ============================================================================

-- Drop and recreate the RPC function with correct query structure
CREATE OR REPLACE FUNCTION get_user_achievements_enriched(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_stats JSONB;
  v_badges JSONB;
  v_unlocked_count INTEGER;
  v_total_count INTEGER;
BEGIN
  -- Get user stats as JSON
  SELECT to_jsonb(uas.*) INTO v_stats
  FROM user_achievements_stats uas
  WHERE uas.user_id = p_user_id;

  -- If no stats exist, return empty structure
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

  -- Build enriched badges array with progress
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

  -- Build final result
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
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant execute permission (redundante mas garante)
GRANT EXECUTE ON FUNCTION get_user_achievements_enriched(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_user_achievements_enriched IS
  'Returns enriched badge data with progress calculation. Fixed GROUP BY issue.';

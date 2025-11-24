-- Fix Streak Badge Logic Bug
--
-- PROBLEM: check_and_unlock_badges() checks current_streak instead of longest_streak
-- IMPACT: Users lose badge progress when streak breaks, even after achieving it
-- SOLUTION: Check longest_streak for all streak-based badges
--
-- This migration replaces the check_and_unlock_badges() function to use
-- longest_streak for streak badge requirements instead of current_streak.
--
-- Rollback: Run the previous version of this function from migration
-- 20251124015513_a8799881-3456-4769-b732-c5e5c415dfe4.sql

CREATE OR REPLACE FUNCTION check_and_unlock_badges(p_user_id UUID)
RETURNS TABLE(badge_id UUID, badge_name TEXT, badge_icon TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_badge RECORD;
  v_stats RECORD;
  v_requirement_type TEXT;
  v_requirement_value INT;
  v_unlocked BOOLEAN;
BEGIN
  -- Fetch user stats from the view
  SELECT * INTO v_stats
  FROM user_achievements_stats
  WHERE user_id = p_user_id;

  -- If no stats found, return empty
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Loop through all badges the user hasn't unlocked yet
  FOR v_badge IN
    SELECT b.id, b.name, b.icon, b.category, b.requirement
    FROM badges b
    WHERE NOT EXISTS (
      SELECT 1
      FROM user_badges ub
      WHERE ub.user_id = p_user_id
        AND ub.badge_id = b.id
    )
  LOOP
    -- Parse requirement (format: "type:value")
    v_requirement_type := split_part(v_badge.requirement, ':', 1);
    v_requirement_value := CAST(split_part(v_badge.requirement, ':', 2) AS INT);

    -- Check if requirement is met
    v_unlocked := FALSE;

    CASE v_requirement_type
      -- FIX: Use longest_streak instead of current_streak for achievement tracking
      WHEN 'streak_days' THEN
        v_unlocked := v_stats.longest_streak >= v_requirement_value;

      WHEN 'scripts_used' THEN
        v_unlocked := v_stats.scripts_used >= v_requirement_value;

      WHEN 'videos_watched' THEN
        v_unlocked := v_stats.videos_watched >= v_requirement_value;

      WHEN 'days_completed' THEN
        v_unlocked := v_stats.days_completed >= v_requirement_value;

      WHEN 'posts_created' THEN
        v_unlocked := v_stats.posts_created >= v_requirement_value;

      -- Special badges with custom logic
      WHEN 'special' THEN
        CASE v_badge.name
          WHEN 'Early Adopter' THEN
            v_unlocked := (SELECT created_at < '2025-01-01'::TIMESTAMP FROM profiles WHERE id = p_user_id);

          WHEN 'Perfect Week' THEN
            v_unlocked := v_stats.current_streak >= 7;

          WHEN 'Night Owl' THEN
            v_unlocked := v_stats.night_logs >= 3;

          WHEN 'Morning Person' THEN
            v_unlocked := v_stats.morning_logs >= 3;

          WHEN 'Helpful' THEN
            v_unlocked := v_stats.reactions_received >= 5;

          ELSE
            v_unlocked := FALSE;
        END CASE;

      ELSE
        v_unlocked := FALSE;
    END CASE;

    -- If unlocked, insert into user_badges
    IF v_unlocked THEN
      INSERT INTO user_badges (user_id, badge_id, unlocked_at)
      VALUES (p_user_id, v_badge.id, NOW())
      ON CONFLICT (user_id, badge_id) DO NOTHING;

      -- Return the newly unlocked badge
      badge_id := v_badge.id;
      badge_name := v_badge.name;
      badge_icon := v_badge.icon;
      RETURN NEXT;
    END IF;
  END LOOP;

  RETURN;
END;
$$;

-- Add comment explaining the fix
COMMENT ON FUNCTION check_and_unlock_badges(UUID) IS
'Checks user achievement stats and automatically unlocks earned badges.
FIXED: Now checks longest_streak instead of current_streak for streak badges,
ensuring users retain badge eligibility even if their current streak breaks.';

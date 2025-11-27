-- ============================================================================
-- FIX BADGE PROGRESS PARSER - Handle Non-Numeric Requirements
-- Fixes: invalid input syntax for type integer: "early_adopter"
-- ============================================================================

-- Drop and recreate with proper validation
CREATE OR REPLACE FUNCTION calculate_badge_progress(
  p_requirement TEXT,
  p_stats JSONB
) RETURNS JSONB AS $$
DECLARE
  v_type TEXT;
  v_required INTEGER;
  v_current INTEGER;
  v_label TEXT;
  v_value_part TEXT;
BEGIN
  -- Parse requirement (format: "type:value" or just "type")
  v_type := split_part(p_requirement, ':', 1);
  v_value_part := split_part(p_requirement, ':', 2);

  -- Check if value part exists and is numeric
  IF v_value_part = '' OR v_value_part IS NULL THEN
    -- No numeric requirement (e.g., "early_adopter")
    -- Return null progress for special badges
    RETURN NULL;
  END IF;

  -- Validate numeric value
  BEGIN
    v_required := v_value_part::INTEGER;
  EXCEPTION WHEN OTHERS THEN
    -- Not a valid integer, return null
    RETURN NULL;
  END;

  -- Get current progress based on type
  v_current := CASE v_type
    WHEN 'streak_days' THEN COALESCE((p_stats->>'current_streak')::INTEGER, 0)
    WHEN 'scripts_used' THEN COALESCE((p_stats->>'scripts_used')::INTEGER, 0)
    WHEN 'videos_watched' THEN COALESCE((p_stats->>'videos_watched')::INTEGER, 0)
    WHEN 'days_completed' THEN COALESCE((p_stats->>'days_completed')::INTEGER, 0)
    WHEN 'posts_created' THEN COALESCE((p_stats->>'posts_created')::INTEGER, 0)
    ELSE 0
  END;

  -- Get label
  v_label := CASE v_type
    WHEN 'streak_days' THEN 'days'
    WHEN 'scripts_used' THEN 'scripts'
    WHEN 'videos_watched' THEN 'videos'
    WHEN 'days_completed' THEN 'days'
    WHEN 'posts_created' THEN 'posts'
    ELSE 'items'
  END;

  RETURN jsonb_build_object(
    'current', v_current,
    'required', v_required,
    'label', v_label,
    'percentage', CASE
      WHEN v_required > 0 THEN ROUND((v_current::NUMERIC / v_required::NUMERIC) * 100, 2)
      ELSE 0
    END
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add comment
COMMENT ON FUNCTION calculate_badge_progress IS
  'Calculates badge progress. Returns NULL for special badges without numeric requirements (e.g., early_adopter).';

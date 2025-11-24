-- Performance Optimizations for Gamification System
--
-- 1. Add RPC wrapper for authoritative streak data (frontend source of truth)
-- 2. Add missing index for time-based badge queries (morning/night logs)
--
-- These changes improve performance and ensure data consistency between
-- frontend UI and backend badge unlock logic.

-- =============================================================================
-- RPC: Get Authoritative Streak Data
-- =============================================================================
-- Provides a clean RPC endpoint for frontend to get authoritative streak data
-- from the database, replacing frontend-only streak calculation.
--
-- This ensures the UI displays the same streak values that the badge system uses.

CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID)
RETURNS TABLE(
  current_streak INT,
  longest_streak INT,
  total_days INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    uastats.current_streak,
    uastats.longest_streak,
    uastats.days_completed as total_days
  FROM user_achievements_stats uastats
  WHERE uastats.user_id = p_user_id;
END;
$$;

COMMENT ON FUNCTION get_user_streak(UUID) IS
'Returns authoritative streak data from user_achievements_stats view.
Frontend should use this as source of truth for streak display to match badge unlock logic.';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_streak(UUID) TO authenticated;

-- =============================================================================
-- Performance Index: Time-Based Badge Queries
-- =============================================================================
-- Adds index for queries filtering on EXTRACT(HOUR FROM completed_at)
-- used by morning_person and night_owl special badges.
--
-- Without this index, special badge calculations do full table scans.

CREATE INDEX IF NOT EXISTS idx_tracker_days_user_hour
ON tracker_days(user_id, (EXTRACT(HOUR FROM completed_at)))
WHERE completed = true;

COMMENT ON INDEX idx_tracker_days_user_hour IS
'Optimizes time-based badge queries (morning_person, night_owl) by indexing
the hour extraction used in special badge requirements.';

-- =============================================================================
-- Composite Index: User + Date Lookups
-- =============================================================================
-- Improves performance of streak calculation queries which frequently
-- look up tracker_days by user_id and date range.

CREATE INDEX IF NOT EXISTS idx_tracker_days_user_date_completed
ON tracker_days(user_id, date DESC, completed)
WHERE completed = true;

COMMENT ON INDEX idx_tracker_days_user_date_completed IS
'Optimizes streak calculation queries by covering (user_id, date, completed)
with date in descending order for efficient recent-day lookups.';

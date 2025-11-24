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
-- Adds index for queries filtering on completed_at timestamp
-- used by morning_person and night_owl special badges.
--
-- Note: We index completed_at directly instead of EXTRACT(HOUR FROM completed_at)
-- because EXTRACT() is not IMMUTABLE and cannot be used in indexes.
-- Queries can still filter efficiently using WHERE clauses on completed_at.

CREATE INDEX IF NOT EXISTS idx_tracker_days_user_completed_at
ON tracker_days(user_id, completed_at)
WHERE completed = true;

COMMENT ON INDEX idx_tracker_days_user_completed_at IS
'Optimizes time-based badge queries (morning_person, night_owl) by indexing
completed_at timestamp. Queries can filter by time ranges efficiently.';

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

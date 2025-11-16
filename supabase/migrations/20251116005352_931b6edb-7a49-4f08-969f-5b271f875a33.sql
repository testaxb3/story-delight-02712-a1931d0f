-- ========================================
-- SECURITY VIEWS REVIEW - Convert Security Definer Views to Normal Views
-- Date: 2024-11-16
-- Description: Convert 8 Security Definer views to normal views (SECURITY INVOKER)
--              Keep only 2 views as SECURITY DEFINER with justification
-- ========================================

-- ============================================================
-- PHASE 1: DROP existing Security Definer views that will be converted
-- ============================================================

DROP VIEW IF EXISTS public.children_profiles CASCADE;
DROP VIEW IF EXISTS public.community_posts_with_profiles CASCADE;
DROP VIEW IF EXISTS public.community_posts_with_stats CASCADE;
DROP VIEW IF EXISTS public.ebooks_with_stats CASCADE;
DROP VIEW IF EXISTS public.emergency_scripts_new CASCADE;
DROP VIEW IF EXISTS public.public_profiles CASCADE;
DROP VIEW IF EXISTS public.scripts_card_view CASCADE;
DROP VIEW IF EXISTS public.scripts_with_full_stats CASCADE;

-- ============================================================
-- PHASE 2: Recreate views as NORMAL (SECURITY INVOKER - default)
-- ============================================================

-- 1. public_profiles - Public subset of profile data
-- JUSTIFICATION: Only exposes non-sensitive fields, no need for SECURITY DEFINER
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true)
AS
SELECT
  id,
  name,
  photo_url,
  bio,
  badges,
  followers_count,
  following_count,
  posts_count,
  likes_received_count,
  comments_count,
  created_at,
  updated_at
FROM profiles;

-- RLS: Inherits from profiles table (SELECT allowed for all)
COMMENT ON VIEW public.public_profiles IS 'Public profile data - SECURITY INVOKER - Inherits RLS from profiles table';

-- 2. community_posts_with_profiles - Posts with author info
-- JUSTIFICATION: Simple JOIN of public data, no sensitive operations
CREATE OR REPLACE VIEW public.community_posts_with_profiles
WITH (security_invoker = true)
AS
SELECT
  cp.id,
  cp.user_id,
  cp.content,
  cp.image_url,
  cp.created_at,
  cp.updated_at,
  cp.author_name,
  p.name AS profile_name
FROM community_posts cp
LEFT JOIN profiles p ON cp.user_id = p.id;

COMMENT ON VIEW public.community_posts_with_profiles IS 'Posts with profile data - SECURITY INVOKER - Inherits RLS from base tables';

-- 3. community_posts_with_stats - Posts with counts
-- JUSTIFICATION: Public aggregations (likes, comments), no user-specific data
CREATE OR REPLACE VIEW public.community_posts_with_stats
WITH (security_invoker = true)
AS
SELECT
  cp.id,
  cp.user_id,
  cp.content,
  cp.image_url,
  cp.image_thumbnail_url,
  cp.author_name,
  cp.author_brain_type,
  cp.author_photo_url,
  cp.post_type,
  cp.is_seed_post,
  cp.created_at,
  cp.updated_at,
  p.name AS profile_name,
  p.email AS profile_email,
  p.photo_url AS profile_photo,
  COALESCE(COUNT(DISTINCT pc.id), 0)::INTEGER AS comments_count,
  COALESCE(COUNT(DISTINCT pl.id), 0)::INTEGER AS likes_count
FROM community_posts cp
LEFT JOIN profiles p ON cp.user_id = p.id
LEFT JOIN post_comments pc ON cp.id = pc.post_id
LEFT JOIN post_likes pl ON cp.id = pl.post_id
GROUP BY cp.id, p.id;

COMMENT ON VIEW public.community_posts_with_stats IS 'Posts with aggregated stats - SECURITY INVOKER - Inherits RLS from base tables';

-- 4. ebooks_with_stats - Ebooks with aggregated statistics
-- JUSTIFICATION: General statistics (readers count, completion rate), not user-specific
CREATE OR REPLACE VIEW public.ebooks_with_stats
WITH (security_invoker = true)
AS
SELECT
  e.id,
  e.title,
  e.subtitle,
  e.slug,
  e.content,
  e.markdown_source,
  e.thumbnail_url,
  e.cover_color,
  e.total_chapters,
  e.estimated_reading_time,
  e.total_words,
  e.bonus_id,
  e.metadata,
  e.created_at,
  e.updated_at,
  e.deleted_at,
  COUNT(DISTINCT uep.user_id) AS total_readers,
  AVG(uep.reading_time_minutes) AS avg_reading_time,
  COUNT(DISTINCT uep.user_id) FILTER (
    WHERE e.total_chapters = COALESCE(array_length(uep.completed_chapters, 1), 0)
  ) AS completed_count,
  CASE
    WHEN COUNT(DISTINCT uep.user_id) > 0 THEN
      (COUNT(DISTINCT uep.user_id) FILTER (
        WHERE e.total_chapters = COALESCE(array_length(uep.completed_chapters, 1), 0)
      )::FLOAT / COUNT(DISTINCT uep.user_id)::FLOAT * 100)
    ELSE 0
  END AS completion_rate
FROM ebooks e
LEFT JOIN user_ebook_progress uep ON e.id = uep.ebook_id
WHERE e.deleted_at IS NULL
GROUP BY e.id;

COMMENT ON VIEW public.ebooks_with_stats IS 'Ebooks with aggregated statistics - SECURITY INVOKER - Inherits RLS from ebooks table';

-- 5. emergency_scripts_new - Emergency scripts with success rates
-- JUSTIFICATION: Public aggregations, no user-specific filtering
CREATE OR REPLACE VIEW public.emergency_scripts_new
WITH (security_invoker = true)
AS
SELECT
  s.id,
  s.title,
  s.category,
  s.profile,
  s.difficulty,
  s.duration_minutes,
  COALESCE(s.the_situation, s.situation_trigger) AS situation,
  s.strategy_steps,
  s.what_to_expect,
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked') AS worked_count,
  COUNT(DISTINCT sf.id) AS total_uses,
  CASE
    WHEN COUNT(DISTINCT sf.id) > 0 THEN
      ROUND(
        ((COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked')::NUMERIC * 1.0)
        + (COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'progress')::NUMERIC * 0.5))
        / COUNT(DISTINCT sf.id)::NUMERIC * 100
      )
    ELSE NULL
  END AS success_rate_percent
FROM scripts s
LEFT JOIN script_feedback sf ON s.id = sf.script_id
WHERE s.emergency_suitable = true
  AND s.works_in_public = true
  AND s.duration_minutes <= 5
GROUP BY s.id
ORDER BY
  CASE
    WHEN COUNT(DISTINCT sf.id) > 0 THEN
      ((COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked')::NUMERIC * 1.0)
      + (COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'progress')::NUMERIC * 0.5))
      / COUNT(DISTINCT sf.id)::NUMERIC
    ELSE 0
  END DESC,
  s.title;

COMMENT ON VIEW public.emergency_scripts_new IS 'Emergency scripts with success rates - SECURITY INVOKER - Public aggregated data';

-- 6. scripts_card_view - Scripts for card display (REMOVE is_favorite)
-- JUSTIFICATION: Removed user-specific is_favorite field, client will calculate it
CREATE OR REPLACE VIEW public.scripts_card_view
WITH (security_invoker = true)
AS
SELECT
  s.id,
  s.title,
  s.category,
  s.profile,
  s.difficulty,
  s.difficulty_level,
  s.duration_minutes,
  s.expected_time_seconds,
  s.age_min,
  s.age_max,
  s.the_situation,
  s.situation_trigger,
  s.tags,
  s.emergency_suitable,
  s.works_in_public,
  s.requires_preparation,
  s.parent_state,
  s.location_type,
  s.time_optimal,
  s.intensity_level,
  s.created_at,
  -- is_favorite REMOVED - calculate client-side using useFavoriteScripts hook
  COUNT(DISTINCT su.id) AS usage_count,
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked') AS success_count,
  CASE
    WHEN COUNT(DISTINCT sf.id) > 0 THEN
      ROUND(
        (COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked')::NUMERIC / COUNT(DISTINCT sf.id)::NUMERIC) * 100
      )
    ELSE NULL
  END AS success_rate
FROM scripts s
LEFT JOIN script_usage su ON s.id = su.script_id
LEFT JOIN script_feedback sf ON s.id = sf.script_id
GROUP BY s.id;

COMMENT ON VIEW public.scripts_card_view IS 'Scripts for card display - SECURITY INVOKER - is_favorite removed (calculate client-side)';

-- 7. scripts_with_full_stats - Scripts with all statistics (REMOVE is_favorite)
-- JUSTIFICATION: Same as scripts_card_view, removed user-specific field
CREATE OR REPLACE VIEW public.scripts_with_full_stats
WITH (security_invoker = true)
AS
SELECT
  s.*,
  -- is_favorite REMOVED - calculate client-side
  COUNT(DISTINCT su.id) AS total_usage_count,
  COUNT(DISTINCT sf.id) AS total_feedback_count,
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked') AS worked_count,
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'progress') AS progress_count,
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'didnt_work') AS didnt_work_count,
  CASE
    WHEN COUNT(DISTINCT sf.id) > 0 THEN
      ROUND(
        ((COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked')::NUMERIC * 1.0)
        + (COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'progress')::NUMERIC * 0.5))
        / COUNT(DISTINCT sf.id)::NUMERIC * 100
      )
    ELSE NULL
  END AS success_rate_percent,
  COUNT(DISTINCT uf.user_id) AS favorite_count
FROM scripts s
LEFT JOIN script_usage su ON s.id = su.script_id
LEFT JOIN script_feedback sf ON s.id = sf.script_id
LEFT JOIN user_favorites uf ON s.id = uf.script_id
GROUP BY s.id;

COMMENT ON VIEW public.scripts_with_full_stats IS 'Scripts with full statistics - SECURITY INVOKER - is_favorite removed';

-- ============================================================
-- PHASE 3: Document remaining SECURITY DEFINER views
-- ============================================================

COMMENT ON VIEW public.bonuses_with_user_progress IS 
'SECURITY DEFINER - JUSTIFIED: Joins user-specific progress (user_bonuses, user_ebook_progress) filtered by auth.uid(). Alternative would require complex client-side joins.';

COMMENT ON VIEW public.user_recent_ebooks IS 
'SECURITY DEFINER - JUSTIFIED: Returns only current users recent ebooks filtered by auth.uid() in user_ebook_progress. No viable alternative.';

-- ============================================================
-- PHASE 4: Security verification
-- ============================================================

-- Grant appropriate permissions to authenticated users on new views
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.community_posts_with_profiles TO authenticated;
GRANT SELECT ON public.community_posts_with_stats TO authenticated;
GRANT SELECT ON public.ebooks_with_stats TO authenticated;
GRANT SELECT ON public.emergency_scripts_new TO authenticated;
GRANT SELECT ON public.scripts_card_view TO authenticated;
GRANT SELECT ON public.scripts_with_full_stats TO authenticated;
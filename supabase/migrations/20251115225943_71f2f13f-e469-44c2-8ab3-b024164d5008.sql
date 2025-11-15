-- Remove SECURITY DEFINER from functions that don't need it
-- These functions only access user's own data, RLS policies are sufficient

-- 1. get_user_collection_counts() - Only counts own user data
CREATE OR REPLACE FUNCTION public.get_user_collection_counts()
RETURNS json
LANGUAGE plpgsql
-- REMOVED: SECURITY DEFINER
AS $function$
DECLARE
  child_count INTEGER;
  feedback_count INTEGER;
  post_count INTEGER;
  comment_count INTEGER;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object(
      'error', 'Not authenticated'
    );
  END IF;

  -- Count child profiles (RLS enforces parent_id = auth.uid())
  SELECT COUNT(*) INTO child_count
  FROM public.child_profiles
  WHERE parent_id = auth.uid();

  -- Count feedback (RLS enforces user_id = auth.uid())
  SELECT COUNT(*) INTO feedback_count
  FROM public.script_feedback
  WHERE user_id = auth.uid();

  -- Count posts (RLS enforces user_id = auth.uid())
  SELECT COUNT(*) INTO post_count
  FROM public.community_posts
  WHERE user_id = auth.uid();

  -- Count comments (RLS enforces user_id = auth.uid())
  SELECT COUNT(*) INTO comment_count
  FROM public.post_comments
  WHERE user_id = auth.uid();

  RETURN json_build_object(
    'child_profiles', json_build_object(
      'count', child_count,
      'limit', 10,
      'remaining', 10 - child_count
    ),
    'feedback', json_build_object(
      'count', feedback_count,
      'limit', 500,
      'remaining', 500 - feedback_count
    ),
    'posts', json_build_object(
      'count', post_count,
      'limit', 1000,
      'remaining', 1000 - post_count
    ),
    'comments', json_build_object(
      'count', comment_count,
      'limit', 5000,
      'remaining', 5000 - comment_count
    )
  );
END;
$function$;

-- 2. verify_schema_fixes() - Only checks metadata, no user data
CREATE OR REPLACE FUNCTION public.verify_schema_fixes()
RETURNS TABLE(check_name text, status text, details text)
LANGUAGE plpgsql
-- REMOVED: SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check 1: tracker_days.child_id exists
  RETURN QUERY
  SELECT
    'tracker_days.child_id'::TEXT as check_name,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tracker_days' AND column_name = 'child_id'
      ) THEN 'OK'
      ELSE 'MISSING'
    END as status,
    'Column for child profile ID'::TEXT as details;

  -- Check 2: scripts_usage table exists
  RETURN QUERY
  SELECT
    'scripts_usage table'::TEXT,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'scripts_usage'
      ) THEN 'OK'
      ELSE 'MISSING'
    END,
    'Script usage tracking table'::TEXT;

  -- Check 3: posts view exists
  RETURN QUERY
  SELECT
    'posts view'::TEXT,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_name = 'posts'
      ) THEN 'OK'
      ELSE 'MISSING'
    END,
    'Compatibility view for community_posts'::TEXT;

  -- Check 4: user_bonuses table
  RETURN QUERY
  SELECT
    'user_bonuses table'::TEXT,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'user_bonuses'
      ) THEN 'OK'
      ELSE 'MISSING'
    END,
    'User bonus progress tracking'::TEXT;

  -- Check 5: badges table
  RETURN QUERY
  SELECT
    'badges table'::TEXT,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'badges'
      ) THEN 'OK'
      ELSE 'MISSING'
    END,
    'Badge definitions'::TEXT;

  -- Check 6: user_badges table
  RETURN QUERY
  SELECT
    'user_badges table'::TEXT,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'user_badges'
      ) THEN 'OK'
      ELSE 'MISSING'
    END,
    'User badge achievements'::TEXT;
END;
$function$;

-- 3. search_scripts_natural() - Searches public scripts table
CREATE OR REPLACE FUNCTION public.search_scripts_natural(
  search_query text,
  user_brain_profile text DEFAULT NULL::text,
  user_age_min integer DEFAULT NULL::integer,
  user_age_max integer DEFAULT NULL::integer
)
RETURNS TABLE(
  script_id uuid,
  title text,
  category text,
  profile text,
  difficulty text,
  relevance_score integer,
  match_context text
)
LANGUAGE plpgsql
-- REMOVED: SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    s.id as script_id,
    s.title,
    s.category,
    s.profile,
    s.difficulty,
    (
      -- Exact title match
      CASE WHEN s.title ILIKE '%' || search_query || '%' THEN 50 ELSE 0 END +
      -- Situation match
      CASE WHEN s.the_situation ILIKE '%' || search_query || '%' THEN 40 ELSE 0 END +
      -- Tag match
      CASE WHEN EXISTS (
        SELECT 1 FROM unnest(s.tags) tag WHERE tag ILIKE '%' || search_query || '%'
      ) THEN 30 ELSE 0 END +
      -- Old situation_trigger fallback
      CASE WHEN s.situation_trigger ILIKE '%' || search_query || '%' THEN 35 ELSE 0 END +
      -- Brain profile match bonus
      CASE WHEN user_brain_profile IS NOT NULL AND s.profile = user_brain_profile THEN 20 ELSE 0 END +
      -- Age range match bonus
      CASE WHEN user_age_min IS NOT NULL AND user_age_max IS NOT NULL
        AND s.age_min <= user_age_max AND s.age_max >= user_age_min
      THEN 15 ELSE 0 END
    ) as relevance_score,
    CASE
      WHEN s.title ILIKE '%' || search_query || '%' THEN 'Title'
      WHEN s.the_situation ILIKE '%' || search_query || '%' THEN 'Situation'
      WHEN EXISTS (SELECT 1 FROM unnest(s.tags) tag WHERE tag ILIKE '%' || search_query || '%') THEN 'Tags'
      ELSE 'General'
    END as match_context
  FROM scripts s
  WHERE
    s.title ILIKE '%' || search_query || '%' OR
    s.the_situation ILIKE '%' || search_query || '%' OR
    s.situation_trigger ILIKE '%' || search_query || '%' OR
    EXISTS (SELECT 1 FROM unnest(s.tags) tag WHERE tag ILIKE '%' || search_query || '%')
  ORDER BY relevance_score DESC, s.title
  LIMIT 20;
END;
$function$;

-- 4. get_sos_script() - Uses only user's own feedback data
CREATE OR REPLACE FUNCTION public.get_sos_script(
  p_user_id uuid,
  p_child_id uuid DEFAULT NULL::uuid,
  p_situation text DEFAULT NULL::text,
  p_location text DEFAULT 'home'::text
)
RETURNS TABLE(
  script_id uuid,
  title text,
  situation_trigger text,
  success_rate numeric,
  personal_success_rate numeric,
  usage_count bigint,
  relevance_score integer
)
LANGUAGE plpgsql
-- REMOVED: SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    s.id as script_id,
    s.title,
    s.situation_trigger,
    -- Global success rate
    COALESCE(
      AVG(CASE
        WHEN sf_all.outcome = 'worked' THEN 1.0
        WHEN sf_all.outcome = 'progress' THEN 0.5
        ELSE 0.0
      END),
      0.5
    ) as success_rate,
    -- Personal success rate (RLS enforces user_id = auth.uid())
    COALESCE(
      AVG(CASE
        WHEN sf_user.outcome = 'worked' THEN 1.0
        WHEN sf_user.outcome = 'progress' THEN 0.5
        ELSE 0.0
      END),
      0.0
    ) as personal_success_rate,
    COUNT(DISTINCT su.id) as usage_count,
    -- Relevance scoring
    (
      -- Matches location
      CASE WHEN p_location = ANY(s.location_type) THEN 20 ELSE 0 END +
      -- Matches time of day
      CASE
        WHEN EXTRACT(HOUR FROM NOW()) BETWEEN 6 AND 9 AND 'morning' = ANY(s.time_optimal) THEN 15
        WHEN EXTRACT(HOUR FROM NOW()) BETWEEN 17 AND 20 AND 'evening' = ANY(s.time_optimal) THEN 15
        ELSE 5
      END +
      -- Emergency suitable
      CASE WHEN s.emergency_suitable THEN 25 ELSE 0 END +
      -- Has personal success history
      CASE WHEN COUNT(sf_user.id) > 0 THEN 20 ELSE 0 END +
      -- Situation keyword match
      CASE
        WHEN p_situation IS NOT NULL
         AND s.situation_trigger ILIKE '%' || p_situation || '%'
        THEN 30
        ELSE 0
      END
    ) as relevance_score
  FROM scripts s
  LEFT JOIN script_usage su ON s.id = su.script_id
  LEFT JOIN script_feedback sf_all ON s.id = sf_all.script_id
  LEFT JOIN script_feedback sf_user ON s.id = sf_user.script_id
    AND sf_user.user_id = p_user_id
    AND (p_child_id IS NULL OR sf_user.child_id = p_child_id)
  WHERE s.emergency_suitable = true
  GROUP BY s.id
  ORDER BY relevance_score DESC, personal_success_rate DESC, success_rate DESC
  LIMIT 1;
END;
$function$;

-- Add comments documenting why SECURITY DEFINER was removed
COMMENT ON FUNCTION public.get_user_collection_counts() IS 
'Counts user collection limits. SECURITY DEFINER removed - RLS policies on child_profiles, script_feedback, community_posts, and post_comments already restrict access to user own data.';

COMMENT ON FUNCTION public.verify_schema_fixes() IS 
'Developer utility to verify schema. SECURITY DEFINER removed - only reads metadata from information_schema, no user data accessed.';

COMMENT ON FUNCTION public.search_scripts_natural(text, text, integer, integer) IS 
'Natural language search for scripts. SECURITY DEFINER removed - scripts table is public, RLS allows all authenticated users to read.';

COMMENT ON FUNCTION public.get_sos_script(uuid, uuid, text, text) IS 
'Returns emergency script for situation. SECURITY DEFINER removed - uses only user own feedback data, RLS policies on script_feedback and script_usage enforce user_id restrictions.';
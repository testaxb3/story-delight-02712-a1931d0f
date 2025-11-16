-- ============================================
-- SECURITY FIX: Add search_path to remaining functions
-- Date: 2025-11-16 (Part 2)
-- ============================================

-- Function: clear_force_update_flag
CREATE OR REPLACE FUNCTION public.clear_force_update_flag()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  current_config JSONB;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required'
      USING ERRCODE = '42501';
  END IF;

  -- Get current version config
  SELECT config_value INTO current_config
  FROM public.app_config
  WHERE config_key = 'app_version';

  -- Clear force_update flag while keeping version info
  UPDATE public.app_config
  SET config_value = jsonb_set(
    current_config,
    '{force_update}',
    'false'::jsonb
  ),
  updated_at = NOW(),
  updated_by = auth.uid()
  WHERE config_key = 'app_version';

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Force update flag cleared',
    'current_version', current_config->>'version',
    'current_build', (current_config->>'build')::INTEGER
  );
END;
$function$;

-- Function: save_child_profile
CREATE OR REPLACE FUNCTION public.save_child_profile(
  child_name text DEFAULT NULL::text, 
  child_profile text DEFAULT NULL::text, 
  quiz_completed boolean DEFAULT false, 
  parent_name text DEFAULT NULL::text, 
  email text DEFAULT NULL::text
)
RETURNS profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  current_user_id uuid := auth.uid();
  sanitized_child_name text := nullif(trim(child_name), '');
  sanitized_parent_name text := nullif(trim(parent_name), '');
  sanitized_child_profile text := nullif(child_profile, '');
  sanitized_email text := nullif(lower(email), '');
  result public.profiles;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Missing authenticated user.';
  END IF;

  INSERT INTO public.profiles AS p (
    id,
    child_name,
    brain_profile,
    quiz_completed,
    name,
    email,
    premium
  )
  VALUES (
    current_user_id,
    sanitized_child_name,
    sanitized_child_profile,
    COALESCE(quiz_completed, false),
    sanitized_parent_name,
    sanitized_email,
    true
  )
  ON CONFLICT (id) DO UPDATE
    SET child_name = COALESCE(EXCLUDED.child_name, p.child_name),
        brain_profile = COALESCE(EXCLUDED.brain_profile, p.brain_profile),
        quiz_completed = EXCLUDED.quiz_completed,
        name = COALESCE(EXCLUDED.name, p.name),
        email = COALESCE(EXCLUDED.email, p.email),
        updated_at = timezone('utc', now())
  RETURNING * INTO result;

  INSERT INTO public.user_progress AS up (
    user_id,
    quiz_completed,
    child_profile
  )
  VALUES (
    current_user_id,
    COALESCE(quiz_completed, false),
    sanitized_child_profile
  )
  ON CONFLICT (user_id) DO UPDATE
    SET quiz_completed = EXCLUDED.quiz_completed,
        child_profile = COALESCE(EXCLUDED.child_profile, up.child_profile),
        updated_at = timezone('utc', now());

  RETURN result;
END;
$function$;

-- Function: update_user_app_versions_timestamp
CREATE OR REPLACE FUNCTION public.update_user_app_versions_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- ============================================
-- VERIFICATION
-- ============================================
-- This migration adds search_path to the last 3 functions:
-- 1. clear_force_update_flag
-- 2. save_child_profile  
-- 3. update_user_app_versions_timestamp
-- ============================================
-- ============================================================================
-- Migration: Fix Authentication Flow - Create Profile Trigger
-- Description: Ensures profiles and user_progress are created automatically
--              when a new user is created in auth.users
-- ============================================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  default_name TEXT;
BEGIN
  -- Extract name from email (part before @)
  default_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Create profile automatically
  INSERT INTO public.profiles (
    id,
    email,
    name,
    premium,
    quiz_completed,
    quiz_in_progress,
    is_admin,
    welcome_modal_shown
  )
  VALUES (
    NEW.id,
    NEW.email,
    default_name,
    false, -- Default to free tier
    false, -- Quiz not completed
    false, -- Quiz not in progress
    false, -- Not admin
    false  -- Welcome modal not shown
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicates

  -- Create user_progress entry
  INSERT INTO public.user_progress (
    user_id,
    quiz_completed,
    scripts_used,
    streak
  )
  VALUES (
    NEW.id,
    false,
    0,
    0
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;

-- Create trigger to run after user is created
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Backfill: Ensure all existing users have profiles
-- ============================================================================

-- Create profiles for users that don't have one
INSERT INTO public.profiles (id, email, name, premium, quiz_completed, quiz_in_progress, is_admin, welcome_modal_shown)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'name',
    u.raw_user_meta_data->>'full_name',
    SPLIT_PART(u.email, '@', 1),
    'User'
  ) as name,
  false as premium,
  false as quiz_completed,
  false as quiz_in_progress,
  false as is_admin,
  false as welcome_modal_shown
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Create user_progress for users that don't have one
INSERT INTO public.user_progress (user_id, quiz_completed, scripts_used, streak)
SELECT 
  u.id,
  false as quiz_completed,
  0 as scripts_used,
  0 as streak
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_progress up WHERE up.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- Comment explaining the trigger
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates profile and user_progress entries when a new user signs up. 
This ensures data consistency and prevents race conditions in the authentication flow.';
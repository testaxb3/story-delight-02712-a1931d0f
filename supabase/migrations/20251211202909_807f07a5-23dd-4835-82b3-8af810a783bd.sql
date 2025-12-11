-- Remove the redundant trigger that causes duplicate key violation
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;

-- Remove the unused function
DROP FUNCTION IF EXISTS public.handle_new_user_role();
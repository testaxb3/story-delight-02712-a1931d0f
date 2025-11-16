-- ============================================
-- P0: Corrigir função is_admin() sem search_path
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  admin_status BOOLEAN;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Get admin status from profiles table
  SELECT COALESCE(is_admin, FALSE) INTO admin_status
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN COALESCE(admin_status, FALSE);
END;
$function$;
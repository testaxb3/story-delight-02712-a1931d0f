-- Fix handle_new_user to bypass RLS when updating approved_users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_approved_user RECORD;
BEGIN
  -- Bypass RLS explicitly for this transaction
  SET LOCAL row_security = off;

  -- Insert profile (idempotent)
  INSERT INTO public.profiles (id, email, created_at, updated_at, is_admin, premium)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW(),
    false,
    false
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email, updated_at = NOW();

  -- Insert default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Update approved_users if exists
  SELECT * INTO v_approved_user
  FROM public.approved_users
  WHERE LOWER(email) = LOWER(NEW.email)
  LIMIT 1;

  IF v_approved_user.id IS NOT NULL THEN
    UPDATE public.approved_users
    SET 
      user_id = NEW.id,
      account_created = true,
      account_created_at = NOW(),
      updated_at = NOW()
    WHERE id = v_approved_user.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Synchronize existing pending records
UPDATE approved_users au
SET 
  user_id = p.id,
  account_created = true,
  account_created_at = p.created_at,
  updated_at = NOW()
FROM profiles p
WHERE LOWER(au.email) = LOWER(p.email)
AND au.account_created = false;
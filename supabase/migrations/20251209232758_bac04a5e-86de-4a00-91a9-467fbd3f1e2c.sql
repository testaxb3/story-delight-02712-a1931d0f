-- 1. Corrigir os 3 registros afetados manualmente
UPDATE public.approved_users
SET 
  account_created = true,
  account_created_at = NOW(),
  user_id = (SELECT id FROM auth.users WHERE email = approved_users.email LIMIT 1)
WHERE email IN ('marylouchavez0910@gmail.com', 'tua15661@gmail.com', 'ymazzulo@gmail.com')
  AND account_created = false;

-- 2. Remover trigger duplicado
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;

-- 3. Recriar handle_new_user com TRY/CATCH para não falhar silenciosamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_approved_user RECORD;
  v_product JSONB;
  v_product_id TEXT;
BEGIN
  -- Create profile automatically with ON CONFLICT (idempotent)
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE 
    SET email = COALESCE(EXCLUDED.email, public.profiles.email),
        updated_at = NOW();

  -- Create user_progress automatically
  INSERT INTO public.user_progress (user_id, created_at)
  VALUES (NEW.id, NOW())
  ON CONFLICT (user_id) DO NOTHING;

  -- Fetch approved_users record with products
  SELECT * INTO v_approved_user
  FROM public.approved_users
  WHERE LOWER(email) = LOWER(NEW.email)
  LIMIT 1;

  -- Update approved_users when account is created
  IF v_approved_user IS NOT NULL THEN
    UPDATE public.approved_users
    SET 
      user_id = NEW.id,
      account_created = true,
      account_created_at = NOW(),
      updated_at = NOW()
    WHERE LOWER(email) = LOWER(NEW.email);

    -- Assign membership badges based on purchased products (wrapped in exception handler)
    IF v_approved_user.products IS NOT NULL THEN
      FOR v_product IN SELECT * FROM jsonb_array_elements(v_approved_user.products)
      LOOP
        v_product_id := v_product->>'id';
        
        BEGIN
          -- Main products ($47) -> NEP Member badge
          IF v_product_id IN ('27499673', '27577169') THEN
            PERFORM assign_membership_badge(NEW.id, 'nep_member');
          END IF;
          
          -- Audio upsell products -> NEP Listen badge
          IF v_product_id IN ('27845678', '27851448') THEN
            PERFORM assign_membership_badge(NEW.id, 'nep_listen');
          END IF;
        EXCEPTION WHEN OTHERS THEN
          -- Log error but don't fail the entire user creation
          RAISE WARNING 'Failed to assign badge for product %: %', v_product_id, SQLERRM;
        END;
      END LOOP;
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but still allow user creation to succeed
  RAISE WARNING 'handle_new_user error for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$function$;

-- 4. Garantir que assign_membership_badge é SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.assign_membership_badge(p_user_id uuid, p_badge_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_badge_id UUID;
BEGIN
  -- Get the badge ID based on type
  IF p_badge_type = 'nep_member' THEN
    v_badge_id := 'a1b2c3d4-5678-90ab-cdef-111111111111';
  ELSIF p_badge_type = 'nep_listen' THEN
    v_badge_id := 'a1b2c3d4-5678-90ab-cdef-222222222222';
  ELSE
    RETURN;
  END IF;

  -- Insert badge if not already assigned (with exception handling)
  BEGIN
    INSERT INTO user_badges (user_id, badge_id, unlocked_at)
    VALUES (p_user_id, v_badge_id, NOW())
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to insert badge % for user %: %', v_badge_id, p_user_id, SQLERRM;
  END;
END;
$function$;
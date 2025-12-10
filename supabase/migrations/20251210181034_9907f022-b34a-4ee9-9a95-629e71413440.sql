
-- 1. Corrigir dados da njpoblete@outlook.com
UPDATE approved_users 
SET 
  user_id = 'dd968c3b-3cfc-408d-b7cc-18f7d74d2b4c',
  account_created = true,
  account_created_at = '2025-12-10 18:04:16.819818+00'
WHERE LOWER(email) = LOWER('njpoblete@outlook.com');

-- 2. Sincronizar TODOS os approved_users que têm conta criada mas não foram marcados
UPDATE approved_users au
SET 
  user_id = p.id,
  account_created = true,
  account_created_at = COALESCE(au.account_created_at, p.created_at),
  updated_at = NOW()
FROM profiles p
WHERE LOWER(au.email) = LOWER(p.email)
  AND au.account_created = false
  AND p.id IS NOT NULL;

-- 3. Criar tabela de log para debug do trigger (opcional mas útil)
CREATE TABLE IF NOT EXISTS public.trigger_debug_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_name TEXT NOT NULL,
  user_email TEXT,
  user_id UUID,
  message TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.trigger_debug_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admins can view trigger logs" ON public.trigger_debug_log
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- System can insert logs
CREATE POLICY "System can insert trigger logs" ON public.trigger_debug_log
  FOR INSERT WITH CHECK (true);

-- 4. Atualizar handle_new_user com logging detalhado
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
  v_update_count INT;
BEGIN
  -- Log: trigger started
  INSERT INTO trigger_debug_log (trigger_name, user_email, user_id, message)
  VALUES ('handle_new_user', NEW.email, NEW.id, 'Trigger started');

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

  -- Log: approved user check
  INSERT INTO trigger_debug_log (trigger_name, user_email, user_id, message, details)
  VALUES ('handle_new_user', NEW.email, NEW.id, 
    CASE WHEN v_approved_user IS NOT NULL THEN 'Found approved_user' ELSE 'No approved_user found' END,
    CASE WHEN v_approved_user IS NOT NULL THEN jsonb_build_object('approved_user_id', v_approved_user.id, 'status', v_approved_user.status) ELSE NULL END
  );

  -- Update approved_users when account is created
  IF v_approved_user IS NOT NULL THEN
    UPDATE public.approved_users
    SET 
      user_id = NEW.id,
      account_created = true,
      account_created_at = NOW(),
      updated_at = NOW()
    WHERE LOWER(email) = LOWER(NEW.email);
    
    GET DIAGNOSTICS v_update_count = ROW_COUNT;
    
    -- Log: update result
    INSERT INTO trigger_debug_log (trigger_name, user_email, user_id, message, details)
    VALUES ('handle_new_user', NEW.email, NEW.id, 'Updated approved_users', 
      jsonb_build_object('rows_updated', v_update_count));

    -- Assign membership badges based on purchased products
    IF v_approved_user.products IS NOT NULL THEN
      FOR v_product IN SELECT * FROM jsonb_array_elements(v_approved_user.products)
      LOOP
        v_product_id := v_product->>'id';
        
        BEGIN
          IF v_product_id IN ('27499673', '27577169') THEN
            PERFORM assign_membership_badge(NEW.id, 'nep_member');
          END IF;
          
          IF v_product_id IN ('27845678', '27851448') THEN
            PERFORM assign_membership_badge(NEW.id, 'nep_listen');
          END IF;
        EXCEPTION WHEN OTHERS THEN
          INSERT INTO trigger_debug_log (trigger_name, user_email, user_id, message, details)
          VALUES ('handle_new_user', NEW.email, NEW.id, 'Badge assignment failed', 
            jsonb_build_object('product_id', v_product_id, 'error', SQLERRM));
        END;
      END LOOP;
    END IF;
  END IF;

  -- Log: trigger completed
  INSERT INTO trigger_debug_log (trigger_name, user_email, user_id, message)
  VALUES ('handle_new_user', NEW.email, NEW.id, 'Trigger completed successfully');

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error
  INSERT INTO trigger_debug_log (trigger_name, user_email, user_id, message, details)
  VALUES ('handle_new_user', NEW.email, NEW.id, 'Trigger failed with exception', 
    jsonb_build_object('error', SQLERRM, 'state', SQLSTATE));
  RETURN NEW;
END;
$function$;

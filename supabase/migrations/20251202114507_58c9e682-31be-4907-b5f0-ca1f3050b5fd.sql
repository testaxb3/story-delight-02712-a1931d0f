-- ============================================================
-- Migration: Fix handle_new_user() trigger - Signup Idempotente
-- Descrição: Adiciona ON CONFLICT ao INSERT de profiles para prevenir
--            erros de "duplicate key" em signups concorrentes
-- ============================================================

-- Recriar a function handle_new_user() COM ON CONFLICT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- ✅ Criar profile automaticamente COM ON CONFLICT (idempotente)
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE 
    SET email = COALESCE(EXCLUDED.email, public.profiles.email),
        updated_at = NOW();

  -- ✅ Criar user_progress automaticamente (já tinha ON CONFLICT)
  INSERT INTO public.user_progress (user_id, created_at)
  VALUES (NEW.id, NOW())
  ON CONFLICT (user_id) DO NOTHING;

  -- ✅ Atualizar approved_users quando conta é criada
  UPDATE public.approved_users
  SET 
    user_id = NEW.id,
    account_created = true,
    account_created_at = NOW(),
    updated_at = NOW()
  WHERE LOWER(email) = LOWER(NEW.email)
  AND account_created = false;

  RETURN NEW;
END;
$$;

-- Log de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Trigger handle_new_user() atualizado - signup agora é idempotente';
END $$;
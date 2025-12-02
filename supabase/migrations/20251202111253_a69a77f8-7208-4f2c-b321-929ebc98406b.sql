-- ============================================================
-- Migration: Fix approved_users tracking bugs
-- Descrição: 
--   1. Atualiza trigger handle_new_user() para sincronizar approved_users
--   2. Sincroniza dados históricos de 67 usuários com contas criadas
-- ============================================================

-- ========== PARTE 1: Atualizar trigger handle_new_user() ==========

-- Primeiro, deletar o trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recriar a function handle_new_user() com atualização de approved_users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Criar profile automaticamente
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  );

  -- Criar user_progress automaticamente
  INSERT INTO public.user_progress (user_id, created_at)
  VALUES (NEW.id, NOW())
  ON CONFLICT (user_id) DO NOTHING;

  -- 🐛 FIX: Atualizar approved_users quando conta é criada
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

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ========== PARTE 2: Sincronizar dados históricos ==========

-- Sincronizar os 67 usuários com contas criadas mas approved_users desatualizado
UPDATE approved_users au
SET 
  user_id = p.id,
  account_created = true,
  account_created_at = p.created_at,
  updated_at = NOW()
FROM profiles p
WHERE LOWER(au.email) = LOWER(p.email)
AND au.account_created = false;

-- Log de resultado
DO $$
DECLARE
  rows_updated integer;
BEGIN
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RAISE NOTICE '✅ Sincronizados % usuários históricos em approved_users', rows_updated;
END $$;
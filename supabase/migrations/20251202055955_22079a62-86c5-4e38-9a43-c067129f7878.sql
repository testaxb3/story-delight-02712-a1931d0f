-- Migration: Fix user_badges INSERT vulnerability and cleanup duplicate policies

-- =====================================================
-- CORREÇÃO CRÍTICA 1: user_badges INSERT vulnerability
-- =====================================================

-- Remover política perigosa que permite qualquer usuário inserir badges
DROP POLICY IF EXISTS "System can insert badges" ON user_badges;

-- Badges devem ser concedidos apenas por triggers/functions do sistema
-- Não criar nova política de INSERT - badges são automáticos via triggers

-- =====================================================
-- CORREÇÃO CRÍTICA 2: Remover política permissiva em profiles
-- =====================================================

-- Esta política expõe TODOS os profiles para qualquer usuário autenticado
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- =====================================================
-- LIMPEZA: Consolidar políticas duplicadas em comments
-- =====================================================

-- Remover políticas duplicadas/TEMP, manter apenas as principais
DROP POLICY IF EXISTS "Authenticated users can read comments" ON comments;
DROP POLICY IF EXISTS "TEMP - Authenticated users can read comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their comments" ON comments;
DROP POLICY IF EXISTS "Users can insert their comments" ON comments;

-- As políticas corretas já existem:
-- "Anyone can view comments" (SELECT)
-- "Users can create comments" (INSERT) 
-- "Users can delete their own comments" (DELETE)
-- "Users can update their comments" (UPDATE)

-- =====================================================
-- LIMPEZA: Remover políticas duplicadas em tracker_days
-- =====================================================

DROP POLICY IF EXISTS "Users can view tracker days" ON tracker_days;
DROP POLICY IF EXISTS "Users can delete tracker days" ON tracker_days;
DROP POLICY IF EXISTS "Users can update tracker days" ON tracker_days;

-- As políticas corretas já existem:
-- "Users can view their own tracker days" (SELECT)
-- "Users can delete their own tracker days" (DELETE)
-- "Users can update their own tracker days" (UPDATE)

-- =====================================================
-- VERIFICAÇÃO: Confirmar políticas seguras
-- =====================================================

DO $$
DECLARE
  user_badges_insert_count INTEGER;
  profiles_view_all_count INTEGER;
BEGIN
  -- Verificar que não há política de INSERT em user_badges
  SELECT COUNT(*) INTO user_badges_insert_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
    AND tablename = 'user_badges' 
    AND cmd = 'INSERT';
  
  IF user_badges_insert_count > 0 THEN
    RAISE EXCEPTION 'SECURITY ERROR: Found % INSERT policies on user_badges, expected 0', user_badges_insert_count;
  END IF;
  
  -- Verificar que não há política "Users can view all profiles"
  SELECT COUNT(*) INTO profiles_view_all_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
    AND tablename = 'profiles'
    AND policyname = 'Users can view all profiles';
  
  IF profiles_view_all_count > 0 THEN
    RAISE EXCEPTION 'SECURITY ERROR: Permissive "Users can view all profiles" policy still exists';
  END IF;
  
  RAISE NOTICE 'Security verification passed: user_badges INSERT blocked, profiles restricted, duplicates cleaned';
END $$;
-- Migration: Fix critical INSERT policy vulnerability in profiles and cleanup duplicate policies

-- =====================================================
-- CORREÇÃO CRÍTICA: Dropar política antiga com nome CORRETO
-- =====================================================

-- A migração anterior falhou porque usou o nome errado
-- Nome correto da política antiga: "Users can insert own profile"
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- =====================================================
-- LIMPEZA: Remover políticas duplicadas em tracker_days
-- =====================================================

DROP POLICY IF EXISTS "Users can insert tracker days" ON tracker_days;

-- =====================================================
-- LIMPEZA: Remover políticas TEMP em community_posts
-- =====================================================

DROP POLICY IF EXISTS "TEMP - Authenticated users can view community posts" ON community_posts;

-- =====================================================
-- VERIFICAÇÃO: Confirmar apenas política segura existe
-- =====================================================

-- Esta query deve retornar apenas "Users can insert own profile safely"
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND cmd = 'INSERT';
  
  IF policy_count != 1 THEN
    RAISE EXCEPTION 'Expected exactly 1 INSERT policy on profiles, found %', policy_count;
  END IF;
  
  RAISE NOTICE 'Security verification passed: Only safe INSERT policy exists on profiles';
END $$;
-- Migration: Fix critical security vulnerabilities in profiles and community_posts

-- =====================================================
-- CORREÇÃO #1: Proteger campos sensíveis em profiles
-- =====================================================

-- Criar função que protege campos que usuários não podem modificar
CREATE OR REPLACE FUNCTION protect_sensitive_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Preservar campos administrativos e de estatísticas
  NEW.is_admin := OLD.is_admin;
  NEW.premium := OLD.premium;
  NEW.followers_count := OLD.followers_count;
  NEW.following_count := OLD.following_count;
  NEW.posts_count := OLD.posts_count;
  NEW.likes_received_count := OLD.likes_received_count;
  NEW.comments_count := OLD.comments_count;
  
  RETURN NEW;
END;
$$;

-- Criar trigger BEFORE UPDATE em profiles
DROP TRIGGER IF EXISTS protect_profile_fields_trigger ON profiles;
CREATE TRIGGER protect_profile_fields_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_sensitive_profile_fields();

-- =====================================================
-- CORREÇÃO #2: Corrigir política de INSERT em profiles
-- =====================================================

-- Remover política permissiva
DROP POLICY IF EXISTS "Users insert own profile" ON profiles;

-- Criar política restritiva que bloqueia is_admin=true e premium=true
CREATE POLICY "Users can insert own profile safely"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id 
  AND is_admin = false 
  AND premium = false
);

-- =====================================================
-- CORREÇÃO #3: Remover política permissiva em community_posts
-- =====================================================

-- Remover política muito permissiva que permite qualquer INSERT
DROP POLICY IF EXISTS "Users create posts" ON community_posts;
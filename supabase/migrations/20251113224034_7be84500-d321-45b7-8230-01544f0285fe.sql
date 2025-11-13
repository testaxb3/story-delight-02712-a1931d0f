-- AUDITORIA FINAL: CORREÇÕES DE SEGURANÇA CRÍTICAS
-- Corrigir todos os 49 problemas identificados pelo linter

-- ============================================
-- PARTE 1: Adicionar search_path em TODAS as funções
-- ============================================

-- Funções de triggers
ALTER FUNCTION public.children_profiles_insert() SET search_path = public;
ALTER FUNCTION public.children_profiles_update() SET search_path = public;
ALTER FUNCTION public.children_profiles_delete() SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.update_video_progress_updated_at() SET search_path = public;
ALTER FUNCTION public.update_collection_updated_at() SET search_path = public;
ALTER FUNCTION public.update_bonuses_updated_at() SET search_path = public;
ALTER FUNCTION public.update_refund_requests_updated_at() SET search_path = public;
ALTER FUNCTION public.set_tracker_date_default() SET search_path = public;
ALTER FUNCTION public.sync_tracker_days_child_ids() SET search_path = public;
ALTER FUNCTION public.auto_set_emergency_suitable() SET search_path = public;
ALTER FUNCTION public.update_search_vector() SET search_path = public;

-- Funções de contadores e agregação
ALTER FUNCTION public.update_comment_replies_count() SET search_path = public;
ALTER FUNCTION public.update_follower_counts() SET search_path = public;
ALTER FUNCTION public.update_user_stats() SET search_path = public;
ALTER FUNCTION public.auto_assign_badges() SET search_path = public;

-- Funções de notificação
ALTER FUNCTION public.send_notification(uuid, notification_type, text, text, uuid, uuid, uuid, text) SET search_path = public;
ALTER FUNCTION public.notify_on_follow() SET search_path = public;
ALTER FUNCTION public.notify_on_post_like() SET search_path = public;
ALTER FUNCTION public.notify_on_comment() SET search_path = public;

-- Funções utilitárias
ALTER FUNCTION public.increment_comment_replies(uuid) SET search_path = public;
ALTER FUNCTION public.decrement_comment_replies(uuid) SET search_path = public;
ALTER FUNCTION public.get_user_likes_count(uuid) SET search_path = public;

-- Funções de progresso e ebooks
ALTER FUNCTION public.mark_chapter_complete(uuid, integer) SET search_path = public;
ALTER FUNCTION public.update_reading_time(uuid, integer) SET search_path = public;
ALTER FUNCTION public.add_bookmark(uuid, integer, integer, text) SET search_path = public;

-- Funções de streak e cálculo
ALTER FUNCTION public.calculate_streak(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.check_streak_milestone(uuid, uuid) SET search_path = public;

-- Funções de busca
ALTER FUNCTION public.search_scripts_natural(text, text, integer, integer) SET search_path = public;
ALTER FUNCTION public.get_sos_script(uuid, uuid, text, text) SET search_path = public;

-- Funções de verificação
ALTER FUNCTION public.verify_schema_fixes() SET search_path = public;

-- ============================================
-- PARTE 2: Garantir que RLS está habilitado em TODAS as tabelas públicas
-- ============================================

-- Verificar e habilitar RLS em tabelas que possam estar sem
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    END LOOP;
END $$;

-- ============================================
-- PARTE 3: Corrigir políticas duplicadas
-- ============================================

-- Remover políticas duplicadas em video_progress (se existirem)
DROP POLICY IF EXISTS "Users can view their own video progress" ON public.video_progress;
DROP POLICY IF EXISTS "Users can manage their own video progress" ON public.video_progress;

-- Recriar políticas corretas
CREATE POLICY "Users can view their own video progress"
  ON public.video_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own video progress"
  ON public.video_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PARTE 4: Adicionar RLS policies faltantes em tabelas críticas
-- ============================================

-- Garantir que TODAS as views críticas têm RLS apropriado em suas tabelas base
-- (As views em si não precisam de RLS se as tabelas base têm)

-- Verificar se há alguma tabela sem policies
DO $$
DECLARE
    r RECORD;
    policy_count INTEGER;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT IN (
            'spatial_ref_sys', -- PostGIS
            'geography_columns', -- PostGIS
            'geometry_columns' -- PostGIS
        )
    LOOP
        -- Contar políticas existentes
        SELECT COUNT(*) INTO policy_count
        FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = r.tablename;
        
        -- Se não tem policies e não é uma tabela de sistema, avisar
        IF policy_count = 0 THEN
            RAISE NOTICE 'WARNING: Table % has no RLS policies', r.tablename;
        END IF;
    END LOOP;
END $$;

-- ============================================
-- PARTE 5: Adicionar comentários de documentação
-- ============================================

COMMENT ON FUNCTION public.has_role IS 'Security definer function to check user roles. Prevents recursive RLS policy checks.';
COMMENT ON FUNCTION public.is_admin IS 'Security definer function to check admin status. Prevents recursive RLS policy checks.';
COMMENT ON FUNCTION public.send_notification IS 'Sends notifications to users. SECURITY DEFINER required to bypass RLS for notification creation.';

-- ============================================
-- ANÁLISE FINAL: Verificar estado de segurança
-- ============================================

-- Query para verificar tabelas sem RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false
ORDER BY tablename;
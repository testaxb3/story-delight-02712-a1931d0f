-- FASE 4: OTIMIZAÇÕES DE PERFORMANCE
-- Criar views agregadas para reduzir N+1 queries e melhorar performance

-- View: community_posts_with_stats (posts com likes e comments agregados)
DROP VIEW IF EXISTS public.community_posts_with_stats CASCADE;
CREATE VIEW public.community_posts_with_stats AS
SELECT 
  cp.id,
  cp.user_id,
  cp.content,
  cp.image_url,
  cp.image_thumbnail_url,
  cp.author_name,
  cp.author_brain_type,
  cp.author_photo_url,
  cp.post_type,
  cp.is_seed_post,
  cp.created_at,
  cp.updated_at,
  p.name as profile_name,
  p.email as profile_email,
  p.photo_url as profile_photo,
  COALESCE(COUNT(DISTINCT pc.id), 0)::integer as comments_count,
  COALESCE(COUNT(DISTINCT pl.id), 0)::integer as likes_count
FROM public.community_posts cp
LEFT JOIN public.profiles p ON cp.user_id = p.id
LEFT JOIN public.post_comments pc ON cp.id = pc.post_id
LEFT JOIN public.post_likes pl ON cp.id = pl.post_id
GROUP BY cp.id, p.id;

-- View: scripts_with_full_stats (scripts com todas as estatísticas agregadas)
DROP VIEW IF EXISTS public.scripts_with_full_stats CASCADE;
CREATE VIEW public.scripts_with_full_stats AS
SELECT 
  s.*,
  COALESCE(COUNT(DISTINCT su.id), 0)::integer as usage_count,
  COALESCE(COUNT(DISTINCT sf.id), 0)::integer as feedback_count,
  COALESCE(COUNT(DISTINCT CASE WHEN sf.outcome = 'worked' THEN sf.id END), 0)::integer as worked_count,
  COALESCE(COUNT(DISTINCT CASE WHEN sf.outcome = 'progress' THEN sf.id END), 0)::integer as progress_count,
  COALESCE(COUNT(DISTINCT CASE WHEN sf.outcome = 'not_yet' THEN sf.id END), 0)::integer as not_yet_count,
  CASE 
    WHEN COUNT(DISTINCT sf.id) > 0 
    THEN LEAST(100, ROUND((COUNT(DISTINCT CASE WHEN sf.outcome = 'worked' THEN sf.id END)::numeric / COUNT(DISTINCT sf.id)::numeric * 100), 1))
    ELSE 0 
  END as success_rate
FROM public.scripts s
LEFT JOIN public.script_usage su ON s.id = su.script_id
LEFT JOIN public.script_feedback sf ON s.id = sf.script_id
GROUP BY s.id;

-- View: user_script_stats (estatísticas de script por usuário - para recomendações personalizadas)
CREATE OR REPLACE VIEW public.user_script_stats AS
SELECT 
  su.user_id,
  su.script_id,
  COUNT(DISTINCT su.id) as times_used,
  MAX(su.used_at) as last_used,
  COUNT(DISTINCT CASE WHEN sf.outcome = 'worked' THEN sf.id END) as times_worked,
  COUNT(DISTINCT sf.id) as feedback_count,
  CASE 
    WHEN COUNT(DISTINCT sf.id) > 0 
    THEN ROUND((COUNT(DISTINCT CASE WHEN sf.outcome = 'worked' THEN sf.id END)::numeric / COUNT(DISTINCT sf.id)::numeric * 100), 1)
    ELSE NULL 
  END as personal_success_rate
FROM public.script_usage su
LEFT JOIN public.script_feedback sf ON su.script_id = sf.script_id AND su.user_id = sf.user_id
GROUP BY su.user_id, su.script_id;

-- Índices adicionais para melhorar performance de queries frequentes
CREATE INDEX IF NOT EXISTS idx_community_posts_user_created ON public.community_posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_seed_created ON public.community_posts(is_seed_post, created_at DESC) WHERE is_seed_post = true;
CREATE INDEX IF NOT EXISTS idx_post_comments_created ON public.post_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_script_usage_user_created ON public.script_usage(user_id, used_at DESC);
CREATE INDEX IF NOT EXISTS idx_script_feedback_user_script ON public.script_feedback(user_id, script_id, outcome);
CREATE INDEX IF NOT EXISTS idx_scripts_profile_category ON public.scripts(profile, category) WHERE profile IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_scripts_emergency ON public.scripts(emergency_suitable, expected_time_seconds) WHERE emergency_suitable = true;

-- Índices de texto completo para busca melhorada
CREATE INDEX IF NOT EXISTS idx_scripts_title_gin ON public.scripts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_scripts_situation_gin ON public.scripts USING gin(to_tsvector('english', COALESCE(the_situation, situation_trigger, '')));
CREATE INDEX IF NOT EXISTS idx_community_posts_content_gin ON public.community_posts USING gin(to_tsvector('english', content));
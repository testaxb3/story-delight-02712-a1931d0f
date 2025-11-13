-- ============================================================================
-- CORREÇÕES CRÍTICAS: Collections, Success Rate, Community
-- ============================================================================

-- 1. CRIAR TABELAS DE COLLECTIONS (estava faltando)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.script_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.collection_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.script_collections(id) ON DELETE CASCADE,
  script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(collection_id, script_id)
);

-- RLS para script_collections
ALTER TABLE public.script_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own collections"
  ON public.script_collections FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS para collection_scripts
ALTER TABLE public.collection_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage scripts in their collections"
  ON public.collection_scripts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.script_collections
      WHERE id = collection_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.script_collections
      WHERE id = collection_id AND user_id = auth.uid()
    )
  );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_script_collections_user_id ON public.script_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_scripts_collection_id ON public.collection_scripts(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_scripts_script_id ON public.collection_scripts(script_id);
CREATE INDEX IF NOT EXISTS idx_collection_scripts_position ON public.collection_scripts(collection_id, position);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_collection_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_collection_updated_at ON public.script_collections;
CREATE TRIGGER trigger_update_collection_updated_at
  BEFORE UPDATE ON public.script_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_collection_updated_at();

-- 2. CORRIGIR CÁLCULO DE SUCCESS RATE (limitar a 100%)
-- ============================================================================
DROP VIEW IF EXISTS public.scripts_card_view;
CREATE VIEW public.scripts_card_view AS
SELECT
  s.id,
  s.title,
  s.category,
  s.profile,
  s.difficulty,
  s.duration_minutes,
  s.emergency_suitable,
  s.tags,
  s.age_min,
  s.age_max,
  COALESCE(s.the_situation, s.situation_trigger) AS preview_text,
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked') AS worked_count,
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'progress') AS progress_count,
  COUNT(DISTINCT sf.id) AS total_feedback_count,
  -- CORREÇÃO: Limitar success_rate a 100%
  CASE
    WHEN COUNT(DISTINCT sf.id) > 0 THEN 
      LEAST(
        100,
        ROUND(
          (
            COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked')::NUMERIC * 1.0 +
            COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'progress')::NUMERIC * 0.5
          ) / COUNT(DISTINCT sf.id)::NUMERIC * 100
        )
      )
    ELSE NULL
  END AS success_rate_percent
FROM scripts s
LEFT JOIN script_feedback sf ON s.id = sf.script_id
GROUP BY s.id;

-- 3. ADICIONAR ÍNDICES PARA MELHORAR PERFORMANCE DA COMMUNITY
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_post_likes_user_post ON public.post_likes(user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_post ON public.post_comments(user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON public.post_comments(created_at DESC);

-- 4. COMENTÁRIOS
-- ============================================================================
COMMENT ON TABLE public.script_collections IS 'Coleções personalizadas de scripts criadas pelos usuários';
COMMENT ON TABLE public.collection_scripts IS 'Scripts dentro de coleções com ordenação';
COMMENT ON VIEW public.scripts_card_view IS 'View otimizada para exibir cards de scripts com taxa de sucesso limitada a 100%';

-- ============================================================================
-- FIM DAS CORREÇÕES
-- ============================================================================
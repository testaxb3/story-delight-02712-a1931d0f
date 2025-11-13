-- ============================================
-- MIGRATION: Create Ebooks System
-- Description: Creates tables, views, functions, and policies for dynamic ebook system
-- INSTRUÇÕES: Copie e cole este SQL inteiro no SQL Editor do Supabase
-- ============================================

-- ============================================
-- TABELA: ebooks
-- Armazena conteúdo completo dos ebooks parseados
-- ============================================
CREATE TABLE IF NOT EXISTS public.ebooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Metadados básicos
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  
  -- Conteúdo parseado (estrutura Chapter[])
  content JSONB NOT NULL,
  
  -- Markdown original (backup/versionamento)
  markdown_source TEXT,
  
  -- Visual
  thumbnail_url TEXT,
  cover_color VARCHAR(7) DEFAULT '#8b5cf6', -- Hex color
  
  -- Estatísticas
  total_chapters INTEGER NOT NULL DEFAULT 0,
  estimated_reading_time INTEGER, -- minutos
  total_words INTEGER,
  
  -- Vínculo com sistema de bonuses
  bonus_id UUID REFERENCES public.bonuses(id) ON DELETE SET NULL,
  
  -- Metadata adicional (autor, versão, tags, etc.)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ebooks_bonus_id ON public.ebooks(bonus_id);
CREATE INDEX IF NOT EXISTS idx_ebooks_slug ON public.ebooks(slug);
CREATE INDEX IF NOT EXISTS idx_ebooks_created_at ON public.ebooks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ebooks_deleted_at ON public.ebooks(deleted_at) WHERE deleted_at IS NULL;

-- Full-text search no título e subtítulo
CREATE INDEX IF NOT EXISTS idx_ebooks_search ON public.ebooks USING gin(
  to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(subtitle, ''))
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ebooks_updated_at
  BEFORE UPDATE ON public.ebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA: user_ebook_progress
-- Rastreia progresso de leitura por usuário
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_ebook_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relacionamentos
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  
  -- Progresso de leitura
  current_chapter INTEGER NOT NULL DEFAULT 0,
  completed_chapters INTEGER[] DEFAULT '{}',
  scroll_position INTEGER DEFAULT 0, -- Para scroll contínuo
  
  -- Timestamps
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  first_read_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Estatísticas de leitura
  reading_time_minutes INTEGER DEFAULT 0, -- Tempo total gasto
  sessions_count INTEGER DEFAULT 0, -- Quantas vezes abriu
  
  -- Notas, highlights e bookmarks (JSONB para flexibilidade)
  bookmarks JSONB DEFAULT '[]'::jsonb,
  -- Estrutura: [{ chapter: 0, position: 0, label: "Important", created_at: ISO }]
  
  notes JSONB DEFAULT '{}'::jsonb,
  -- Estrutura: { "chapter-0": [{ text: "My note", timestamp: ISO }] }
  
  highlights JSONB DEFAULT '{}'::jsonb,
  -- Estrutura: { "chapter-0": [{ text: "Highlighted text", color: "#yellow" }] }
  
  -- Preferências de leitura
  reading_preferences JSONB DEFAULT '{}'::jsonb,
  -- Estrutura: { fontSize: 1, theme: "light", continuousScroll: false }
  
  -- Constraint de unicidade (1 progresso por usuário por ebook)
  UNIQUE(user_id, ebook_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_ebook_progress_user ON public.user_ebook_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ebook_progress_ebook ON public.user_ebook_progress(ebook_id);
CREATE INDEX IF NOT EXISTS idx_user_ebook_progress_last_read ON public.user_ebook_progress(last_read_at DESC);

-- ============================================
-- RLS POLICIES para user_ebook_progress
-- ============================================
ALTER TABLE public.user_ebook_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.user_ebook_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_ebook_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_ebook_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON public.user_ebook_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Ebooks com estatísticas de leitura agregadas
CREATE OR REPLACE VIEW public.ebooks_with_stats AS
SELECT 
  e.*,
  COUNT(DISTINCT uep.user_id) as total_readers,
  AVG(uep.reading_time_minutes) as avg_reading_time,
  COUNT(DISTINCT uep.user_id) FILTER (
    WHERE e.total_chapters = COALESCE(array_length(uep.completed_chapters, 1), 0)
  ) as completed_count,
  CASE 
    WHEN COUNT(DISTINCT uep.user_id) > 0 
    THEN (COUNT(DISTINCT uep.user_id) FILTER (
      WHERE e.total_chapters = COALESCE(array_length(uep.completed_chapters, 1), 0)
    )::float / COUNT(DISTINCT uep.user_id)::float * 100)
    ELSE 0 
  END as completion_rate
FROM public.ebooks e
LEFT JOIN public.user_ebook_progress uep ON e.id = uep.ebook_id
WHERE e.deleted_at IS NULL
GROUP BY e.id;

-- View: Ebooks recentemente lidos pelo usuário
CREATE OR REPLACE VIEW public.user_recent_ebooks AS
SELECT 
  uep.user_id,
  e.*,
  uep.current_chapter,
  uep.last_read_at,
  uep.reading_time_minutes,
  (COALESCE(array_length(uep.completed_chapters, 1), 0)::float / NULLIF(e.total_chapters, 0)::float * 100) as progress_percentage
FROM public.user_ebook_progress uep
JOIN public.ebooks e ON uep.ebook_id = e.id
WHERE e.deleted_at IS NULL
ORDER BY uep.last_read_at DESC;

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função: Marcar capítulo como completo
CREATE OR REPLACE FUNCTION public.mark_chapter_complete(
  p_ebook_id UUID,
  p_chapter_index INTEGER
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_ebook_progress (user_id, ebook_id, completed_chapters)
  VALUES (
    auth.uid(),
    p_ebook_id,
    ARRAY[p_chapter_index]
  )
  ON CONFLICT (user_id, ebook_id) DO UPDATE
  SET 
    completed_chapters = (
      SELECT ARRAY(
        SELECT DISTINCT unnest(user_ebook_progress.completed_chapters || ARRAY[p_chapter_index])
      )
    ),
    last_read_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Atualizar tempo de leitura
CREATE OR REPLACE FUNCTION public.update_reading_time(
  p_ebook_id UUID,
  p_minutes_delta INTEGER
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_ebook_progress (user_id, ebook_id, reading_time_minutes, sessions_count)
  VALUES (auth.uid(), p_ebook_id, p_minutes_delta, 1)
  ON CONFLICT (user_id, ebook_id) DO UPDATE
  SET 
    reading_time_minutes = user_ebook_progress.reading_time_minutes + p_minutes_delta,
    sessions_count = user_ebook_progress.sessions_count + 1,
    last_read_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Salvar bookmark
CREATE OR REPLACE FUNCTION public.add_bookmark(
  p_ebook_id UUID,
  p_chapter INTEGER,
  p_position INTEGER,
  p_label TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_bookmarks JSONB;
  v_new_bookmark JSONB;
BEGIN
  -- Get current bookmarks
  SELECT bookmarks INTO v_bookmarks
  FROM public.user_ebook_progress
  WHERE user_id = auth.uid() AND ebook_id = p_ebook_id;
  
  -- If no progress record exists, create one
  IF v_bookmarks IS NULL THEN
    v_bookmarks := '[]'::jsonb;
  END IF;
  
  -- Create new bookmark
  v_new_bookmark := jsonb_build_object(
    'chapter', p_chapter,
    'position', p_position,
    'label', p_label,
    'created_at', NOW()
  );
  
  -- Add to bookmarks array
  v_bookmarks := v_bookmarks || v_new_bookmark;
  
  -- Upsert progress
  INSERT INTO public.user_ebook_progress (user_id, ebook_id, bookmarks)
  VALUES (auth.uid(), p_ebook_id, v_bookmarks)
  ON CONFLICT (user_id, ebook_id) DO UPDATE
  SET bookmarks = v_bookmarks, last_read_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTS (Documentação)
-- ============================================

COMMENT ON TABLE public.ebooks IS 'Armazena ebooks parseados do formato Markdown com conteúdo em JSONB';
COMMENT ON TABLE public.user_ebook_progress IS 'Rastreia progresso de leitura, notas, highlights e bookmarks por usuário';
COMMENT ON VIEW public.ebooks_with_stats IS 'Ebooks com estatísticas agregadas de leitura';
COMMENT ON VIEW public.user_recent_ebooks IS 'Ebooks recentemente lidos pelo usuário logado';

-- ============================================
-- GRANTS (Permissões)
-- ============================================

-- Ebooks são públicos para leitura
GRANT SELECT ON public.ebooks TO anon, authenticated;
GRANT SELECT ON public.ebooks_with_stats TO anon, authenticated;
GRANT SELECT ON public.user_recent_ebooks TO authenticated;

-- Apenas admins podem modificar ebooks
-- (Configurar policies específicas se necessário)

-- ============================================
-- FIM DA MIGRATION
-- ============================================
-- Depois de executar este SQL, você terá:
-- ✅ Tabela ebooks (armazena conteúdo dos ebooks)
-- ✅ Tabela user_ebook_progress (progresso por usuário)
-- ✅ Views úteis (stats, recent ebooks)
-- ✅ Funções SQL (mark_chapter_complete, update_reading_time, add_bookmark)
-- ✅ RLS policies (segurança)
-- ============================================

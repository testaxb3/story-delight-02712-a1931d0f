-- Harden row level security for sensitive user tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove a política antiga de SELECT se existir
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Remove outras políticas de leitura que possam existir (redundante mas seguro)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Remove políticas de escrita/deleção antigas para garantir nomes corretos
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- *** POLÍTICA DE LEITURA CORRIGIDA ***
-- Permite que qualquer usuário logado leia perfis (necessário para joins, nomes de autores, etc.)
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles
  FOR SELECT
  USING (auth.role() = 'authenticated'); -- Alterado de auth.uid() = id

-- Políticas de escrita e deleção permanecem restritas ao próprio usuário
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Políticas para user_progress (sem alteração necessária aqui, mas incluído para completude)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users manage their progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can view their progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can manage their progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete their progress" ON public.user_progress;


CREATE POLICY "Users can view their progress"
  ON public.user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política combinada para INSERT/UPDATE/DELETE
CREATE POLICY "Users can manage their progress"
  ON public.user_progress
  FOR ALL -- Permite INSERT, UPDATE, DELETE com a mesma condição
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas para tracker_days (Correção do aninhamento $$)
DO $$
BEGIN
  -- Verifica se a tabela existe antes de aplicar políticas
  IF to_regclass('public.tracker_days') IS NOT NULL THEN
    -- Garante que RLS esteja habilitado
    EXECUTE 'ALTER TABLE public.tracker_days ENABLE ROW LEVEL SECURITY';

    -- Remove políticas antigas (se existirem)
    EXECUTE 'DROP POLICY IF EXISTS "Tracker days are viewable by everyone" ON public.tracker_days';
    EXECUTE 'DROP POLICY IF EXISTS "Users can view tracker days" ON public.tracker_days';
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage tracker days" ON public.tracker_days';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert tracker days" ON public.tracker_days';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update tracker days" ON public.tracker_days';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete tracker days" ON public.tracker_days';

    -- *** CORREÇÃO: Usa aspas simples dentro do EXECUTE ***
    EXECUTE 'CREATE POLICY "Users can view tracker days"
      ON public.tracker_days
      FOR SELECT
      USING (auth.uid() = user_id)';

    EXECUTE 'CREATE POLICY "Users can insert tracker days"
      ON public.tracker_days
      FOR INSERT
      WITH CHECK (auth.uid() = user_id)';

    EXECUTE 'CREATE POLICY "Users can update tracker days"
      ON public.tracker_days
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)';

    EXECUTE 'CREATE POLICY "Users can delete tracker days"
      ON public.tracker_days
      FOR DELETE
      USING (auth.uid() = user_id)';
  END IF;
END$$;
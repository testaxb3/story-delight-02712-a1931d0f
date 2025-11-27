-- ============================================================================
-- ACHIEVEMENTS DEBUG SCRIPT
-- Execute cada query abaixo no Supabase SQL Editor para debugar
-- ============================================================================

-- 1. Verificar se a função RPC existe
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'get_user_achievements_enriched';

-- Resultado esperado: 1 linha mostrando a função
-- Se vazio, a migration não foi aplicada

-- ============================================================================

-- 2. Verificar se as tabelas existem
SELECT
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('badges', 'user_badges', 'user_achievements_stats')
ORDER BY table_name;

-- Resultado esperado: 3 linhas (badges, user_badges, user_achievements_stats)
-- Se user_achievements_stats estiver faltando, esse é o problema

-- ============================================================================

-- 3. Verificar badges cadastrados
SELECT COUNT(*) as total_badges FROM badges;

-- Resultado esperado: > 0
-- Se 0, não há badges no sistema

-- ============================================================================

-- 4. Verificar se SEU usuário tem stats (SUBSTITUA o UUID)
-- IMPORTANTE: Pegue seu user_id do auth.users
SELECT * FROM auth.users LIMIT 1;

-- Copie o 'id' do resultado acima e substitua abaixo:
SELECT * FROM user_achievements_stats WHERE user_id = 'SEU_USER_ID_AQUI';

-- Resultado esperado: 1 linha com current_streak, longest_streak, etc
-- Se vazio, o usuário não tem stats criados

-- ============================================================================

-- 5. Testar a função RPC diretamente (SUBSTITUA o UUID)
SELECT get_user_achievements_enriched('SEU_USER_ID_AQUI');

-- Resultado esperado: JSON com badges e stats
-- Se erro, copie a mensagem de erro

-- ============================================================================

-- 6. Se user_achievements_stats não existir, crie com esta migration:
CREATE TABLE IF NOT EXISTS user_achievements_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  days_completed INTEGER NOT NULL DEFAULT 0,
  scripts_used INTEGER NOT NULL DEFAULT 0,
  videos_watched INTEGER NOT NULL DEFAULT 0,
  posts_created INTEGER NOT NULL DEFAULT 0,
  reactions_received INTEGER NOT NULL DEFAULT 0,
  badges_unlocked INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_user_achievements_stats_user_id
  ON user_achievements_stats(user_id);

-- Habilitar RLS
ALTER TABLE user_achievements_stats ENABLE ROW LEVEL SECURITY;

-- Policy para usuários lerem seus próprios stats
CREATE POLICY "Users can view own stats"
  ON user_achievements_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================

-- 7. Criar stats para SEU usuário se não existir
INSERT INTO user_achievements_stats (user_id)
SELECT id FROM auth.users WHERE id = 'SEU_USER_ID_AQUI'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================

-- 8. Testar novamente a função RPC
SELECT get_user_achievements_enriched('SEU_USER_ID_AQUI');

-- Agora deve retornar JSON válido

-- ============================================================================
-- BULK IMPORT SCRIPTS - HELPER SQL
-- ============================================================================
-- Este arquivo ajuda a importar scripts em massa do CSV gerado
--
-- IMPORTANTE:
-- 1. Primeiro DELETE todos os scripts antigos (se quiser começar do zero)
-- 2. Depois use o Supabase Table Editor para importar o CSV
-- ============================================================================

-- ============================================================================
-- STEP 1: LIMPAR SCRIPTS EXISTENTES (OPCIONAL - USE COM CUIDADO!)
-- ============================================================================

-- ATENÇÃO: Isso vai DELETAR TODOS os scripts e dados relacionados!
-- Descomente apenas se tiver CERTEZA que quer limpar tudo

/*
BEGIN;

-- Deletar feedback relacionado
DELETE FROM script_feedback;

-- Deletar usage relacionado
DELETE FROM script_usage;

-- Deletar favorites relacionados
DELETE FROM favorite_scripts;

-- Deletar scripts
DELETE FROM scripts;

COMMIT;
*/

-- ============================================================================
-- STEP 2: IMPORTAR CSV VIA SUPABASE TABLE EDITOR
-- ============================================================================

-- 1. Vá para Supabase Dashboard
-- 2. Selecione a tabela 'scripts'
-- 3. Clique em 'Insert' → 'Import data from CSV'
-- 4. Faça upload do seu scripts_bulk_upload.csv
-- 5. Mapeie as colunas corretamente
-- 6. Clique em 'Import'

-- ============================================================================
-- STEP 3: VERIFICAR IMPORTAÇÃO
-- ============================================================================

-- Contar scripts importados
SELECT
  category,
  profile,
  difficulty_level,
  COUNT(*) as total
FROM scripts
GROUP BY category, profile, difficulty_level
ORDER BY category, profile, difficulty_level;

-- Ver scripts sem guidance (se houver)
SELECT
  id,
  title,
  CASE
    WHEN say_it_like_this_step1 IS NULL THEN 'Missing step 1 guidance'
    WHEN say_it_like_this_step2 IS NULL THEN 'Missing step 2 guidance'
    WHEN say_it_like_this_step3 IS NULL THEN 'Missing step 3 guidance'
    WHEN array_length(what_to_expect, 1) < 3 THEN 'Missing expectations'
    ELSE 'OK'
  END as status
FROM scripts
WHERE
  say_it_like_this_step1 IS NULL
  OR say_it_like_this_step2 IS NULL
  OR say_it_like_this_step3 IS NULL
  OR array_length(what_to_expect, 1) < 3;

-- ============================================================================
-- STEP 4: POPULAR RELATED_SCRIPT_IDS (DEPOIS DA IMPORTAÇÃO)
-- ============================================================================

-- Exemplo: Relacionar scripts da mesma categoria
UPDATE scripts s1
SET related_script_ids = (
  SELECT ARRAY_AGG(s2.id)
  FROM (
    SELECT id
    FROM scripts s2
    WHERE s2.category = s1.category
      AND s2.id != s1.id
      AND s2.profile = s1.profile
    LIMIT 3
  ) s2
)
WHERE related_script_ids = ARRAY[]::text[] OR related_script_ids IS NULL;

-- Verificar related scripts populados
SELECT
  title,
  category,
  profile,
  array_length(related_script_ids, 1) as num_related
FROM scripts
WHERE array_length(related_script_ids, 1) > 0
LIMIT 10;

-- ============================================================================
-- STEP 5: POPULAR RELATED_SCRIPT_IDS MANUALMENTE (OPCIONAL)
-- ============================================================================

-- Se você quiser relacionar scripts específicos, use este formato:

/*
UPDATE scripts
SET related_script_ids = ARRAY[
  (SELECT id FROM scripts WHERE title = 'Script Title 1' LIMIT 1),
  (SELECT id FROM scripts WHERE title = 'Script Title 2' LIMIT 1),
  (SELECT id FROM scripts WHERE title = 'Script Title 3' LIMIT 1)
]
WHERE title = 'Current Script Title';
*/

-- ============================================================================
-- QUERIES ÚTEIS
-- ============================================================================

-- Ver todos os scripts com seus dados completos
SELECT
  id,
  title,
  category,
  profile,
  difficulty_level,
  age_range,
  duration_minutes,
  array_length(what_to_expect, 1) as num_expectations,
  array_length(related_script_ids, 1) as num_related
FROM scripts
ORDER BY category, profile, title;

-- Scripts por dificuldade
SELECT
  difficulty_level,
  COUNT(*) as total
FROM scripts
GROUP BY difficulty_level;

-- Scripts por perfil de cérebro
SELECT
  profile,
  COUNT(*) as total
FROM scripts
GROUP BY profile;

-- Scripts sem expectations
SELECT title, category
FROM scripts
WHERE what_to_expect IS NULL OR array_length(what_to_expect, 1) = 0;

-- Scripts sem guidance
SELECT title, category
FROM scripts
WHERE
  say_it_like_this_step1 IS NULL
  OR avoid_step1 IS NULL
  OR say_it_like_this_step2 IS NULL
  OR avoid_step2 IS NULL
  OR say_it_like_this_step3 IS NULL
  OR avoid_step3 IS NULL;

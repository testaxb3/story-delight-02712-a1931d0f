-- ==========================================
-- FIND FK PROBLEM
-- ==========================================
-- Encontra TODAS as foreign keys na tabela
-- ==========================================

-- 1. Lista TODAS as constraints da tabela
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'user_ebook_progress'
ORDER BY tc.constraint_type, tc.constraint_name;

-- 2. Tenta remover TODAS as FKs relacionadas a ebook_id
DO $$
DECLARE
  constraint_record RECORD;
BEGIN
  FOR constraint_record IN
    SELECT constraint_name
    FROM information_schema.table_constraints
    WHERE table_name = 'user_ebook_progress'
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE '%ebook_id%'
  LOOP
    EXECUTE format('ALTER TABLE user_ebook_progress DROP CONSTRAINT IF EXISTS %I CASCADE', constraint_record.constraint_name);
    RAISE NOTICE 'Dropped constraint: %', constraint_record.constraint_name;
  END LOOP;
END $$;

-- 3. Verifica se ainda existe alguma FK para ebook_id
SELECT
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'user_ebook_progress'::regclass
AND contype = 'f'; -- f = foreign key

-- ✅ Se não aparecer nenhuma FK com ebook_id, está resolvido

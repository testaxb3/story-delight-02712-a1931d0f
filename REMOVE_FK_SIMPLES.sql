-- ==========================================
-- REMOVER FOREIGN KEY - VERSÃO SIMPLES
-- ==========================================
-- Execute APENAS este arquivo
-- ==========================================

-- Remove TODAS as foreign keys que referenciam ebook_id
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT constraint_name
    FROM information_schema.table_constraints
    WHERE table_name = 'user_ebook_progress'
    AND constraint_type = 'FOREIGN KEY'
  LOOP
    EXECUTE 'ALTER TABLE user_ebook_progress DROP CONSTRAINT ' || quote_ident(r.constraint_name) || ' CASCADE';
    RAISE NOTICE 'Removido: %', r.constraint_name;
  END LOOP;
END $$;

-- Verifica o resultado
SELECT
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'user_ebook_progress';

-- Se não aparecer nenhuma FOREIGN KEY, está resolvido ✅

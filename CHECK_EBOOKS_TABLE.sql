-- ==========================================
-- CHECK EBOOKS TABLE
-- ==========================================
-- Verifica se a tabela ebooks existe e quais IDs estão cadastrados
-- ==========================================

-- 1. Check if ebooks table exists
SELECT
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_name = 'ebooks';

-- 2. Check all ebook IDs
SELECT id, title, created_at
FROM ebooks
ORDER BY created_at DESC;

-- 3. Search for sibling-fighting ebook
SELECT *
FROM ebooks
WHERE id LIKE '%sibling%';

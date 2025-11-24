-- ==========================================
-- FIX EBOOK FOREIGN KEY CONSTRAINT
-- ==========================================
-- Remove a foreign key constraint que está bloqueando o insert
-- Isso permite usar qualquer ebook_id sem precisar cadastrar na tabela ebooks
-- ==========================================

-- Drop the foreign key constraint
ALTER TABLE user_ebook_progress
DROP CONSTRAINT IF EXISTS user_ebook_progress_ebook_id_fkey;

-- Verify constraint was removed
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'user_ebook_progress'::regclass;

-- ✅ You should NOT see user_ebook_progress_ebook_id_fkey anymore
-- ✅ Only user_id FK and unique constraint should remain

-- ==========================================
-- DEBUG USER EBOOK PROGRESS
-- ==========================================
-- Execute este SQL no Supabase Dashboard
-- Para diagnosticar o problema
-- ==========================================

-- 1. Check if table exists
SELECT
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_name = 'user_ebook_progress';

-- 2. Check table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_ebook_progress'
ORDER BY ordinal_position;

-- 3. Check RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'user_ebook_progress';

-- 4. Check policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_ebook_progress';

-- 5. Try to query as current user (should work if RLS is correct)
SELECT * FROM user_ebook_progress LIMIT 1;

-- 6. Check if there are any constraints causing issues
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'user_ebook_progress'::regclass;

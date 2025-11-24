-- ==========================================
-- FIX EBOOK FOREIGN KEY - FINAL
-- ==========================================
-- Remove foreign key e força reload do PostgREST
-- ==========================================

-- 1. Drop the problematic foreign key
ALTER TABLE user_ebook_progress
DROP CONSTRAINT IF EXISTS user_ebook_progress_ebook_id_fkey CASCADE;

-- 2. Verify it was removed
DO $$
DECLARE
  fk_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'user_ebook_progress'::regclass
    AND conname = 'user_ebook_progress_ebook_id_fkey'
  ) INTO fk_exists;

  IF fk_exists THEN
    RAISE EXCEPTION 'Foreign key still exists!';
  ELSE
    RAISE NOTICE '✅ Foreign key successfully removed';
  END IF;
END $$;

-- 3. Check remaining constraints (should only have user_id FK and unique)
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'user_ebook_progress'::regclass
ORDER BY conname;

-- 4. Force PostgREST schema reload (if using Supabase)
NOTIFY pgrst, 'reload schema';

-- 5. Test query (should work now)
SELECT COUNT(*) as total_progress FROM user_ebook_progress;

-- ✅ If you see "Foreign key successfully removed" - it's fixed!

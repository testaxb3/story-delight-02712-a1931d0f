-- ==========================================
-- REMOVE EBOOK FOREIGN KEY CONSTRAINT
-- ==========================================
-- Allows any ebook_id without requiring it to exist in ebooks table
-- This fixes 400 errors when tracking progress for ebooks not in the ebooks table

ALTER TABLE user_ebook_progress
DROP CONSTRAINT IF EXISTS user_ebook_progress_ebook_id_fkey;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Foreign key constraint removed from user_ebook_progress';
  RAISE NOTICE 'You can now track progress for any ebook_id';
END $$;

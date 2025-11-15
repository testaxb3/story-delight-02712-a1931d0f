-- Add database constraint for bonus categories
DO $$ 
BEGIN
  -- Add check constraint for valid bonus categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'bonuses_category_check'
  ) THEN
    ALTER TABLE bonuses
    ADD CONSTRAINT bonuses_category_check 
    CHECK (category IN ('video', 'ebook', 'pdf', 'tool', 'template', 'session'));
  END IF;
END $$;

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_bonuses_category ON bonuses(category);

-- Create index on user_bonuses for faster progress lookups
CREATE INDEX IF NOT EXISTS idx_user_bonuses_user_bonus ON user_bonuses(user_id, bonus_id);

-- Add comment explaining the sync
COMMENT ON TRIGGER auto_sync_bonus_progress ON user_ebook_progress IS 
'Automatically syncs ebook reading progress to bonus completion progress';

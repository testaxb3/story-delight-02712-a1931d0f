-- Phase 1: Critical Bonuses Page Fixes

-- =======================
-- 1. CLEANUP ORPHANED EBOOKS
-- =======================

-- Identify and link orphaned ebooks to bonuses if possible
DO $$
DECLARE
  orphaned_ebook RECORD;
  matching_bonus_id UUID;
BEGIN
  -- Find ebooks without bonus_id but with matching bonus by title
  FOR orphaned_ebook IN 
    SELECT e.id, e.title 
    FROM ebooks e 
    WHERE e.bonus_id IS NULL 
      AND e.deleted_at IS NULL
  LOOP
    -- Try to find matching bonus by normalized title
    SELECT b.id INTO matching_bonus_id
    FROM bonuses b
    WHERE LOWER(TRIM(b.title)) = LOWER(TRIM(orphaned_ebook.title))
      AND b.category = 'ebook'
    LIMIT 1;
    
    IF matching_bonus_id IS NOT NULL THEN
      -- Link the ebook to the bonus
      UPDATE ebooks 
      SET bonus_id = matching_bonus_id 
      WHERE id = orphaned_ebook.id;
      
      -- Update bonus with ebook view URL
      UPDATE bonuses
      SET view_url = '/ebook/' || orphaned_ebook.id
      WHERE id = matching_bonus_id;
      
      RAISE NOTICE 'Linked ebook % to bonus %', orphaned_ebook.title, matching_bonus_id;
    END IF;
  END LOOP;
END $$;

-- =======================
-- 2. ADD RLS POLICIES FOR user_bonuses
-- =======================

-- Enable RLS if not already enabled
ALTER TABLE user_bonuses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own bonus progress" ON user_bonuses;
DROP POLICY IF EXISTS "Users can insert their own bonus progress" ON user_bonuses;
DROP POLICY IF EXISTS "Users can update their own bonus progress" ON user_bonuses;
DROP POLICY IF EXISTS "Users can delete their own bonus progress" ON user_bonuses;

-- Users can view their own progress
CREATE POLICY "Users can view their own bonus progress"
ON user_bonuses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert their own bonus progress"
ON user_bonuses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own bonus progress"
ON user_bonuses
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete their own bonus progress"
ON user_bonuses
FOR DELETE
USING (auth.uid() = user_id);

-- =======================
-- 3. IMPROVE sync_bonus_progress FUNCTION
-- =======================

-- Drop and recreate the function with better logic
CREATE OR REPLACE FUNCTION public.sync_bonus_progress(p_ebook_id uuid, p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_bonus_id UUID;
  v_total_chapters INTEGER;
  v_completed_count INTEGER;
  v_progress_percentage INTEGER;
  v_is_completed BOOLEAN;
BEGIN
  -- Find bonus linked to this ebook
  SELECT e.bonus_id, e.total_chapters
  INTO v_bonus_id, v_total_chapters
  FROM ebooks e
  WHERE e.id = p_ebook_id
    AND e.deleted_at IS NULL;

  -- If no bonus linked, return early
  IF v_bonus_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'No bonus linked to this ebook'
    );
  END IF;

  -- Get user's ebook progress
  SELECT COALESCE(array_length(completed_chapters, 1), 0)
  INTO v_completed_count
  FROM user_ebook_progress
  WHERE ebook_id = p_ebook_id
    AND user_id = p_user_id;

  -- Default to 0 if no progress found
  v_completed_count := COALESCE(v_completed_count, 0);

  -- Calculate percentage
  IF v_total_chapters > 0 THEN
    v_progress_percentage := ROUND((v_completed_count::NUMERIC / v_total_chapters::NUMERIC) * 100);
  ELSE
    v_progress_percentage := 0;
  END IF;

  -- Mark as completed if 100%
  v_is_completed := v_progress_percentage >= 100;

  -- Upsert user_bonuses table
  INSERT INTO user_bonuses (user_id, bonus_id, progress, completed_at, updated_at)
  VALUES (
    p_user_id,
    v_bonus_id,
    v_progress_percentage,
    CASE WHEN v_is_completed THEN NOW() ELSE NULL END,
    NOW()
  )
  ON CONFLICT (user_id, bonus_id) 
  DO UPDATE SET
    progress = EXCLUDED.progress,
    completed_at = CASE 
      WHEN EXCLUDED.progress >= 100 THEN COALESCE(user_bonuses.completed_at, NOW())
      ELSE NULL 
    END,
    updated_at = NOW();

  RETURN json_build_object(
    'success', true,
    'bonus_id', v_bonus_id,
    'progress', v_progress_percentage,
    'completed', v_is_completed,
    'completed_chapters', v_completed_count,
    'total_chapters', v_total_chapters
  );
END;
$$;

-- =======================
-- 4. ADD TRIGGER TO AUTO-SYNC PROGRESS
-- =======================

-- Function to trigger sync after ebook progress update
CREATE OR REPLACE FUNCTION trigger_sync_bonus_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call sync function asynchronously (best effort)
  PERFORM sync_bonus_progress(NEW.ebook_id, NEW.user_id);
  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS auto_sync_bonus_progress ON user_ebook_progress;

-- Create trigger on user_ebook_progress
CREATE TRIGGER auto_sync_bonus_progress
AFTER INSERT OR UPDATE ON user_ebook_progress
FOR EACH ROW
EXECUTE FUNCTION trigger_sync_bonus_progress();

-- =======================
-- 5. ADD UNIQUE CONSTRAINT IF MISSING
-- =======================

-- Ensure user_bonuses has unique constraint on (user_id, bonus_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_bonuses_user_id_bonus_id_key'
  ) THEN
    ALTER TABLE user_bonuses 
    ADD CONSTRAINT user_bonuses_user_id_bonus_id_key 
    UNIQUE (user_id, bonus_id);
  END IF;
END $$;
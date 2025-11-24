-- ==========================================
-- FIX USER EBOOK PROGRESS TABLE
-- ==========================================
-- Execute este SQL no Supabase Dashboard
-- Corrige a tabela user_ebook_progress e RLS policies
-- ==========================================

-- Create table if not exists
CREATE TABLE IF NOT EXISTS user_ebook_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ebook_id TEXT NOT NULL,
  current_chapter INTEGER NOT NULL DEFAULT 0,
  completed_chapters INTEGER[] DEFAULT '{}',
  scroll_position INTEGER DEFAULT 0,
  last_read_at TIMESTAMPTZ,
  first_read_at TIMESTAMPTZ DEFAULT now(),
  reading_time_minutes INTEGER DEFAULT 0,
  sessions_count INTEGER DEFAULT 0,
  bookmarks JSONB DEFAULT '[]'::jsonb,
  notes JSONB DEFAULT '{}'::jsonb,
  highlights JSONB DEFAULT '{}'::jsonb,
  reading_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, ebook_id)
);

-- Enable RLS
ALTER TABLE user_ebook_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own ebook progress" ON user_ebook_progress;
DROP POLICY IF EXISTS "Users can insert own ebook progress" ON user_ebook_progress;
DROP POLICY IF EXISTS "Users can update own ebook progress" ON user_ebook_progress;
DROP POLICY IF EXISTS "Users can delete own ebook progress" ON user_ebook_progress;

-- Create RLS policies
CREATE POLICY "Users can view own ebook progress"
ON user_ebook_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ebook progress"
ON user_ebook_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ebook progress"
ON user_ebook_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ebook progress"
ON user_ebook_progress
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_ebook_progress_user_id
ON user_ebook_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_user_ebook_progress_ebook_id
ON user_ebook_progress(ebook_id);

CREATE INDEX IF NOT EXISTS idx_user_ebook_progress_last_read
ON user_ebook_progress(user_id, last_read_at DESC);

-- Create helper functions

-- Function to mark chapter as complete
CREATE OR REPLACE FUNCTION mark_chapter_complete(
  p_ebook_id TEXT,
  p_chapter_index INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_ebook_progress (
    user_id,
    ebook_id,
    current_chapter,
    completed_chapters,
    last_read_at
  )
  VALUES (
    auth.uid(),
    p_ebook_id,
    p_chapter_index,
    ARRAY[p_chapter_index],
    now()
  )
  ON CONFLICT (user_id, ebook_id) DO UPDATE SET
    completed_chapters = CASE
      WHEN p_chapter_index = ANY(user_ebook_progress.completed_chapters)
      THEN user_ebook_progress.completed_chapters
      ELSE array_append(user_ebook_progress.completed_chapters, p_chapter_index)
    END,
    last_read_at = now();
END;
$$;

-- Function to update reading time
CREATE OR REPLACE FUNCTION update_reading_time(
  p_ebook_id TEXT,
  p_minutes_delta INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_ebook_progress (
    user_id,
    ebook_id,
    reading_time_minutes,
    sessions_count,
    last_read_at
  )
  VALUES (
    auth.uid(),
    p_ebook_id,
    p_minutes_delta,
    1,
    now()
  )
  ON CONFLICT (user_id, ebook_id) DO UPDATE SET
    reading_time_minutes = COALESCE(user_ebook_progress.reading_time_minutes, 0) + p_minutes_delta,
    sessions_count = COALESCE(user_ebook_progress.sessions_count, 0) + 1,
    last_read_at = now();
END;
$$;

-- Function to add bookmark
CREATE OR REPLACE FUNCTION add_bookmark(
  p_ebook_id TEXT,
  p_chapter INTEGER,
  p_position INTEGER,
  p_label TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_bookmarks JSONB;
  v_new_bookmark JSONB;
BEGIN
  -- Get current bookmarks
  SELECT bookmarks INTO v_bookmarks
  FROM user_ebook_progress
  WHERE user_id = auth.uid() AND ebook_id = p_ebook_id;

  -- Create new bookmark
  v_new_bookmark = jsonb_build_object(
    'chapter', p_chapter,
    'position', p_position,
    'label', p_label,
    'timestamp', now()
  );

  -- Add to array
  v_bookmarks = COALESCE(v_bookmarks, '[]'::jsonb) || jsonb_build_array(v_new_bookmark);

  -- Update or insert
  INSERT INTO user_ebook_progress (
    user_id,
    ebook_id,
    bookmarks,
    last_read_at
  )
  VALUES (
    auth.uid(),
    p_ebook_id,
    v_bookmarks,
    now()
  )
  ON CONFLICT (user_id, ebook_id) DO UPDATE SET
    bookmarks = v_bookmarks,
    last_read_at = now();
END;
$$;

-- Verify table and policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'user_ebook_progress';

-- ✅ You should see 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- Fix ebook progress RPC functions to accept UUID instead of TEXT
-- This fixes the 400 Bad Request errors when saving progress

-- Drop existing functions
DROP FUNCTION IF EXISTS public.mark_chapter_complete(TEXT, INTEGER);
DROP FUNCTION IF EXISTS public.update_reading_time(TEXT, INTEGER);
DROP FUNCTION IF EXISTS public.add_bookmark(TEXT, INTEGER, INTEGER, TEXT);

-- Recreate mark_chapter_complete with UUID
CREATE OR REPLACE FUNCTION public.mark_chapter_complete(p_ebook_id UUID, p_chapter_index INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  -- Validate UUID
  IF p_ebook_id IS NULL THEN
    RAISE EXCEPTION 'ebook_id cannot be null';
  END IF;

  INSERT INTO public.user_ebook_progress (user_id, ebook_id, completed_chapters)
  VALUES (
    auth.uid(),
    p_ebook_id,
    ARRAY[p_chapter_index]
  )
  ON CONFLICT (user_id, ebook_id) DO UPDATE
  SET 
    completed_chapters = (
      SELECT ARRAY(
        SELECT DISTINCT unnest(user_ebook_progress.completed_chapters || ARRAY[p_chapter_index])
      )
    ),
    last_read_at = NOW();
END;
$function$;

-- Recreate update_reading_time with UUID
CREATE OR REPLACE FUNCTION public.update_reading_time(p_ebook_id UUID, p_minutes_delta INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  -- Validate UUID
  IF p_ebook_id IS NULL THEN
    RAISE EXCEPTION 'ebook_id cannot be null';
  END IF;

  INSERT INTO public.user_ebook_progress (user_id, ebook_id, reading_time_minutes, sessions_count)
  VALUES (auth.uid(), p_ebook_id, p_minutes_delta, 1)
  ON CONFLICT (user_id, ebook_id) DO UPDATE
  SET 
    reading_time_minutes = user_ebook_progress.reading_time_minutes + p_minutes_delta,
    sessions_count = user_ebook_progress.sessions_count + 1,
    last_read_at = NOW();
END;
$function$;

-- Recreate add_bookmark with UUID
CREATE OR REPLACE FUNCTION public.add_bookmark(p_ebook_id UUID, p_chapter INTEGER, p_position INTEGER, p_label TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $function$
DECLARE
  v_bookmarks JSONB;
  v_new_bookmark JSONB;
BEGIN
  -- Validate UUID
  IF p_ebook_id IS NULL THEN
    RAISE EXCEPTION 'ebook_id cannot be null';
  END IF;

  SELECT bookmarks INTO v_bookmarks
  FROM public.user_ebook_progress
  WHERE user_id = auth.uid() AND ebook_id = p_ebook_id;
  
  IF v_bookmarks IS NULL THEN
    v_bookmarks := '[]'::jsonb;
  END IF;
  
  v_new_bookmark := jsonb_build_object(
    'chapter', p_chapter,
    'position', p_position,
    'label', p_label,
    'created_at', NOW()
  );
  
  v_bookmarks := v_bookmarks || v_new_bookmark;
  
  INSERT INTO public.user_ebook_progress (user_id, ebook_id, bookmarks)
  VALUES (auth.uid(), p_ebook_id, v_bookmarks)
  ON CONFLICT (user_id, ebook_id) DO UPDATE
  SET bookmarks = v_bookmarks, last_read_at = NOW();
END;
$function$;
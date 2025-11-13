-- ============================================================================
-- IMPORTANTE: Execute este script no Supabase Dashboard SQL Editor
-- ============================================================================
--
-- Para aplicar esta migration:
-- 1. Abra seu projeto no Supabase Dashboard (https://app.supabase.com)
-- 2. Vá para SQL Editor
-- 3. Cole este código e clique em RUN
--
-- ============================================================================

-- Add age-based video sections to videos table
-- Drop the old check constraint
ALTER TABLE public.videos DROP CONSTRAINT IF EXISTS videos_section_check;

-- Add new check constraint with both learning-based and age-based sections
ALTER TABLE public.videos
  ADD CONSTRAINT videos_section_check
  CHECK (section IN (
    'foundation',
    'practice',
    'mastery',
    'ages-1-2',
    'ages-3-4',
    'ages-5-plus'
  ));

-- Comment explaining the sections
COMMENT ON COLUMN public.videos.section IS 'Video section: foundation/practice/mastery (learning-based) or ages-1-2/ages-3-4/ages-5-plus (age-based)';

-- Verificar se funcionou
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'videos_section_check';

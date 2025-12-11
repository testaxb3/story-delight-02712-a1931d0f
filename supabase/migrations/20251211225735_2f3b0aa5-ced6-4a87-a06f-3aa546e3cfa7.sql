-- Create favorite_lessons table
CREATE TABLE public.favorite_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.favorite_lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own favorite lessons"
  ON public.favorite_lessons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite lessons"
  ON public.favorite_lessons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite lessons"
  ON public.favorite_lessons FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_favorite_lessons_user_program ON public.favorite_lessons(user_id, program_id);
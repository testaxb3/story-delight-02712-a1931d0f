-- =============================================
-- PROGRAMS SYSTEM - Complete Schema
-- =============================================

-- 1. Create programs table
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  age_range TEXT,
  total_lessons INTEGER DEFAULT 30,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'coming_soon', 'completed')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create program_votes table (for coming_soon voting)
CREATE TABLE public.program_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(program_id, user_id)
);

-- 3. Add program_id to lessons table
ALTER TABLE public.lessons 
ADD COLUMN program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE;

-- 4. Create user_program_progress table
CREATE TABLE public.user_program_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  lessons_completed INTEGER[] DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, program_id)
);

-- 5. Create program_badges table
CREATE TABLE public.program_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement_type TEXT CHECK (requirement_type IN ('lessons_completed', 'streak', 'first_complete', 'all_complete')),
  requirement_value INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create user_program_badges table
CREATE TABLE public.user_program_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_badge_id UUID NOT NULL REFERENCES public.program_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, program_badge_id)
);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Programs: Everyone can view, admins can manage
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view programs"
ON public.programs FOR SELECT
USING (true);

CREATE POLICY "Admins can manage programs"
ON public.programs FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Program Votes: Users can manage their own votes
ALTER TABLE public.program_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all votes"
ON public.program_votes FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own votes"
ON public.program_votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
ON public.program_votes FOR DELETE
USING (auth.uid() = user_id);

-- User Program Progress: Users can manage their own progress
ALTER TABLE public.user_program_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
ON public.user_program_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.user_program_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_program_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Program Badges: Everyone can view
ALTER TABLE public.program_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view program badges"
ON public.program_badges FOR SELECT
USING (true);

CREATE POLICY "Admins can manage program badges"
ON public.program_badges FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- User Program Badges: Users can view their own
ALTER TABLE public.user_program_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges"
ON public.user_program_badges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert badges"
ON public.user_program_badges FOR INSERT
WITH CHECK (true);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_programs_status ON public.programs(status);
CREATE INDEX idx_programs_display_order ON public.programs(display_order);
CREATE INDEX idx_lessons_program_id ON public.lessons(program_id);
CREATE INDEX idx_program_votes_program_id ON public.program_votes(program_id);
CREATE INDEX idx_user_program_progress_user_id ON public.user_program_progress(user_id);
CREATE INDEX idx_user_program_progress_program_id ON public.user_program_progress(program_id);

-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_programs_updated_at
BEFORE UPDATE ON public.programs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_program_progress_updated_at
BEFORE UPDATE ON public.user_program_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- SEED DATA - Sample Programs
-- =============================================
INSERT INTO public.programs (slug, title, description, age_range, total_lessons, status, display_order) VALUES
('calm-parent-challenge', 'The Calm Parent Challenge', 'Transform your relationship with your child in 30 days. Learn the exact phrases and strategies that create cooperation without yelling.', 'Ages 3-12', 30, 'active', 1),
('sibling-harmony', 'Sibling Harmony', 'End the fighting and create a peaceful home where siblings actually enjoy each other.', 'Ages 4-14', 30, 'coming_soon', 2),
('teen-communication', 'Teen Communication Mastery', 'Bridge the gap and rebuild connection with your teenager using science-backed approaches.', 'Ages 12-18', 30, 'coming_soon', 3);

-- =============================================
-- SEED DATA - Program Badges
-- =============================================
INSERT INTO public.program_badges (program_id, name, description, icon, requirement_type, requirement_value, display_order)
SELECT 
  p.id,
  badge.name,
  badge.description,
  badge.icon,
  badge.requirement_type,
  badge.requirement_value,
  badge.display_order
FROM public.programs p
CROSS JOIN (
  VALUES 
    ('First Step', 'Complete your first lesson', '🌱', 'lessons_completed', 1, 1),
    ('Week One', 'Complete 7 lessons', '⭐', 'lessons_completed', 7, 2),
    ('Halfway There', 'Complete 15 lessons', '🔥', 'lessons_completed', 15, 3),
    ('Almost Done', 'Complete 25 lessons', '💪', 'lessons_completed', 25, 4),
    ('Champion', 'Complete all 30 lessons', '🏆', 'all_complete', 30, 5)
) AS badge(name, description, icon, requirement_type, requirement_value, display_order)
WHERE p.slug = 'calm-parent-challenge';

-- Link existing lessons to the first program
UPDATE public.lessons 
SET program_id = (SELECT id FROM public.programs WHERE slug = 'calm-parent-challenge' LIMIT 1)
WHERE program_id IS NULL;
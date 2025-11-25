-- Create routines table
CREATE TABLE public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_profile_id UUID REFERENCES public.child_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '📋',
  color TEXT DEFAULT '#8B5CF6',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create routine_steps table
CREATE TABLE public.routine_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '✓',
  duration_seconds INTEGER DEFAULT 60,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create routine_completions table
CREATE TABLE public.routine_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_profile_id UUID REFERENCES public.child_profiles(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  mood_before TEXT CHECK (mood_before IN ('happy', 'neutral', 'sad', 'frustrated')),
  mood_after TEXT CHECK (mood_after IN ('happy', 'neutral', 'sad', 'frustrated')),
  duration_seconds INTEGER,
  steps_completed INTEGER DEFAULT 0
);

-- Create routine_templates table
CREATE TABLE public.routine_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  brain_profile TEXT CHECK (brain_profile IN ('INTENSE', 'DISTRACTED', 'DEFIANT', 'UNIVERSAL')),
  icon TEXT DEFAULT '📋',
  color TEXT DEFAULT '#8B5CF6',
  template_steps JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for routines
CREATE POLICY "Users can view own routines"
  ON public.routines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own routines"
  ON public.routines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
  ON public.routines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines"
  ON public.routines FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for routine_steps
CREATE POLICY "Users can view steps of own routines"
  ON public.routine_steps FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_steps.routine_id
    AND routines.user_id = auth.uid()
  ));

CREATE POLICY "Users can create steps in own routines"
  ON public.routine_steps FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_steps.routine_id
    AND routines.user_id = auth.uid()
  ));

CREATE POLICY "Users can update steps in own routines"
  ON public.routine_steps FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_steps.routine_id
    AND routines.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete steps in own routines"
  ON public.routine_steps FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_steps.routine_id
    AND routines.user_id = auth.uid()
  ));

-- RLS Policies for routine_completions
CREATE POLICY "Users can view own completions"
  ON public.routine_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own completions"
  ON public.routine_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for routine_templates
CREATE POLICY "Anyone can view templates"
  ON public.routine_templates FOR SELECT
  USING (true);

-- Insert initial templates
INSERT INTO public.routine_templates (title, description, brain_profile, icon, color, template_steps) VALUES
('Morning Routine - INTENSE', 'Calming start to prevent morning meltdowns', 'INTENSE', '🌅', '#FF6B6B', 
  '[
    {"title": "Wake up gently", "icon": "😴", "duration": 120},
    {"title": "Drink water", "icon": "💧", "duration": 60},
    {"title": "Stretching", "icon": "🤸", "duration": 180},
    {"title": "Breakfast", "icon": "🍳", "duration": 900},
    {"title": "Brush teeth", "icon": "🪥", "duration": 120},
    {"title": "Get dressed", "icon": "👕", "duration": 300}
  ]'::jsonb
),
('Bedtime Routine - INTENSE', 'Calm wind-down for better sleep', 'INTENSE', '🌙', '#9B59B6', 
  '[
    {"title": "Bath time", "icon": "🛁", "duration": 600},
    {"title": "Pajamas", "icon": "👚", "duration": 180},
    {"title": "Story time", "icon": "📖", "duration": 900},
    {"title": "Goodnight hug", "icon": "🤗", "duration": 120},
    {"title": "Lights out", "icon": "💡", "duration": 60}
  ]'::jsonb
),
('Homework Time - DISTRACTED', 'Focus routine for homework', 'DISTRACTED', '📚', '#3498DB', 
  '[
    {"title": "Clear desk", "icon": "🧹", "duration": 180},
    {"title": "Get materials", "icon": "✏️", "duration": 120},
    {"title": "Set timer", "icon": "⏰", "duration": 60},
    {"title": "Work block", "icon": "💪", "duration": 1200},
    {"title": "Break time", "icon": "🎮", "duration": 300}
  ]'::jsonb
),
('After School - DEFIANT', 'Smooth transition from school', 'DEFIANT', '🏠', '#E67E22', 
  '[
    {"title": "Take off shoes", "icon": "👟", "duration": 60},
    {"title": "Snack time", "icon": "🍎", "duration": 600},
    {"title": "Free play", "icon": "🎨", "duration": 1800},
    {"title": "Homework check", "icon": "✅", "duration": 300}
  ]'::jsonb
);

-- Add bonus entry for the tool
INSERT INTO public.bonuses (
  title,
  description,
  category,
  view_url,
  thumbnail,
  tags,
  locked
) VALUES (
  'Visual Routine Builder',
  'Create visual step-by-step routines that help your child know what comes next. Perfect for morning routines, bedtime, homework time, and transitions. Build predictability and reduce resistance.',
  'tool',
  '/tools/routine-builder',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
  ARRAY['routines', 'visual', 'predictability', 'transitions', 'independence'],
  false
);
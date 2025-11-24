-- ============================================================================
-- MIGRATION: Sistema de Badges - Estrutura completa
-- ============================================================================

-- Garantir que user_badges existe com estrutura correta
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned_at ON public.user_badges(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_badges_category ON public.badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_requirement ON public.badges(requirement);

-- RLS policies para user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own badges" ON public.user_badges;
CREATE POLICY "Users can view their own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view badges of community members" ON public.user_badges;
CREATE POLICY "Users can view badges of community members"
  ON public.user_badges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm1
      JOIN community_members cm2 ON cm1.community_id = cm2.community_id
      WHERE cm1.user_id = auth.uid() AND cm2.user_id = user_badges.user_id
    )
  );

DROP POLICY IF EXISTS "System can insert badges" ON public.user_badges;
CREATE POLICY "System can insert badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (true);

-- Limpar badges antigos para garantir dados consistentes
TRUNCATE TABLE public.badges CASCADE;

-- ============================================================================
-- 🔥 STREAK BADGES (7 badges)
-- ============================================================================
INSERT INTO public.badges (name, description, category, icon, requirement) VALUES
('Rookie Streak', 'Complete 3 dias consecutivos no tracker', 'streak', '🌱', '3_day_streak'),
('Week Warrior', 'Mantenha uma sequência de 7 dias consecutivos', 'streak', '⭐', '7_day_streak'),
('Dedicated Parent', 'Impressionante! 14 dias seguidos de dedicação', 'streak', '💪', '14_day_streak'),
('Monthly Master', 'Um mês inteiro de consistência! Parabéns!', 'streak', '🏆', '30_day_streak'),
('Locked In', 'Você está imparável! 50 dias consecutivos', 'streak', '🔥', '50_day_streak'),
('Triple Threat', 'Lendário! 100 dias sem parar', 'streak', '👑', '100_day_streak'),
('No Days Off', 'Incrível! Um ano completo de dedicação', 'streak', '💎', '365_day_streak'),

-- ============================================================================
-- 📖 SCRIPTS BADGES (5 badges)
-- ============================================================================
('First Script', 'Usou seu primeiro script! Bem-vindo à jornada', 'scripts', '📝', '1_script_used'),
('Learning', 'Experimentou 5 scripts diferentes', 'scripts', '📚', '5_scripts_used'),
('Experienced', 'Já usou 10 scripts! Você está pegando o jeito', 'scripts', '🎯', '10_scripts_used'),
('Script Expert', 'Impressionante! 25 scripts utilizados', 'scripts', '🌟', '25_scripts_used'),
('Master Parent', 'Incrível! 50 scripts dominados', 'scripts', '👨‍🎓', '50_scripts_used'),

-- ============================================================================
-- 🎬 VIDEOS BADGES (4 badges)
-- ============================================================================
('First Watch', 'Assistiu seu primeiro vídeo educativo', 'videos', '▶️', '1_video_watched'),
('Curious Mind', 'Explorou 3 vídeos diferentes', 'videos', '🎥', '3_videos_watched'),
('Engaged Learner', 'Assistiu 10 vídeos! Sempre aprendendo', 'videos', '📺', '10_videos_watched'),
('Video Graduate', 'Completou 25 vídeos! Expert em aprendizado', 'videos', '🎓', '25_videos_watched'),

-- ============================================================================
-- 📝 TRACKER BADGES (5 badges)
-- ============================================================================
('First Day', 'Registrou seu primeiro dia no tracker', 'tracker', '✅', '1_day_completed'),
('Getting Started', 'Completou 7 dias no tracker', 'tracker', '📅', '7_days_completed'),
('Committed', 'Registrou 14 dias de progresso', 'tracker', '📊', '14_days_completed'),
('Strong Foundation', 'Um mês de tracking! 30 dias completados', 'tracker', '🏗️', '30_days_completed'),
('Transformation', 'Incrível! 60 dias de jornada documentada', 'tracker', '🦋', '60_days_completed'),

-- ============================================================================
-- 💬 COMMUNITY BADGES (5 badges)
-- ============================================================================
('Hello World', 'Compartilhou seu primeiro post na comunidade', 'community', '👋', '1_post_created'),
('Active Member', 'Criou 5 posts! Você faz parte da comunidade', 'community', '💬', '5_posts_created'),
('Community Star', 'Já compartilhou 10 experiências', 'community', '⭐', '10_posts_created'),
('Inspiring Leader', 'Incrível! 25 posts ajudando outros pais', 'community', '🌟', '25_posts_created'),
('Helpful Hero', 'Recebeu 50 reações em seus posts', 'community', '❤️', '50_likes_received'),

-- ============================================================================
-- 🏆 SPECIAL BADGES (4 badges)
-- ============================================================================
('Perfect Week', 'Completou 7 dias seguidos sem falhar nenhum', 'special', '✨', 'perfect_week'),
('Early Bird', 'Registrou atividades antes das 8h da manhã 5 vezes', 'special', '🌅', 'early_bird_5x'),
('Night Owl', 'Fez registros depois da meia-noite 5 vezes', 'special', '🦉', 'night_owl_5x'),
('Weekend Warrior', 'Manteve consistência nos finais de semana - 10 sábados ou domingos', 'special', '🎯', 'weekend_warrior');
-- ============================================
-- GAMIFICATION SYSTEM: Badges & Achievements
-- ============================================

-- 1. Clear existing badges and insert new definitions
-- ============================================

TRUNCATE badges CASCADE;

-- 🔥 STREAK BADGES
INSERT INTO badges (name, description, category, icon, requirement) VALUES
('Rookie', 'Complete 3 consecutive days', 'streak', '🔥', 'streak_days:3'),
('Week Warrior', 'Complete 7 consecutive days', 'streak', '⚡', 'streak_days:7'),
('Dedicated', 'Complete 14 consecutive days', 'streak', '💪', 'streak_days:14'),
('Monthly Master', 'Complete 30 consecutive days', 'streak', '🏆', 'streak_days:30'),
('Locked In', 'Complete 50 consecutive days', 'streak', '🔒', 'streak_days:50'),
('Triple Threat', 'Complete 100 consecutive days', 'streak', '💎', 'streak_days:100'),
('No Days Off', 'Complete 365 consecutive days', 'streak', '👑', 'streak_days:365'),

-- 📖 SCRIPT BADGES
('First Script', 'Use your first script', 'scripts', '📝', 'scripts_used:1'),
('Learning', 'Use 5 different scripts', 'scripts', '📚', 'scripts_used:5'),
('Experienced', 'Use 10 different scripts', 'scripts', '🎯', 'scripts_used:10'),
('Expert', 'Use 25 different scripts', 'scripts', '🌟', 'scripts_used:25'),
('Master Parent', 'Use 50 different scripts', 'scripts', '👨‍🏫', 'scripts_used:50'),

-- 🎬 VIDEO BADGES
('First Watch', 'Watch your first video', 'videos', '🎬', 'videos_watched:1'),
('Curious', 'Watch 3 videos', 'videos', '👀', 'videos_watched:3'),
('Engaged', 'Watch 10 videos', 'videos', '📺', 'videos_watched:10'),
('Video Graduate', 'Watch 25 videos', 'videos', '🎓', 'videos_watched:25'),

-- 📝 TRACKER BADGES
('First Day', 'Complete your first day', 'tracker', '✅', 'days_completed:1'),
('Getting Started', 'Complete 7 days total', 'tracker', '🌱', 'days_completed:7'),
('Committed', 'Complete 14 days total', 'tracker', '🌿', 'days_completed:14'),
('Strong Foundation', 'Complete 30 days total', 'tracker', '🌳', 'days_completed:30'),
('Transformation', 'Complete 60 days total', 'tracker', '🦋', 'days_completed:60'),

-- 💬 COMMUNITY BADGES
('Hello World', 'Create your first post', 'community', '👋', 'posts_created:1'),
('Active Member', 'Create 5 posts', 'community', '💬', 'posts_created:5'),
('Community Star', 'Create 10 posts', 'community', '⭐', 'posts_created:10'),
('Leader', 'Create 25 posts', 'community', '🚀', 'posts_created:25'),

-- 🏆 SPECIAL BADGES
('Early Adopter', 'Join during beta period', 'special', '🎖️', 'special:early_adopter'),
('Perfect Week', 'Complete 7 consecutive days without missing', 'special', '💯', 'special:perfect_week'),
('Night Owl', 'Log progress after midnight 3 times', 'special', '🦉', 'special:night_owl'),
('Morning Person', 'Log progress before 8am 3 times', 'special', '🌅', 'special:morning_person'),
('Helpful', 'Receive 5 reactions on your posts', 'special', '❤️', 'special:helpful');

-- 2. Create helper function to calculate current streak
-- ============================================

CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS TABLE(current_streak INT, longest_streak INT) AS $$
DECLARE
  v_current_streak INT := 0;
  v_longest_streak INT := 0;
  v_temp_streak INT := 0;
  v_last_date DATE := NULL;
  v_date_record RECORD;
BEGIN
  -- Calculate streaks from completed tracker days
  FOR v_date_record IN 
    SELECT date 
    FROM tracker_days 
    WHERE user_id = p_user_id AND completed = true
    ORDER BY date DESC
  LOOP
    IF v_last_date IS NULL THEN
      -- First iteration
      v_temp_streak := 1;
      v_current_streak := 1;
    ELSIF v_last_date - v_date_record.date = 1 THEN
      -- Consecutive day
      v_temp_streak := v_temp_streak + 1;
      v_current_streak := v_temp_streak;
    ELSE
      -- Break in streak
      v_temp_streak := 1;
    END IF;
    
    -- Track longest streak
    IF v_temp_streak > v_longest_streak THEN
      v_longest_streak := v_temp_streak;
    END IF;
    
    v_last_date := v_date_record.date;
  END LOOP;
  
  current_streak := COALESCE(v_current_streak, 0);
  longest_streak := COALESCE(v_longest_streak, 0);
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- 3. Create User Achievements Stats View
-- ============================================

CREATE OR REPLACE VIEW user_achievements_stats AS
SELECT 
  p.id as user_id,
  
  -- Streak stats (calculated)
  COALESCE((SELECT current_streak FROM calculate_user_streak(p.id)), 0) as current_streak,
  COALESCE((SELECT longest_streak FROM calculate_user_streak(p.id)), 0) as longest_streak,
  
  -- Days completed
  COALESCE(COUNT(DISTINCT CASE WHEN td.completed = true THEN td.date END), 0) as days_completed,
  
  -- Scripts used (distinct scripts)
  COALESCE(COUNT(DISTINCT su.script_id), 0) as scripts_used,
  
  -- Videos watched (distinct videos completed)
  COALESCE(COUNT(DISTINCT CASE WHEN vp.completed = true THEN vp.video_id END), 0) as videos_watched,
  
  -- Community posts
  COALESCE(COUNT(DISTINCT cp.id), 0) as posts_created,
  
  -- Reactions received on posts
  COALESCE(COUNT(DISTINCT pl.id), 0) as reactions_received,
  
  -- Badges unlocked
  COALESCE(COUNT(DISTINCT ub.badge_id), 0) as badges_unlocked,
  
  -- Special tracking for time-based achievements
  COALESCE(COUNT(DISTINCT CASE 
    WHEN EXTRACT(HOUR FROM td.completed_at) >= 0 AND EXTRACT(HOUR FROM td.completed_at) < 8 
    THEN td.date 
  END), 0) as morning_logs,
  
  COALESCE(COUNT(DISTINCT CASE 
    WHEN EXTRACT(HOUR FROM td.completed_at) >= 0 AND EXTRACT(HOUR FROM td.completed_at) < 6 
    THEN td.date 
  END), 0) as night_logs

FROM profiles p
LEFT JOIN tracker_days td ON td.user_id = p.id
LEFT JOIN script_usage su ON su.user_id = p.id
LEFT JOIN video_progress vp ON vp.user_id = p.id
LEFT JOIN community_posts cp ON cp.user_id = p.id
LEFT JOIN post_likes pl ON pl.post_id = cp.id
LEFT JOIN user_badges ub ON ub.user_id = p.id

GROUP BY p.id;

-- 4. Create Badge Unlock Function
-- ============================================

CREATE OR REPLACE FUNCTION check_and_unlock_badges(p_user_id UUID)
RETURNS TABLE(badge_id UUID, badge_name TEXT, badge_icon TEXT) AS $$
DECLARE
  v_stats RECORD;
  v_badge RECORD;
  v_requirement_type TEXT;
  v_requirement_value INT;
  v_unlocked BOOLEAN;
BEGIN
  -- Get user stats
  SELECT * INTO v_stats
  FROM user_achievements_stats
  WHERE user_id = p_user_id;

  -- Loop through all badges
  FOR v_badge IN 
    SELECT b.id, b.name, b.icon, b.requirement
    FROM badges b
    WHERE NOT EXISTS (
      SELECT 1 FROM user_badges ub 
      WHERE ub.user_id = p_user_id AND ub.badge_id = b.id
    )
  LOOP
    v_unlocked := FALSE;
    
    -- Parse requirement (format: "type:value")
    v_requirement_type := split_part(v_badge.requirement, ':', 1);
    v_requirement_value := NULLIF(split_part(v_badge.requirement, ':', 2), '')::INT;

    -- Check requirements
    CASE v_requirement_type
      WHEN 'streak_days' THEN
        v_unlocked := v_stats.current_streak >= v_requirement_value;
      
      WHEN 'scripts_used' THEN
        v_unlocked := v_stats.scripts_used >= v_requirement_value;
      
      WHEN 'videos_watched' THEN
        v_unlocked := v_stats.videos_watched >= v_requirement_value;
      
      WHEN 'days_completed' THEN
        v_unlocked := v_stats.days_completed >= v_requirement_value;
      
      WHEN 'posts_created' THEN
        v_unlocked := v_stats.posts_created >= v_requirement_value;
      
      WHEN 'special' THEN
        CASE split_part(v_badge.requirement, ':', 2)
          WHEN 'early_adopter' THEN
            v_unlocked := (SELECT created_at FROM profiles WHERE id = p_user_id) < '2025-01-01'::timestamp;
          
          WHEN 'perfect_week' THEN
            v_unlocked := v_stats.current_streak >= 7;
          
          WHEN 'night_owl' THEN
            v_unlocked := v_stats.night_logs >= 3;
          
          WHEN 'morning_person' THEN
            v_unlocked := v_stats.morning_logs >= 3;
          
          WHEN 'helpful' THEN
            v_unlocked := v_stats.reactions_received >= 5;
          
          ELSE
            v_unlocked := FALSE;
        END CASE;
      
      ELSE
        v_unlocked := FALSE;
    END CASE;

    -- If unlocked, insert into user_badges
    IF v_unlocked THEN
      INSERT INTO user_badges (user_id, badge_id, unlocked_at)
      VALUES (p_user_id, v_badge.id, NOW())
      ON CONFLICT (user_id, badge_id) DO NOTHING;
      
      -- Return unlocked badge info
      badge_id := v_badge.id;
      badge_name := v_badge.name;
      badge_icon := v_badge.icon;
      RETURN NEXT;
    END IF;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create Triggers for Auto-Unlock
-- ============================================

-- Trigger on tracker_days
CREATE OR REPLACE FUNCTION trigger_check_badges_tracker()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM check_and_unlock_badges(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_badges_on_tracker ON tracker_days;
CREATE TRIGGER check_badges_on_tracker
AFTER INSERT OR UPDATE ON tracker_days
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges_tracker();

-- Trigger on script_usage
CREATE OR REPLACE FUNCTION trigger_check_badges_scripts()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM check_and_unlock_badges(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_badges_on_scripts ON script_usage;
CREATE TRIGGER check_badges_on_scripts
AFTER INSERT ON script_usage
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges_scripts();

-- Trigger on video_progress
CREATE OR REPLACE FUNCTION trigger_check_badges_videos()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed = true THEN
    PERFORM check_and_unlock_badges(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_badges_on_videos ON video_progress;
CREATE TRIGGER check_badges_on_videos
AFTER UPDATE ON video_progress
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges_videos();

-- Trigger on community_posts
CREATE OR REPLACE FUNCTION trigger_check_badges_posts()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM check_and_unlock_badges(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_badges_on_posts ON community_posts;
CREATE TRIGGER check_badges_on_posts
AFTER INSERT ON community_posts
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges_posts();

-- Trigger on post_likes (for "Helpful" badge)
CREATE OR REPLACE FUNCTION trigger_check_badges_reactions()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id UUID;
BEGIN
  SELECT user_id INTO v_post_author_id
  FROM community_posts
  WHERE id = NEW.post_id;
  
  IF v_post_author_id IS NOT NULL THEN
    PERFORM check_and_unlock_badges(v_post_author_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_badges_on_reactions ON post_likes;
CREATE TRIGGER check_badges_on_reactions
AFTER INSERT ON post_likes
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges_reactions();

-- 6. Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_badges_user_badge ON user_badges(user_id, badge_id);
CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_tracker_days_user_date ON tracker_days(user_id, date, completed);
CREATE INDEX IF NOT EXISTS idx_script_usage_user ON script_usage(user_id, script_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_completed ON video_progress(user_id, video_id, completed);
CREATE INDEX IF NOT EXISTS idx_community_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
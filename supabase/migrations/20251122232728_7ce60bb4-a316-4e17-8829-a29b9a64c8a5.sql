-- =============================================
-- MIGRATION: Consolidate Videos into Bonuses
-- =============================================

-- STEP 1: Create backup tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'videos_backup_20250122') THEN
    CREATE TABLE videos_backup_20250122 AS SELECT * FROM videos;
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'video_progress_backup_20250122') THEN
    CREATE TABLE video_progress_backup_20250122 AS SELECT * FROM video_progress;
  END IF;
END $$;

-- STEP 2: Migrate videos to bonuses
INSERT INTO bonuses (
  id,
  title,
  description,
  category,
  thumbnail,
  duration,
  view_url,
  locked,
  tags,
  created_at,
  updated_at,
  is_new
)
SELECT 
  id,
  title,
  description,
  'video' as category,
  thumbnail_url as thumbnail,
  duration,
  video_url as view_url,
  COALESCE(locked, false) as locked,
  ARRAY[section] as tags,
  created_at,
  NOW() as updated_at,
  false as is_new
FROM videos
WHERE NOT EXISTS (
  SELECT 1 FROM bonuses WHERE bonuses.id = videos.id
);

-- STEP 3: Create user_bonus_progress table
CREATE TABLE IF NOT EXISTS user_bonus_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bonus_id UUID NOT NULL REFERENCES bonuses(id) ON DELETE CASCADE,
  progress_seconds INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, bonus_id)
);

-- STEP 4: Enable RLS
ALTER TABLE user_bonus_progress ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create RLS policy
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_bonus_progress' 
    AND policyname = 'Users can manage their own bonus progress'
  ) THEN
    CREATE POLICY "Users can manage their own bonus progress"
    ON user_bonus_progress
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- STEP 6: Migrate video progress
INSERT INTO user_bonus_progress (
  user_id,
  bonus_id,
  progress_seconds,
  total_duration_seconds,
  completed,
  last_accessed_at,
  created_at,
  updated_at
)
SELECT 
  vp.user_id,
  vp.video_id as bonus_id,
  COALESCE(vp.progress_seconds, 0),
  COALESCE(vp.total_duration_seconds, 0),
  COALESCE(vp.completed, false),
  COALESCE(vp.last_watched_at, NOW()),
  COALESCE(vp.created_at, NOW()),
  NOW()
FROM video_progress vp
WHERE NOT EXISTS (
  SELECT 1 FROM user_bonus_progress 
  WHERE user_bonus_progress.user_id = vp.user_id 
  AND user_bonus_progress.bonus_id = vp.video_id
);
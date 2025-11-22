-- Fix security issues: Enable RLS on backup tables
ALTER TABLE videos_backup_20250122 ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress_backup_20250122 ENABLE ROW LEVEL SECURITY;

-- Only admins can access backup tables
CREATE POLICY "Only admins can access videos backup"
ON videos_backup_20250122
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.is_admin = true
));

CREATE POLICY "Only admins can access video progress backup"
ON video_progress_backup_20250122
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.is_admin = true
));
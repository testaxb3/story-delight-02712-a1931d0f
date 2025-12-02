-- Create storage buckets for audio content (skip if exists)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('audio-tracks', 'audio-tracks', true),
  ('audio-covers', 'audio-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view audio tracks" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload audio tracks" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update audio tracks" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete audio tracks" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view audio covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload audio covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update audio covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete audio covers" ON storage.objects;

-- RLS policies for audio-tracks bucket
CREATE POLICY "Anyone can view audio tracks"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-tracks');

CREATE POLICY "Admins can upload audio tracks"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio-tracks' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update audio tracks"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'audio-tracks' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can delete audio tracks"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audio-tracks' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- RLS policies for audio-covers bucket
CREATE POLICY "Anyone can view audio covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-covers');

CREATE POLICY "Admins can upload audio covers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio-covers' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update audio covers"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'audio-covers' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can delete audio covers"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audio-covers' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);
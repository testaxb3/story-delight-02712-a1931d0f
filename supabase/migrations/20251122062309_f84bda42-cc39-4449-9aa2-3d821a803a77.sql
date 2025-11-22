-- Create RLS policies for community-images bucket
CREATE POLICY "Anyone can view community images"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-images');

CREATE POLICY "Users can upload to community-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'community-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their community images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'community-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their community images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'community-images'
  AND auth.role() = 'authenticated'
);
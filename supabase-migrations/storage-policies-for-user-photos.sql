-- Storage Policies for User Profile Photos
-- Execute this in Supabase SQL Editor to enable user photo uploads

-- ========================================
-- POLICIES FOR USER PHOTOS (user-photos/ folder)
-- ========================================

-- Policy 1: Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'user-photos' AND
  (storage.filename(name)) LIKE 'user-' || auth.uid()::text || '-%'
);

-- Policy 2: Allow authenticated users to update their own photos
CREATE POLICY "Users can update their own profile photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'user-photos' AND
  (storage.filename(name)) LIKE 'user-' || auth.uid()::text || '-%'
);

-- Policy 3: Allow authenticated users to delete their own photos
CREATE POLICY "Users can delete their own profile photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'user-photos' AND
  (storage.filename(name)) LIKE 'user-' || auth.uid()::text || '-%'
);

-- Policy 4: Allow public read access to user photos
CREATE POLICY "Anyone can view user profile photos"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'user-photos'
);

-- ========================================
-- POLICIES FOR CHILD PHOTOS (child-photos/ folder)
-- ========================================

-- Policy 5: Allow authenticated users to upload child photos
CREATE POLICY "Users can upload child photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'child-photos'
);

-- Policy 6: Allow authenticated users to update child photos
CREATE POLICY "Users can update child photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profiles' AND (storage.foldername(name))[1] = 'child-photos');

-- Policy 7: Allow authenticated users to delete child photos
CREATE POLICY "Users can delete child photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profiles' AND (storage.foldername(name))[1] = 'child-photos');

-- Policy 8: Allow public read access to child photos
CREATE POLICY "Anyone can view child photos"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'child-photos'
);

-- ========================================
-- VERIFICATION
-- ========================================
-- Run this to see all policies created:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

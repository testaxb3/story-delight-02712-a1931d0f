# Supabase Storage Bucket Setup Guide

## Create `community-posts` Storage Bucket

Before users can upload images to posts, you need to create a storage bucket in Supabase.

### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/storage/buckets

2. **Create New Bucket**
   - Click "New bucket" button
   - Bucket name: `community-posts`
   - Public bucket: ✅ **YES** (check this box)
   - Click "Create bucket"

3. **Configure Bucket Policies (RLS)**

   After creating the bucket, you need to set up Row Level Security policies.

   Go to: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/storage/policies

   Click on `community-posts` bucket, then add these policies:

   ### Policy 1: Allow Public Read Access
   ```sql
   CREATE POLICY "Public Access for community posts images"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'community-posts' );
   ```

   ### Policy 2: Allow Authenticated Users to Upload
   ```sql
   CREATE POLICY "Authenticated users can upload community images"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'community-posts'
     AND auth.role() = 'authenticated'
   );
   ```

   ### Policy 3: Allow Users to Delete Own Uploads
   ```sql
   CREATE POLICY "Users can delete own community images"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'community-posts'
     AND auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

## Verify Setup

After creating the bucket and policies:

1. Go back to the app
2. Navigate to Community page
3. Try creating a post with an image
4. You should be able to:
   - Click "Add Image" button
   - Select an image file
   - See a preview
   - Post successfully with the image
   - See the image in the feed

## Troubleshooting

### If upload fails with "403 Forbidden":
- Check that the bucket is marked as "Public"
- Verify that all 3 RLS policies are created
- Make sure you're logged in to the app

### If upload fails with "Bucket not found":
- Verify bucket name is exactly `community-posts` (case-sensitive)
- Check that you created the bucket in the correct Supabase project

### If images don't display:
- Check that the bucket is marked as "Public"
- Verify the public URL is correct
- Check browser console for CORS errors

## Image Upload Features

Once setup is complete, users can:

- Upload 1 image per post
- Automatic image compression (max 2MB)
- Thumbnail generation (400px)
- Preview before posting
- Remove image before posting
- Lazy loading in feed
- Full-size image on click (future feature)

## Storage Limits

Supabase Free Tier:
- 1 GB storage
- Unlimited bandwidth

If you need more:
- Upgrade to Pro plan for 100 GB
- Images are automatically compressed to save space

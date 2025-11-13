-- Add photo_url column to profiles table for user profile photos
-- This allows users to upload their own profile picture

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add comment
COMMENT ON COLUMN public.profiles.photo_url IS 'URL to user profile photo stored in Supabase Storage';

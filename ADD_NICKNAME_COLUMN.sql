-- ==========================================
-- ADD NICKNAME COLUMN TO PROFILES
-- ==========================================
-- Execute este SQL no Supabase Dashboard:
-- 1. Vá para: https://supabase.com/dashboard/project/YOUR_PROJECT/editor
-- 2. Cole este SQL e execute
-- ==========================================

-- Add nickname column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nickname TEXT;

-- Create unique index (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_nickname_unique ON profiles (LOWER(nickname));

-- Add regular index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);

-- Add comment
COMMENT ON COLUMN profiles.nickname IS 'User nickname for community interactions - must be unique (case-insensitive)';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'nickname';

-- ✅ If you see a row returned above, the column was added successfully!

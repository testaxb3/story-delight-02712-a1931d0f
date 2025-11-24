-- Add nickname column to profiles table
-- This column will be used for community usernames/nicknames

-- Add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'nickname'
    ) THEN
        ALTER TABLE profiles ADD COLUMN nickname TEXT;
        RAISE NOTICE 'Added nickname column to profiles table';
    ELSE
        RAISE NOTICE 'Column nickname already exists in profiles table';
    END IF;
END $$;

-- Add unique constraint on nickname (case-insensitive)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_nickname_unique'
    ) THEN
        CREATE UNIQUE INDEX profiles_nickname_unique ON profiles (LOWER(nickname));
        RAISE NOTICE 'Created unique index on nickname';
    ELSE
        RAISE NOTICE 'Unique index on nickname already exists';
    END IF;
END $$;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);

-- Add comment
COMMENT ON COLUMN profiles.nickname IS 'User nickname for community interactions - must be unique (case-insensitive)';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Migration completed: nickname column added to profiles';
END $$;

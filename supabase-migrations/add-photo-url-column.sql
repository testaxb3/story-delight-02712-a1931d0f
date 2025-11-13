-- Add photo_url column to child_profiles table
-- This allows storing profile photos for children

-- First, check if the column already exists, if not add it
DO $$
BEGIN
    -- Try to add the column (it will fail silently if it already exists)
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'children_profiles'
        AND column_name = 'photo_url'
    ) THEN
        ALTER TABLE public.children_profiles
        ADD COLUMN photo_url TEXT;

        RAISE NOTICE 'Column photo_url added to children_profiles table';
    ELSE
        RAISE NOTICE 'Column photo_url already exists in children_profiles table';
    END IF;
END $$;

-- Alternative: If the table name is different, try this:
-- Uncomment the block below if the above doesn't work

/*
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'child_profiles'
        AND column_name = 'photo_url'
    ) THEN
        ALTER TABLE public.child_profiles
        ADD COLUMN photo_url TEXT;

        RAISE NOTICE 'Column photo_url added to child_profiles table';
    ELSE
        RAISE NOTICE 'Column photo_url already exists in child_profiles table';
    END IF;
END $$;
*/

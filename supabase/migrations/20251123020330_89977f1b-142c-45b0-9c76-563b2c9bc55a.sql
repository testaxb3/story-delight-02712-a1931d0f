-- Drop and recreate foreign key with correct naming for Supabase relationship detection
-- Supabase PostgREST expects foreign keys to follow specific naming conventions

-- Drop existing foreign key if it exists
ALTER TABLE public.community_members
DROP CONSTRAINT IF EXISTS community_members_user_id_fkey;

-- Recreate with explicit foreign key that PostgREST can detect
ALTER TABLE public.community_members
ADD CONSTRAINT community_members_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- Verify the constraint was created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'community_members_user_id_fkey'
      AND table_name = 'community_members'
      AND constraint_type = 'FOREIGN KEY'
  ) THEN
    RAISE EXCEPTION 'Foreign key constraint was not created successfully';
  END IF;
END $$;
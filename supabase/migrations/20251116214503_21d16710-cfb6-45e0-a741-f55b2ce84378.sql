-- Ensure users can SELECT their own profile (fix infinite redirect)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Users can select own profile' 
      AND polrelid = 'public.profiles'::regclass
  ) THEN
    CREATE POLICY "Users can select own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);
  END IF;
END $$;

-- Ensure RLS is enabled and users can manage their own user_progress
DO $$
BEGIN
  -- Enable RLS if not already
  PERFORM 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_progress';
  IF FOUND THEN
    EXECUTE 'ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Create policies for user_progress (select/insert/update own rows)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Users can select own user_progress' 
      AND polrelid = 'public.user_progress'::regclass
  ) THEN
    CREATE POLICY "Users can select own user_progress"
    ON public.user_progress
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Users can insert own user_progress' 
      AND polrelid = 'public.user_progress'::regclass
  ) THEN
    CREATE POLICY "Users can insert own user_progress"
    ON public.user_progress
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Users can update own user_progress' 
      AND polrelid = 'public.user_progress'::regclass
  ) THEN
    CREATE POLICY "Users can update own user_progress"
    ON public.user_progress
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
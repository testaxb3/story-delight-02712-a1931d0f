DO $$
BEGIN
  IF to_regclass('public.comments') IS NULL THEN
    CREATE TABLE public.comments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      content text NOT NULL,
      author_name text,
      created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
    );

    ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can read comments"
      ON public.comments
      FOR SELECT
      USING (true);

    CREATE POLICY "Users can insert their comments"
      ON public.comments
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their comments"
      ON public.comments
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete their comments"
      ON public.comments
      FOR DELETE
      USING (auth.uid() = user_id);
  ELSE
    ALTER TABLE public.comments
      ALTER COLUMN created_at SET DEFAULT timezone('utc', now());

    ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'comments'
          AND policyname = 'Users can read comments'
      ) THEN
        CREATE POLICY "Users can read comments"
          ON public.comments
          FOR SELECT
          USING (true);
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'comments'
          AND policyname = 'Users can insert their comments'
      ) THEN
        CREATE POLICY "Users can insert their comments"
          ON public.comments
          FOR INSERT
          WITH CHECK (auth.uid() = user_id);
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'comments'
          AND policyname = 'Users can update their comments'
      ) THEN
        CREATE POLICY "Users can update their comments"
          ON public.comments
          FOR UPDATE
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'comments'
          AND policyname = 'Users can delete their comments'
      ) THEN
        CREATE POLICY "Users can delete their comments"
          ON public.comments
          FOR DELETE
          USING (auth.uid() = user_id);
      END IF;
    END;
    $$;
  END IF;
END;
$$;

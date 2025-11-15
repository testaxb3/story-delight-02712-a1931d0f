-- Add missing RLS policies (only if they don't exist)

-- Check and create policy for notifications DELETE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notifications' 
    AND policyname = 'Users can delete their own notifications'
  ) THEN
    CREATE POLICY "Users can delete their own notifications"
    ON notifications FOR DELETE 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Check and create policy for post_likes UPDATE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'post_likes' 
    AND policyname = 'Users can update their own likes'
  ) THEN
    CREATE POLICY "Users can update their own likes"
    ON post_likes FOR UPDATE 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Check and create policy for post_flags UPDATE (admin only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'post_flags' 
    AND policyname = 'Admins can update post flags'
  ) THEN
    CREATE POLICY "Admins can update post flags"
    ON post_flags FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    );
  END IF;
END $$;
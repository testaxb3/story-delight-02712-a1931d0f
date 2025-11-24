-- Enable realtime for community_posts
ALTER TABLE community_posts REPLICA IDENTITY FULL;

-- Ensure the publication exists and add community_posts to it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE community_posts;
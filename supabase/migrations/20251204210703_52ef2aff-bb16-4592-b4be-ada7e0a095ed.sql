-- Enable REPLICA IDENTITY FULL for complete row data in realtime updates
ALTER TABLE approved_users REPLICA IDENTITY FULL;

-- Add table to Supabase realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE approved_users;
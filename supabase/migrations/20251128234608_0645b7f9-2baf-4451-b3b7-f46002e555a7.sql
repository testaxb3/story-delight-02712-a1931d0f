-- Drop the old CHECK constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add new CHECK constraint with all notification types
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type = ANY (ARRAY[
  'daily_reminder'::text, 
  'community_reply'::text, 
  'achievement'::text, 
  'system'::text,
  'script_request'::text,
  'refund_request'::text,
  'new_script'::text,
  'new_ebook'::text,
  'new_video'::text,
  'refund_response'::text,
  'app_update'::text
]));
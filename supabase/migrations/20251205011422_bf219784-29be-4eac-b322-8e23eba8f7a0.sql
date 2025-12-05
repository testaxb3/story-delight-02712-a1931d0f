-- Update notifications CHECK constraint to include missing notification types
-- This fixes the "new row violates check constraint" error when sending script request messages

-- Drop the existing constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Recreate the constraint with all required values
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type = ANY (ARRAY[
  'script_request'::text, 
  'script_request_update'::text,
  'comment'::text, 
  'like'::text, 
  'reply'::text, 
  'follow'::text, 
  'new_content'::text, 
  'system'::text, 
  'refund_response'::text, 
  'refund_update'::text,
  'new_script'::text, 
  'new_ebook'::text, 
  'new_video'::text, 
  'admin_script_request'::text, 
  'admin_refund_request'::text,
  'admin_alert'::text
]));
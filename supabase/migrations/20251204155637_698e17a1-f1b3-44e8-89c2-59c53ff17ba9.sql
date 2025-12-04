-- Add email_sent column to approved_users table
ALTER TABLE approved_users 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;

-- Update existing records that have email tracking entries to true
UPDATE approved_users au
SET email_sent = true
WHERE EXISTS (
  SELECT 1 FROM email_tracking et 
  WHERE et.email = au.email 
  AND et.email_type = 'welcome'
);
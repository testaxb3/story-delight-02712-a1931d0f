-- Mark the last 20 buyers as email_sent = true
UPDATE approved_users 
SET email_sent = true 
WHERE id IN (
  SELECT id 
  FROM approved_users 
  ORDER BY created_at DESC 
  LIMIT 20
);
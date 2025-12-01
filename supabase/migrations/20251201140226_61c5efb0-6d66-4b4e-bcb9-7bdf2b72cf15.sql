INSERT INTO approved_users (email, status, first_name, approved_at)
VALUES ('gabrieltesta3@gmail.com', 'active', 'Gabriel', now())
ON CONFLICT (email) DO UPDATE SET 
  status = 'active',
  updated_at = now();
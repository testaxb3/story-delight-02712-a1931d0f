INSERT INTO approved_users (email, status, first_name, approved_at)
VALUES 
  ('gabrieltesta4@gmail.com', 'active', 'Gabriel', now()),
  ('gabrieltesta5@gmail.com', 'active', 'Gabriel', now()),
  ('gabrieltesta6@gmail.com', 'active', 'Gabriel', now()),
  ('gabrieltesta7@gmail.com', 'active', 'Gabriel', now()),
  ('gabrieltesta8@gmail.com', 'active', 'Gabriel', now()),
  ('gabrieltesta9@gmail.com', 'active', 'Gabriel', now()),
  ('gabrieltesta10@gmail.com', 'active', 'Gabriel', now())
ON CONFLICT (email) DO UPDATE SET 
  status = 'active',
  updated_at = now();
INSERT INTO approved_users (email, status, first_name) 
VALUES ('gabrieltesta2@gmail.com', 'active', 'Gabriel')
ON CONFLICT (email) DO UPDATE SET status = 'active', updated_at = now();
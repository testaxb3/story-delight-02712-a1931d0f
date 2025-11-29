-- Migração: Grandfather existing users to approved_users table
-- Isso permite que os 68 usuários existentes continuem usando o app

INSERT INTO approved_users (email, status, approved_at, notes, account_created, account_created_at, user_id)
SELECT 
  LOWER(p.email) as email,
  'active' as status,
  p.created_at as approved_at,
  'Grandfathered from existing users before Cartpanda integration' as notes,
  true as account_created,
  p.created_at as account_created_at,
  p.id as user_id
FROM profiles p
WHERE p.email IS NOT NULL
  AND p.email != ''
ON CONFLICT (email) DO UPDATE SET
  status = 'active',
  notes = COALESCE(approved_users.notes, 'Grandfathered from existing users before Cartpanda integration'),
  updated_at = NOW();
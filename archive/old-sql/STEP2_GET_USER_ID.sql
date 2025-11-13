-- ========================================
-- STEP 2: GET YOUR USER ID
-- Execute este SQL e copie o ID retornado
-- ========================================

SELECT
  id,
  email,
  created_at
FROM auth.users
WHERE email = 'testa@gmail.com';

-- Copy the 'id' value from the result
-- It will look something like: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
-- You'll need this ID for STEP 3

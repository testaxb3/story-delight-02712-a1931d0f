
-- Corrigir TODOS os 8 registros com bug (account_created=false mas conta existe)
UPDATE public.approved_users
SET 
  account_created = true,
  account_created_at = NOW(),
  user_id = subq.profile_id,
  updated_at = NOW()
FROM (
  SELECT au.email, p.id as profile_id
  FROM public.approved_users au
  INNER JOIN public.profiles p ON LOWER(p.email) = LOWER(au.email)
  WHERE au.account_created = false
) subq
WHERE LOWER(approved_users.email) = LOWER(subq.email);

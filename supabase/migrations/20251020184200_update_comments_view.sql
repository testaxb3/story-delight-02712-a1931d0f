-- Atualizar a VIEW comments_with_profiles para remover author_name
-- e sempre buscar o nome atual do perfil do usuário
DROP VIEW IF EXISTS public.comments_with_profiles CASCADE;

CREATE OR REPLACE VIEW public.comments_with_profiles AS
SELECT
  c.id,
  c.post_id,
  c.user_id,
  c.content,
  c.created_at,
  p.name AS profile_name
FROM
  public.comments c
LEFT JOIN
  public.profiles p ON c.user_id = p.id;


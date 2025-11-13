-- Remover o campo author_name de community_posts
-- Nomes serão sempre obtidos do perfil do usuário
ALTER TABLE public.community_posts DROP COLUMN IF EXISTS author_name;

-- Remover o campo author_name de comments
-- Nomes serão sempre obtidos do perfil do usuário
ALTER TABLE public.comments DROP COLUMN IF EXISTS author_name;


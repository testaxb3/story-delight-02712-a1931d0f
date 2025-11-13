CREATE OR REPLACE VIEW public.comments_with_profiles AS
SELECT
  c.id,
  c.post_id,
  c.user_id,
  c.content,
  c.created_at,
  c.author_name,
  p.name AS profile_name
FROM
  public.comments c
LEFT JOIN
  public.profiles p ON c.user_id = p.id;

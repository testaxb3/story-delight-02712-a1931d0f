
CREATE OR REPLACE VIEW public.community_posts_with_profiles AS
SELECT
  cp.id,
  cp.user_id,
  cp.content,
  cp.image_url,
  cp.created_at,
  cp.updated_at,
  cp.author_name,
  p.name AS profile_name
FROM
  public.community_posts cp
LEFT JOIN
  public.profiles p ON cp.user_id = p.id;

ALTER VIEW public.community_posts_with_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community posts with profiles" ON public.community_posts_with_profiles FOR SELECT USING (true);


-- Create RPC function to get community members with profiles
-- This bypasses PostgREST relationship detection issues

CREATE OR REPLACE FUNCTION public.get_community_members(p_community_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  role text,
  joined_at timestamptz,
  name text,
  username text,
  photo_url text,
  brain_profile text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    cm.id,
    cm.user_id,
    cm.role,
    cm.joined_at,
    p.name,
    p.username,
    p.photo_url,
    p.brain_profile
  FROM community_members cm
  INNER JOIN profiles p ON p.id = cm.user_id
  WHERE cm.community_id = p_community_id
  ORDER BY 
    CASE cm.role 
      WHEN 'leader' THEN 1 
      ELSE 2 
    END,
    cm.joined_at ASC;
$$;
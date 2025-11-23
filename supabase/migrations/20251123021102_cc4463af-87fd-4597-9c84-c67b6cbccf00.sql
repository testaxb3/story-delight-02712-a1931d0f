-- Function to add or remove group reactions with proper access control
CREATE OR REPLACE FUNCTION public.toggle_group_reaction(
  p_post_id UUID,
  p_emoji TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_existing_id UUID;
  v_community_id UUID;
  v_is_member BOOLEAN;
BEGIN
  -- Get the community_id from the post
  SELECT community_id INTO v_community_id
  FROM group_posts
  WHERE id = p_post_id;
  
  IF v_community_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Post not found'
    );
  END IF;
  
  -- Check if user is a member of the community
  SELECT EXISTS (
    SELECT 1
    FROM community_members
    WHERE community_id = v_community_id
      AND user_id = auth.uid()
  ) INTO v_is_member;
  
  IF NOT v_is_member THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Not a member of this community'
    );
  END IF;
  
  -- Check if reaction already exists
  SELECT id INTO v_existing_id
  FROM group_reactions
  WHERE post_id = p_post_id
    AND user_id = auth.uid()
    AND emoji = p_emoji;
  
  IF v_existing_id IS NOT NULL THEN
    -- Remove existing reaction
    DELETE FROM group_reactions
    WHERE id = v_existing_id;
    
    RETURN json_build_object(
      'success', true,
      'action', 'removed',
      'message', 'Reaction removed'
    );
  ELSE
    -- Add new reaction
    INSERT INTO group_reactions (post_id, user_id, emoji)
    VALUES (p_post_id, auth.uid(), p_emoji);
    
    RETURN json_build_object(
      'success', true,
      'action', 'added',
      'message', 'Reaction added'
    );
  END IF;
END;
$$;

-- Function to get reactions for a post
CREATE OR REPLACE FUNCTION public.get_post_reactions(p_post_id UUID)
RETURNS TABLE(
  emoji TEXT,
  count BIGINT,
  users JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gr.emoji,
    COUNT(*)::BIGINT as count,
    jsonb_agg(
      jsonb_build_object(
        'user_id', gr.user_id,
        'name', p.name,
        'photo_url', p.photo_url
      )
    ) as users
  FROM group_reactions gr
  INNER JOIN profiles p ON p.id = gr.user_id
  WHERE gr.post_id = p_post_id
  GROUP BY gr.emoji
  ORDER BY count DESC;
END;
$$;
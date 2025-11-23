-- Create default communities for each brain profile
-- First, get the admin user ID (assuming the first admin profile)
DO $$
DECLARE
  admin_user_id UUID;
  intense_community_id UUID;
  defiant_community_id UUID;
  distracted_community_id UUID;
BEGIN
  -- Get the first admin user
  SELECT id INTO admin_user_id
  FROM public.profiles
  WHERE is_admin = true
  LIMIT 1;

  -- If no admin found, we can't proceed
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'No admin user found. Please create an admin user first.';
  END IF;

  -- Create INTENSE community
  INSERT INTO public.communities (name, logo_emoji, description, invite_code, created_by)
  VALUES (
    'INTENSE Parents Circle',
    '🔥',
    'Connect with parents of intense children and share strategies that work',
    'INTENSE2024',
    admin_user_id
  )
  ON CONFLICT (invite_code) DO NOTHING
  RETURNING id INTO intense_community_id;

  -- Create DEFIANT community
  INSERT INTO public.communities (name, logo_emoji, description, invite_code, created_by)
  VALUES (
    'DEFIANT Warriors Community',
    '💪',
    'Support group for parents of strong-willed children',
    'DEFIANT2024',
    admin_user_id
  )
  ON CONFLICT (invite_code) DO NOTHING
  RETURNING id INTO defiant_community_id;

  -- Create DISTRACTED community
  INSERT INTO public.communities (name, logo_emoji, description, invite_code, created_by)
  VALUES (
    'DISTRACTED Support Network',
    '✨',
    'Parents helping parents with easily distracted children',
    'DISTRACTED2024',
    admin_user_id
  )
  ON CONFLICT (invite_code) DO NOTHING
  RETURNING id INTO distracted_community_id;

  -- Add admin as leader to INTENSE community (if it was created)
  IF intense_community_id IS NOT NULL THEN
    INSERT INTO public.community_members (community_id, user_id, role)
    VALUES (intense_community_id, admin_user_id, 'leader')
    ON CONFLICT (community_id, user_id) DO NOTHING;
  ELSE
    -- Get existing community ID
    SELECT id INTO intense_community_id
    FROM public.communities
    WHERE invite_code = 'INTENSE2024';
    
    -- Add admin as leader if not already member
    INSERT INTO public.community_members (community_id, user_id, role)
    VALUES (intense_community_id, admin_user_id, 'leader')
    ON CONFLICT (community_id, user_id) DO NOTHING;
  END IF;

  -- Add admin as leader to DEFIANT community (if it was created)
  IF defiant_community_id IS NOT NULL THEN
    INSERT INTO public.community_members (community_id, user_id, role)
    VALUES (defiant_community_id, admin_user_id, 'leader')
    ON CONFLICT (community_id, user_id) DO NOTHING;
  ELSE
    SELECT id INTO defiant_community_id
    FROM public.communities
    WHERE invite_code = 'DEFIANT2024';
    
    INSERT INTO public.community_members (community_id, user_id, role)
    VALUES (defiant_community_id, admin_user_id, 'leader')
    ON CONFLICT (community_id, user_id) DO NOTHING;
  END IF;

  -- Add admin as leader to DISTRACTED community (if it was created)
  IF distracted_community_id IS NOT NULL THEN
    INSERT INTO public.community_members (community_id, user_id, role)
    VALUES (distracted_community_id, admin_user_id, 'leader')
    ON CONFLICT (community_id, user_id) DO NOTHING;
  ELSE
    SELECT id INTO distracted_community_id
    FROM public.communities
    WHERE invite_code = 'DISTRACTED2024';
    
    INSERT INTO public.community_members (community_id, user_id, role)
    VALUES (distracted_community_id, admin_user_id, 'leader')
    ON CONFLICT (community_id, user_id) DO NOTHING;
  END IF;

END $$;

-- Add unique constraint on invite_code if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'communities_invite_code_key'
  ) THEN
    ALTER TABLE public.communities
    ADD CONSTRAINT communities_invite_code_key UNIQUE (invite_code);
  END IF;
END $$;

-- Add unique constraint on community_id + user_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'community_members_community_id_user_id_key'
  ) THEN
    ALTER TABLE public.community_members
    ADD CONSTRAINT community_members_community_id_user_id_key UNIQUE (community_id, user_id);
  END IF;
END $$;
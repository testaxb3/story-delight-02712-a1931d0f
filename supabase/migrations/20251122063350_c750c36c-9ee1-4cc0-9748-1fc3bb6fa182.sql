-- Create communities table
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_emoji TEXT,
  logo_url TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create community_members table
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('leader', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(community_id, user_id)
);

-- Create community_posts table (separate from community_posts that already exists)
CREATE TABLE IF NOT EXISTS public.group_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  script_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create community_reactions table
CREATE TABLE IF NOT EXISTS public.group_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.group_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(post_id, user_id, emoji)
);

-- Enable RLS
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for communities
CREATE POLICY "Users can view communities they are members of"
  ON public.communities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_members.community_id = communities.id
      AND community_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create communities"
  ON public.communities FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Leaders can update their communities"
  ON public.communities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_members.community_id = communities.id
      AND community_members.user_id = auth.uid()
      AND community_members.role = 'leader'
    )
  );

-- RLS Policies for community_members
CREATE POLICY "Users can view members of their communities"
  ON public.community_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_members.community_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join communities"
  ON public.community_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Leaders can remove members"
  ON public.community_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_members.community_id = community_members.community_id
      AND community_members.user_id = auth.uid()
      AND community_members.role = 'leader'
    )
  );

-- RLS Policies for group_posts
CREATE POLICY "Users can view posts in their communities"
  ON public.group_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_members.community_id = group_posts.community_id
      AND community_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create posts in their communities"
  ON public.group_posts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_members.community_id = group_posts.community_id
      AND community_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own posts"
  ON public.group_posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for group_reactions
CREATE POLICY "Users can view reactions in their communities"
  ON public.group_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_posts
      JOIN public.community_members ON community_members.community_id = group_posts.community_id
      WHERE group_posts.id = group_reactions.post_id
      AND community_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can add reactions"
  ON public.group_reactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.group_posts
      JOIN public.community_members ON community_members.community_id = group_posts.community_id
      WHERE group_posts.id = group_reactions.post_id
      AND community_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own reactions"
  ON public.group_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Trigger to auto-generate invite code
CREATE OR REPLACE FUNCTION set_invite_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.invite_code IS NULL THEN
    NEW.invite_code := generate_invite_code();
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.communities WHERE invite_code = NEW.invite_code) LOOP
      NEW.invite_code := generate_invite_code();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER before_insert_community
BEFORE INSERT ON public.communities
FOR EACH ROW
EXECUTE FUNCTION set_invite_code();
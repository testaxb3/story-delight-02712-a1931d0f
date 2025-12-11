-- Family Shares table for Shared Access feature
-- Allows one owner to share access with exactly one partner

CREATE TABLE public.family_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  partner_email TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- CRITICAL: Only ONE share per owner (can't add more than 1 person)
  CONSTRAINT unique_owner UNIQUE (owner_id)
);

-- Enable RLS
ALTER TABLE public.family_shares ENABLE ROW LEVEL SECURITY;

-- Owners can manage their own shares
CREATE POLICY "Owners can view their shares"
ON public.family_shares FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can create shares"
ON public.family_shares FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their shares"
ON public.family_shares FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their shares"
ON public.family_shares FOR DELETE
USING (auth.uid() = owner_id);

-- Partners can view shares they're part of
CREATE POLICY "Partners can view their share"
ON public.family_shares FOR SELECT
USING (auth.uid() = partner_id);

-- Function to generate random invite code
CREATE OR REPLACE FUNCTION public.generate_family_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Trigger to auto-generate invite code
CREATE OR REPLACE FUNCTION public.set_family_invite_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := generate_family_invite_code();
    WHILE EXISTS (SELECT 1 FROM public.family_shares WHERE invite_code = NEW.invite_code) LOOP
      NEW.invite_code := generate_family_invite_code();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_set_family_invite_code
BEFORE INSERT ON public.family_shares
FOR EACH ROW
EXECUTE FUNCTION public.set_family_invite_code();

-- Function to check if user has family access (either owner or partner)
CREATE OR REPLACE FUNCTION public.get_family_owner_id(p_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    -- If user is owner, return their own id
    (SELECT owner_id FROM family_shares WHERE owner_id = p_user_id AND status = 'accepted'),
    -- If user is partner, return the owner's id
    (SELECT owner_id FROM family_shares WHERE partner_id = p_user_id AND status = 'accepted'),
    -- Otherwise return their own id (no share)
    p_user_id
  )
$$;

-- Function to accept invite
CREATE OR REPLACE FUNCTION public.accept_family_invite(p_invite_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_share RECORD;
  v_user_id UUID := auth.uid();
BEGIN
  -- Find the invite
  SELECT * INTO v_share
  FROM family_shares
  WHERE invite_code = UPPER(p_invite_code)
  AND status = 'pending';
  
  IF v_share IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invite code');
  END IF;
  
  -- Check if user is trying to accept their own invite
  IF v_share.owner_id = v_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot accept your own invite');
  END IF;
  
  -- Check if user already has a share (as owner or partner)
  IF EXISTS (
    SELECT 1 FROM family_shares 
    WHERE (owner_id = v_user_id OR partner_id = v_user_id) 
    AND status = 'accepted'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You already have an active family share');
  END IF;
  
  -- Accept the invite
  UPDATE family_shares
  SET 
    partner_id = v_user_id,
    status = 'accepted',
    accepted_at = NOW(),
    updated_at = NOW()
  WHERE id = v_share.id;
  
  RETURN jsonb_build_object('success', true, 'message', 'Invite accepted successfully');
END;
$$;

-- Update child_profiles RLS to allow partner access
CREATE POLICY "Partners can view shared children"
ON public.child_profiles FOR SELECT
USING (
  parent_id = get_family_owner_id(auth.uid())
);

CREATE POLICY "Partners can update shared children"
ON public.child_profiles FOR UPDATE
USING (
  parent_id = get_family_owner_id(auth.uid())
);

-- Update tracker_days RLS to allow partner access
CREATE POLICY "Partners can view shared tracker"
ON public.tracker_days FOR SELECT
USING (
  user_id = get_family_owner_id(auth.uid())
);

CREATE POLICY "Partners can insert shared tracker"
ON public.tracker_days FOR INSERT
WITH CHECK (
  user_id = get_family_owner_id(auth.uid())
);

-- Index for performance
CREATE INDEX idx_family_shares_owner ON public.family_shares(owner_id);
CREATE INDEX idx_family_shares_partner ON public.family_shares(partner_id);
CREATE INDEX idx_family_shares_invite_code ON public.family_shares(invite_code);
CREATE INDEX idx_family_shares_status ON public.family_shares(status);
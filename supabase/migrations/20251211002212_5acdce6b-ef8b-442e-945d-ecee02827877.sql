-- Update accept_family_invite function to validate partner email
CREATE OR REPLACE FUNCTION public.accept_family_invite(p_invite_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_share family_shares%ROWTYPE;
  v_user_id uuid;
  v_user_email text;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Get user email
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = v_user_id;

  -- Find pending invite
  SELECT * INTO v_share
  FROM family_shares
  WHERE invite_code = UPPER(p_invite_code)
    AND status = 'pending';

  IF v_share.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invite code');
  END IF;

  -- Validate email matches
  IF LOWER(v_share.partner_email) != LOWER(v_user_email) THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Your email doesn''t match the invited email. Please use the email: ' || v_share.partner_email
    );
  END IF;

  -- Cannot accept own invite
  IF v_share.owner_id = v_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot accept your own invite');
  END IF;

  -- Check if user is already a partner elsewhere
  IF EXISTS (
    SELECT 1 FROM family_shares 
    WHERE partner_id = v_user_id AND status = 'accepted'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are already connected to another family');
  END IF;

  -- Accept the invite
  UPDATE family_shares
  SET 
    partner_id = v_user_id,
    status = 'accepted',
    accepted_at = NOW(),
    updated_at = NOW()
  WHERE id = v_share.id;

  RETURN jsonb_build_object('success', true, 'message', 'Successfully joined family');
END;
$$;
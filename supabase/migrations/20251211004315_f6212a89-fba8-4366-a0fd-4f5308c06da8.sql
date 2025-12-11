-- RPC para buscar informações do convite sem autenticação
CREATE OR REPLACE FUNCTION public.get_invite_info(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'valid', true,
    'owner_name', COALESCE(p.name, 'Your Partner'),
    'owner_photo_url', p.photo_url,
    'partner_email', fs.partner_email
  ) INTO v_result
  FROM family_shares fs
  JOIN profiles p ON p.id = fs.owner_id
  WHERE fs.invite_code = UPPER(TRIM(p_code))
  AND fs.status = 'pending';
  
  IF v_result IS NULL THEN
    RETURN jsonb_build_object('valid', false);
  END IF;
  
  RETURN v_result;
END;
$$;
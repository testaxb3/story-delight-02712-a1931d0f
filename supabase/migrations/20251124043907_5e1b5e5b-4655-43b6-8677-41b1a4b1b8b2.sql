-- Add 30 consecutive days of streak for testa@gmail.com
DO $$
DECLARE
  v_user_id UUID;
  v_date DATE;
  v_existing_id UUID;
BEGIN
  -- Get user_id from email
  SELECT id INTO v_user_id
  FROM profiles
  WHERE LOWER(email) = 'testa@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User testa@gmail.com not found';
  END IF;

  -- Delete existing tracker days for this user to start fresh
  DELETE FROM tracker_days WHERE user_id = v_user_id;

  -- Insert 30 consecutive completed days (day_number 1-30)
  FOR i IN 1..30 LOOP
    v_date := CURRENT_DATE - (30 - i);
    
    INSERT INTO tracker_days (
      user_id,
      date,
      day_number,
      completed,
      completed_at,
      created_at
    )
    VALUES (
      v_user_id,
      v_date,
      i,
      true,
      NOW() - ((30 - i) || ' days')::INTERVAL,
      NOW() - ((30 - i) || ' days')::INTERVAL
    );
  END LOOP;

  RAISE NOTICE 'Added 30 consecutive days for user %', v_user_id;
END $$;
-- ============================================
-- MEMBERSHIP BADGES: NEP Member + NEP Listen
-- ============================================

-- 1. Create NEP Member badge (for $47 main product buyers)
INSERT INTO badges (id, name, description, icon, category, rarity, requirement)
VALUES (
  'a1b2c3d4-5678-90ab-cdef-111111111111',
  'NEP Member',
  'Official member of The Obedience Language community',
  '🎖️',
  'special',
  'rare',
  'special:nep_member'
) ON CONFLICT DO NOTHING;

-- 2. Create NEP Listen badge (for audio upsell buyers)
INSERT INTO badges (id, name, description, icon, category, rarity, requirement)
VALUES (
  'a1b2c3d4-5678-90ab-cdef-222222222222',
  'NEP Listen',
  'Premium audio subscriber with access to all series',
  '🎧',
  'special',
  'epic',
  'special:nep_listen'
) ON CONFLICT DO NOTHING;

-- 3. Create function to assign membership badge
CREATE OR REPLACE FUNCTION assign_membership_badge(
  p_user_id UUID,
  p_badge_type TEXT -- 'nep_member' or 'nep_listen'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_badge_id UUID;
BEGIN
  -- Get the badge ID based on type
  IF p_badge_type = 'nep_member' THEN
    v_badge_id := 'a1b2c3d4-5678-90ab-cdef-111111111111';
  ELSIF p_badge_type = 'nep_listen' THEN
    v_badge_id := 'a1b2c3d4-5678-90ab-cdef-222222222222';
  ELSE
    RETURN;
  END IF;

  -- Insert badge if not already assigned
  INSERT INTO user_badges (user_id, badge_id, unlocked_at)
  VALUES (p_user_id, v_badge_id, NOW())
  ON CONFLICT (user_id, badge_id) DO NOTHING;
END;
$$;

-- 4. Update handle_new_user to assign badges based on purchased products
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_approved_user RECORD;
  v_product JSONB;
  v_product_id TEXT;
BEGIN
  -- Create profile automatically with ON CONFLICT (idempotent)
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE 
    SET email = COALESCE(EXCLUDED.email, public.profiles.email),
        updated_at = NOW();

  -- Create user_progress automatically
  INSERT INTO public.user_progress (user_id, created_at)
  VALUES (NEW.id, NOW())
  ON CONFLICT (user_id) DO NOTHING;

  -- Fetch approved_users record with products
  SELECT * INTO v_approved_user
  FROM public.approved_users
  WHERE LOWER(email) = LOWER(NEW.email)
  LIMIT 1;

  -- Update approved_users when account is created
  IF v_approved_user IS NOT NULL THEN
    UPDATE public.approved_users
    SET 
      user_id = NEW.id,
      account_created = true,
      account_created_at = NOW(),
      updated_at = NOW()
    WHERE LOWER(email) = LOWER(NEW.email)
    AND account_created = false;

    -- Assign membership badges based on purchased products
    IF v_approved_user.products IS NOT NULL THEN
      FOR v_product IN SELECT * FROM jsonb_array_elements(v_approved_user.products)
      LOOP
        v_product_id := v_product->>'id';
        
        -- Main products ($47) -> NEP Member badge
        -- Product IDs: 27499673, 27577169 (from both CartPanda accounts)
        IF v_product_id IN ('27499673', '27577169') THEN
          PERFORM assign_membership_badge(NEW.id, 'nep_member');
        END IF;
        
        -- Audio upsell products -> NEP Listen badge
        -- Product IDs: 27845678, 27851448
        IF v_product_id IN ('27845678', '27851448') THEN
          PERFORM assign_membership_badge(NEW.id, 'nep_listen');
        END IF;
      END LOOP;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 5. Assign badges to existing users who already purchased
-- NEP Member for all approved_users with main products
INSERT INTO user_badges (user_id, badge_id, unlocked_at)
SELECT 
  au.user_id,
  'a1b2c3d4-5678-90ab-cdef-111111111111'::uuid,
  COALESCE(au.approved_at, NOW())
FROM approved_users au
WHERE au.user_id IS NOT NULL
  AND au.status = 'active'
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(COALESCE(au.products, '[]'::jsonb)) AS p
    WHERE p->>'id' IN ('27499673', '27577169')
  )
ON CONFLICT (user_id, badge_id) DO NOTHING;

-- NEP Listen for users with audio upsell products
INSERT INTO user_badges (user_id, badge_id, unlocked_at)
SELECT 
  au.user_id,
  'a1b2c3d4-5678-90ab-cdef-222222222222'::uuid,
  COALESCE(au.approved_at, NOW())
FROM approved_users au
WHERE au.user_id IS NOT NULL
  AND au.status = 'active'
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(COALESCE(au.products, '[]'::jsonb)) AS p
    WHERE p->>'id' IN ('27845678', '27851448')
  )
ON CONFLICT (user_id, badge_id) DO NOTHING;
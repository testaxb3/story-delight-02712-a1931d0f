-- Table to store user push subscription player IDs
CREATE TABLE IF NOT EXISTS public.user_push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  onesignal_player_id TEXT NOT NULL,
  device_type TEXT DEFAULT 'web',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, onesignal_player_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_push_subs_player_id ON public.user_push_subscriptions(onesignal_player_id);
CREATE INDEX IF NOT EXISTS idx_push_subs_user_active ON public.user_push_subscriptions(user_id) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.user_push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own subscriptions
CREATE POLICY "Users can view own push subscriptions"
  ON public.user_push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push subscriptions"
  ON public.user_push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own push subscriptions"
  ON public.user_push_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own push subscriptions"
  ON public.user_push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all push subscriptions"
  ON public.user_push_subscriptions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Table to log all push notifications sent
CREATE TABLE IF NOT EXISTS public.push_notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL, -- 'new_script', 'refund_update', 'tracker_reminder', 'new_content', 'broadcast'
  target_profile TEXT, -- 'INTENSE', 'DISTRACTED', 'DEFIANT', 'ALL', NULL for specific user
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  recipients_count INTEGER DEFAULT 0,
  onesignal_notification_id TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for log queries
CREATE INDEX IF NOT EXISTS idx_push_log_type ON public.push_notification_log(notification_type);
CREATE INDEX IF NOT EXISTS idx_push_log_status ON public.push_notification_log(status);
CREATE INDEX IF NOT EXISTS idx_push_log_created ON public.push_notification_log(created_at DESC);

-- Enable RLS
ALTER TABLE public.push_notification_log ENABLE ROW LEVEL SECURITY;

-- Admins can view and insert logs
CREATE POLICY "Admins can view push notification logs"
  ON public.push_notification_log FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "System can insert push notification logs"
  ON public.push_notification_log FOR INSERT
  WITH CHECK (true);

-- Function to get player IDs by brain profile
CREATE OR REPLACE FUNCTION get_player_ids_by_profile(target_profile TEXT)
RETURNS TABLE(player_id TEXT, user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF target_profile = 'ALL' OR target_profile IS NULL THEN
    -- Return all active subscriptions
    RETURN QUERY
    SELECT ups.onesignal_player_id, ups.user_id
    FROM user_push_subscriptions ups
    WHERE ups.is_active = true;
  ELSE
    -- Return subscriptions for users with children of that profile
    RETURN QUERY
    SELECT DISTINCT ups.onesignal_player_id, ups.user_id
    FROM user_push_subscriptions ups
    INNER JOIN child_profiles cp ON cp.parent_id = ups.user_id
    WHERE ups.is_active = true
      AND cp.brain_profile = target_profile
      AND cp.is_active = true;
  END IF;
END;
$$;

-- Function to get player IDs for a specific user
CREATE OR REPLACE FUNCTION get_player_ids_for_user(p_user_id UUID)
RETURNS TABLE(player_id TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT ups.onesignal_player_id
  FROM user_push_subscriptions ups
  WHERE ups.user_id = p_user_id
    AND ups.is_active = true;
END;
$$;
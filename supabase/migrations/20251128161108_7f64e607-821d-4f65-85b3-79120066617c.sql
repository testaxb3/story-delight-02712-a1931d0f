-- 1. Enable real-time for refund_messages
ALTER PUBLICATION supabase_realtime ADD TABLE refund_messages;

-- 2. Fix admin role in user_roles table
UPDATE user_roles 
SET role = 'admin'::app_role 
WHERE user_id = '89f7b0fe-5da1-4931-ad5c-12ac95b9150f';

-- 3. Drop old notifications policy and create consistent one
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

CREATE POLICY "Admins can create notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
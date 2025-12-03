-- Create email_tracking table to prevent duplicate emails
CREATE TABLE public.email_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'welcome', 'quiz_reminder_24h', 'quiz_reminder_48h', 'quiz_reminder_72h'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent', -- 'sent', 'failed', 'bounced'
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, email_type) -- Ensures only 1 email per type per user
);

-- Enable RLS
ALTER TABLE public.email_tracking ENABLE ROW LEVEL SECURITY;

-- Only admins can view email tracking (for analytics)
CREATE POLICY "Admins can view email tracking"
ON public.email_tracking
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));

-- System can insert email tracking (via Edge Functions)
CREATE POLICY "System can insert email tracking"
ON public.email_tracking
FOR INSERT
WITH CHECK (true);

-- Create index for efficient queries
CREATE INDEX idx_email_tracking_user_type ON public.email_tracking(user_id, email_type);
CREATE INDEX idx_email_tracking_email_type ON public.email_tracking(email_type, sent_at);
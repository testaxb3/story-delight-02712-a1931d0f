-- Create refund_messages table for chat between admin and users
CREATE TABLE public.refund_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_request_id UUID NOT NULL REFERENCES public.refund_requests(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'user')),
  sender_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.refund_messages ENABLE ROW LEVEL SECURITY;

-- Index for faster queries
CREATE INDEX idx_refund_messages_request_id ON public.refund_messages(refund_request_id);
CREATE INDEX idx_refund_messages_created_at ON public.refund_messages(created_at);

-- RLS Policies
-- Users can view messages for their own refund requests
CREATE POLICY "Users can view their own refund messages"
  ON public.refund_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.refund_requests rr
      WHERE rr.id = refund_messages.refund_request_id
      AND rr.user_id = auth.uid()
    )
  );

-- Users can send messages on their own refund requests
CREATE POLICY "Users can send messages on their refund requests"
  ON public.refund_messages
  FOR INSERT
  WITH CHECK (
    sender_type = 'user' 
    AND sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.refund_requests rr
      WHERE rr.id = refund_request_id
      AND rr.user_id = auth.uid()
    )
  );

-- Admins can view all refund messages
CREATE POLICY "Admins can view all refund messages"
  ON public.refund_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Admins can send messages on any refund request
CREATE POLICY "Admins can send refund messages"
  ON public.refund_messages
  FOR INSERT
  WITH CHECK (
    sender_type = 'admin'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Admins can update message read status
CREATE POLICY "Admins can update refund messages"
  ON public.refund_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Users can update read status on their messages
CREATE POLICY "Users can update read status on their messages"
  ON public.refund_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.refund_requests rr
      WHERE rr.id = refund_messages.refund_request_id
      AND rr.user_id = auth.uid()
    )
  );

-- Enable realtime for refund_messages
ALTER TABLE public.refund_messages REPLICA IDENTITY FULL;

-- Add user_id column to refund_requests if not exists (for linking user to request)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'refund_requests' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.refund_requests ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;
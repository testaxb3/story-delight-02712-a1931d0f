-- Create script_requests table
CREATE TABLE IF NOT EXISTS public.script_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Request details
  situation_description TEXT NOT NULL,
  child_brain_profile TEXT,
  child_age INTEGER,
  location_type TEXT[],
  parent_emotional_state TEXT,
  urgency_level TEXT DEFAULT 'medium',
  additional_notes TEXT,
  
  -- Admin management
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'completed', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Related script (if admin creates one based on request)
  created_script_id UUID REFERENCES public.scripts(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.script_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own script requests"
  ON public.script_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create script requests"
  ON public.script_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending requests"
  ON public.script_requests FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all script requests"
  ON public.script_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all script requests"
  ON public.script_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_script_requests_updated_at
  BEFORE UPDATE ON public.script_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_script_requests_user_id ON public.script_requests(user_id);
CREATE INDEX idx_script_requests_status ON public.script_requests(status);
CREATE INDEX idx_script_requests_created_at ON public.script_requests(created_at DESC);
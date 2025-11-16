-- Create approved_users table for Cartpanda purchase validation
CREATE TABLE IF NOT EXISTS public.approved_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  
  -- Purchase data from Cartpanda
  order_id text,
  product_id text,
  product_name text,
  total_price numeric,
  currency text DEFAULT 'USD',
  
  -- Customer data
  first_name text,
  last_name text,
  
  -- Access control
  status text DEFAULT 'active', -- active, suspended, refunded, expired
  approved_at timestamptz DEFAULT now(),
  approved_by uuid REFERENCES profiles(id), -- For manual approvals
  
  -- Account tracking
  account_created boolean DEFAULT false,
  account_created_at timestamptz,
  user_id uuid REFERENCES profiles(id), -- When account is created
  
  -- Metadata
  webhook_data jsonb, -- Full webhook data for audit
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_approved_users_email ON public.approved_users(email);
CREATE INDEX idx_approved_users_order_id ON public.approved_users(order_id);
CREATE INDEX idx_approved_users_status ON public.approved_users(status);
CREATE INDEX idx_approved_users_user_id ON public.approved_users(user_id);

-- Enable RLS
ALTER TABLE public.approved_users ENABLE ROW LEVEL SECURITY;

-- Admins can manage everything
CREATE POLICY "Admins can manage approved_users"
  ON public.approved_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Users can view only their own approved status
CREATE POLICY "Users can view their own approved status"
  ON public.approved_users
  FOR SELECT
  USING (
    LOWER(email) = LOWER((SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Function to check if email is approved
CREATE OR REPLACE FUNCTION is_email_approved(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM approved_users
    WHERE LOWER(email) = LOWER(p_email)
    AND status = 'active'
  );
END;
$$;

COMMENT ON TABLE public.approved_users IS 'List of emails approved via Cartpanda to create premium accounts';
COMMENT ON FUNCTION is_email_approved IS 'Validates if an email is approved for account creation';
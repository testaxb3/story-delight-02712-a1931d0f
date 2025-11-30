-- Add phone column to approved_users for SMS
ALTER TABLE public.approved_users 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS sms_sent BOOLEAN DEFAULT false;
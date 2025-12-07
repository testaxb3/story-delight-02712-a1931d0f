-- Add reminder tracking columns to approved_users
ALTER TABLE public.approved_users 
ADD COLUMN IF NOT EXISTS reminder_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reminder_at timestamp with time zone;

-- Add index for efficient reminder queries
CREATE INDEX IF NOT EXISTS idx_approved_users_pending_reminders 
ON public.approved_users (account_created, status, approved_at, reminder_count) 
WHERE account_created = false AND status = 'active';
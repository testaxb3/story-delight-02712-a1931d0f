-- Add welcome_modal_shown column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS welcome_modal_shown BOOLEAN DEFAULT FALSE;

-- Set existing users to true (they've already been using the app)
UPDATE profiles
SET welcome_modal_shown = TRUE
WHERE welcome_modal_shown IS NULL OR welcome_modal_shown = FALSE;

-- Add community onboarding completion flag to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS community_onboarding_completed BOOLEAN DEFAULT false;
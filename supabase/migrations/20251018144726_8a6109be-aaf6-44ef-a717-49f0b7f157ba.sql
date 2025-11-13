-- Add action fields to scripts table for physical actions in each phrase
ALTER TABLE public.scripts 
  ADD COLUMN IF NOT EXISTS phrase_1_action text,
  ADD COLUMN IF NOT EXISTS phrase_2_action text,
  ADD COLUMN IF NOT EXISTS phrase_3_action text;
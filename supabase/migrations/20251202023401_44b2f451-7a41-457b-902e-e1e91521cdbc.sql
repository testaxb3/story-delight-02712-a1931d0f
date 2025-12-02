-- Add unlock_key column to audio_series table
ALTER TABLE audio_series ADD COLUMN IF NOT EXISTS unlock_key TEXT;

-- Update existing audio series with unlock_key
UPDATE audio_series 
SET unlock_key = 'audio_obedience_system' 
WHERE slug = 'the-obedience-audio-tracks';

-- Insert product configuration for The Obedience Audio System
INSERT INTO product_config (product_id, product_name, product_type, unlocks)
VALUES (
  '27845678',
  'The Obedience Audio System',
  'upsell',
  '["audio_obedience_system"]'
)
ON CONFLICT (product_id) DO UPDATE
SET 
  product_name = EXCLUDED.product_name,
  product_type = EXCLUDED.product_type,
  unlocks = EXCLUDED.unlocks,
  updated_at = now();
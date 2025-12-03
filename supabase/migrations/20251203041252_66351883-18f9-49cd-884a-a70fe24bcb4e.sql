-- Delete fake product_id placeholder
DELETE FROM product_config WHERE product_id = '12345678';

-- Add Account A product IDs (Conta A)
INSERT INTO product_config (product_id, product_name, product_type, unlocks) VALUES
  ('27577169', 'The Obedience Language (Conta A)', 'main', '["app_access", "scripts", "videos", "ebooks"]'),
  ('27851448', 'The Obedience Audio System (Conta A)', 'upsell', '["audio_obedience_system"]')
ON CONFLICT (product_id) DO NOTHING;
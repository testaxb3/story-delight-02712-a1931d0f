-- Add Hotmart main product to product_config
INSERT INTO product_config (product_id, product_name, product_type, unlocks)
VALUES ('6675006', 'The Obedience (Hotmart)', 'main', '["app_access"]'::jsonb)
ON CONFLICT (product_id) DO NOTHING;
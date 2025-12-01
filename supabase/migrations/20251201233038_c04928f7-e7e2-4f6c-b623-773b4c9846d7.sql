-- Phase 1: Add products column to approved_users
ALTER TABLE approved_users 
ADD COLUMN IF NOT EXISTS products JSONB DEFAULT '[]'::jsonb;

-- Create GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_approved_users_products 
ON approved_users USING GIN (products);

-- Phase 2: Create product_config table
CREATE TABLE IF NOT EXISTS product_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('main', 'order_bump', 'upsell')),
  unlocks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on product_config
ALTER TABLE product_config ENABLE ROW LEVEL SECURITY;

-- Anyone can view product config
CREATE POLICY "Anyone can view product config"
ON product_config FOR SELECT
USING (true);

-- Only admins can manage product config
CREATE POLICY "Admins can manage product config"
ON product_config FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Phase 3: Add preview and unlock fields to bonuses
ALTER TABLE bonuses 
ADD COLUMN IF NOT EXISTS preview_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS unlock_key TEXT;

-- Create index for unlock_key queries
CREATE INDEX IF NOT EXISTS idx_bonuses_unlock_key 
ON bonuses(unlock_key) WHERE unlock_key IS NOT NULL;

-- Phase 4: Insert initial product configurations
INSERT INTO product_config (product_id, product_name, product_type, unlocks) VALUES
('27499673', 'The Obedience Language', 'main', '["app_access", "scripts", "videos", "ebooks"]'::jsonb),
('12345678', 'The Calm Mom Code', 'order_bump', '["calm_mom_ebook", "calm_mom_audios"]'::jsonb)
ON CONFLICT (product_id) DO NOTHING;

-- Phase 5: Create audiobooks storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audiobooks',
  'audiobooks',
  false,
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-m4a']
)
ON CONFLICT (id) DO NOTHING;

-- Phase 6: RLS for audiobooks bucket based on user products
CREATE POLICY "Audio access based on purchased products"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'audiobooks' AND (
    -- Check if user has audio_lessons unlock
    EXISTS (
      SELECT 1 FROM approved_users au
      INNER JOIN profiles p ON p.email = au.email
      WHERE p.id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM jsonb_array_elements(au.products) AS prod
        WHERE prod->>'id' IN (
          SELECT product_id FROM product_config
          WHERE unlocks @> '["audio_lessons"]'::jsonb
        )
      )
    )
    -- OR user has preview access (first 2 audios)
    OR (storage.foldername(name))[1] IN ('preview')
  )
);

-- Admins can manage audiobooks
CREATE POLICY "Admins can manage audiobooks"
ON storage.objects FOR ALL
USING (
  bucket_id = 'audiobooks' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);
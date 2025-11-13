-- ============================================================================
-- STORAGE POLICIES for community-posts bucket
-- ============================================================================
-- Execute este SQL no Supabase SQL Editor
-- ============================================================================

-- 1. Public Read (qualquer um pode VER as imagens)
CREATE POLICY "Public can view community post images"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'community-posts'
);

-- 2. Authenticated Upload (usuarios logados podem fazer UPLOAD)
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'community-posts'
);

-- 3. Users can update/delete their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'community-posts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'community-posts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- PRONTO! Agora o storage está configurado para:
-- ✅ Qualquer um pode VER imagens (public read)
-- ✅ Usuários logados podem FAZER UPLOAD
-- ✅ Usuários podem UPDATE/DELETE suas próprias imagens
-- ============================================================================

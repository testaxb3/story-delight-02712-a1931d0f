-- Criar bucket público para imagens de lessons
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-images',
  'lesson-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Policy: Qualquer pessoa pode ver imagens (bucket público)
CREATE POLICY "Public read access for lesson-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-images');

-- Policy: Apenas admins podem fazer upload
CREATE POLICY "Admins can upload lesson images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lesson-images'
  AND public.is_current_user_admin()
);

-- Policy: Apenas admins podem atualizar
CREATE POLICY "Admins can update lesson images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lesson-images'
  AND public.is_current_user_admin()
);

-- Policy: Apenas admins podem deletar
CREATE POLICY "Admins can delete lesson images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lesson-images'
  AND public.is_current_user_admin()
);
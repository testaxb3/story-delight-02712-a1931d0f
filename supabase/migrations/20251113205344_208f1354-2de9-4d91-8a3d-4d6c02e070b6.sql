-- Insert the new "35 Strategies to Get Your Child Off Screens" ebook as a bonus
INSERT INTO public.bonuses (
  id,
  title,
  description,
  category,
  thumbnail,
  duration,
  locked,
  completed,
  progress,
  is_new,
  tags,
  view_url,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-5678-90ab-cdef-123456789abc'::uuid,
  '35 Strategies to Get Your Child Off Screens',
  'Evidence-based neuroscience strategies backed by Nature, NIH, and AAP research. Includes Dr. Dunckley''s 4-Week Reset Protocol and the official 5Cs Framework.',
  'ebook',
  '/assets/ebook-screen-strategies-cover.jpg',
  '45 min read',
  false,
  false,
  0,
  true,
  ARRAY['Screen Time', 'Brain Science', 'All Ages', 'AAP Guidelines'],
  '/ebook/screen-strategies',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
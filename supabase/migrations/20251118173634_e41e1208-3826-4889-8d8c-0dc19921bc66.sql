
-- Create bonus for "35 Strategies to Get Your Child Off Screens"
INSERT INTO bonuses (
  id,
  title,
  description,
  category,
  locked,
  thumbnail,
  view_url,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  '35 Strategies to Get Your Child Off Screens',
  'Evidence-based strategies to reclaim your child''s attention and restore family balance. Learn how to implement screen-free routines, handle resistance, and create lasting healthy habits.',
  'ebook',
  false,
  NULL, -- thumbnail will be populated from ebook
  '/ebook-v2/a5bcd951-d0f4-42bb-a3a7-abb959ee86b7',
  NOW(),
  NOW()
)
RETURNING id;

-- Update ebook to link to the newly created bonus
UPDATE ebooks
SET bonus_id = (SELECT id FROM bonuses WHERE title = '35 Strategies to Get Your Child Off Screens' LIMIT 1)
WHERE slug = '35-strategies-to-get-your-child-off-screens-v2';

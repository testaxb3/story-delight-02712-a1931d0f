-- Create bonus for Meltdown Decoder V2 and link the ebook

-- Insert the bonus
INSERT INTO bonuses (
  title,
  description,
  category,
  thumbnail,
  tags,
  is_new
)
VALUES (
  'The Meltdown Decoder',
  'A practical guide to understanding and responding to challenging behavior. Learn what your child''s behavior is really communicating and how to respond effectively using the CVC Framework.',
  'ebook',
  NULL,
  ARRAY['behavior', 'meltdowns', 'communication', 'CVC framework', 'universal'],
  true
)
RETURNING id;

-- Update the ebook to link to the new bonus
UPDATE ebooks
SET bonus_id = (
  SELECT id FROM bonuses WHERE title = 'The Meltdown Decoder' LIMIT 1
)
WHERE slug = 'meltdown-decoder-v2';
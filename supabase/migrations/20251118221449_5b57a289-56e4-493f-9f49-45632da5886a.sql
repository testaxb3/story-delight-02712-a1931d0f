-- Fix all ebook bonus view_urls to use slugs consistently
UPDATE bonuses
SET view_url = CASE 
  WHEN id = '2250eb0d-0cc0-44f9-8a9c-c40cdd014231' THEN '/ebook-v2/meltdown-decoder-v2'
  WHEN id = '0e33ced3-f6fc-4291-b2b1-96c372d90ae2' THEN '/ebook-v2/35-strategies-to-get-your-child-off-screens-v2'
  WHEN id = '01f80b3e-7c23-4652-8b94-514c395fcfa2' THEN '/ebook-v2/the-calm-mom-code-v2'
  ELSE view_url
END
WHERE category = 'ebook';
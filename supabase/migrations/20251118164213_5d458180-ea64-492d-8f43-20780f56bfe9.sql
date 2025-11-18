-- Archive all ebook bonuses (lowercase category)
UPDATE bonuses
SET 
  archived_at = NOW(),
  archived_by = (SELECT id FROM profiles WHERE is_admin = true LIMIT 1),
  updated_at = NOW()
WHERE category = 'ebook' 
  AND archived_at IS NULL;
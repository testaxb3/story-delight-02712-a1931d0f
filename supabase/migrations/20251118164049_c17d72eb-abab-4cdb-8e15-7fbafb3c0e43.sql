-- Archive all ebook bonuses
UPDATE bonuses
SET 
  archived_at = NOW(),
  archived_by = (SELECT id FROM profiles WHERE is_admin = true LIMIT 1),
  updated_at = NOW()
WHERE category = 'Ebook' 
  AND archived_at IS NULL;
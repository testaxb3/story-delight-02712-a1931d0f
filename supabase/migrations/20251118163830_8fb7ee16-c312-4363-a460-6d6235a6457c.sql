-- Soft delete all active ebooks (content is preserved in database)
UPDATE ebooks 
SET 
  deleted_at = NOW(),
  updated_at = NOW()
WHERE deleted_at IS NULL;

-- Update all bonuses to remove ebook view_urls
UPDATE bonuses
SET 
  view_url = NULL,
  updated_at = NOW()
WHERE view_url LIKE '/ebook%';
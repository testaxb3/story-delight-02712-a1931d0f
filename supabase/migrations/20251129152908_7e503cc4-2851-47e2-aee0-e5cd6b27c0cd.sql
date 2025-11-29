-- Set view_url to NULL for all ebook bonuses
-- This forces the application to use dynamic slug lookup from the ebooks table
UPDATE bonuses 
SET view_url = NULL
WHERE category = 'ebook';
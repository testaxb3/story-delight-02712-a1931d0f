-- Update The Calm Mom Code bonus to use V2 ebook reader
UPDATE bonuses 
SET view_url = '/ebook-v2/27a77561-58e4-47a0-ab19-0f544b415a0d',
    updated_at = now()
WHERE id = 'ce393e26-0df1-4fa7-9ff0-e03f33f22a16';
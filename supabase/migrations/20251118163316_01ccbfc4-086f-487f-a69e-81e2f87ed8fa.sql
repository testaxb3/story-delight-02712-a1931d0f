-- Step 1: Clear the blocking slug (change deleted ebook to avoid conflict)
UPDATE ebooks 
SET slug = 'calm-mom-code-v2-old-deleted'
WHERE id = '51366f17-30b7-404c-a1bb-48506815fdad';

-- Step 2: Restore the complete version (11 chapters) with the proper slug
UPDATE ebooks 
SET 
  deleted_at = NULL,
  slug = 'calm-mom-code-v2',
  bonus_id = 'ce393e26-0df1-4fa7-9ff0-e03f33f22a16',
  updated_at = NOW()
WHERE id = '6c209e97-1b7c-4795-a1a3-bd81e844f9f1';

-- Step 3: Soft delete the current incomplete version (8 chapters)
UPDATE ebooks 
SET 
  deleted_at = NOW(),
  slug = 'calm-mom-code-v2-incomplete-deleted',
  updated_at = NOW()
WHERE id = '27a77561-58e4-47a0-ab19-0f544b415a0d';

-- Step 4: Update bonus to point to the complete 11-chapter ebook
UPDATE bonuses 
SET 
  view_url = '/ebook-v2/6c209e97-1b7c-4795-a1a3-bd81e844f9f1',
  updated_at = NOW()
WHERE id = 'ce393e26-0df1-4fa7-9ff0-e03f33f22a16';
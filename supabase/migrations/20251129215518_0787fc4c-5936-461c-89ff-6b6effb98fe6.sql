-- Migrate videos to appropriate collections based on content

-- Understanding Development collection
UPDATE bonuses SET collection_id = 'c0d20702-0179-4591-b328-67e15971d9d9'
WHERE id IN (
  '7ab145f4-eb61-4b22-8bce-c3afa087a489', -- 3 Stages of Emotional Child Development
  'fc12267b-f841-4af0-ba34-7203911d6df5', -- Lives of neglected Children
  '8852fa45-622b-4cc8-8233-0ca0ee45d863', -- Early brain development
  '433b83fa-6546-4531-b17d-ca8df7c7554e', -- A Revealing Look at Toddler Development
  '79ac1e82-c17a-4a82-ae68-ff8a29fc41f7'  -- The Whole Child: Ackermann's 4 Natural Forces
);

-- Parenting Foundations collection
UPDATE bonuses SET collection_id = 'ad3cd71e-e2c9-48e1-9eb7-5a56525ffdf7'
WHERE id IN (
  '91535b70-89a9-44bd-8ab9-9373fb3f6b7b', -- Good Parenting Techniques
  '0866404e-7aba-4722-8d8d-07e3269ecb84', -- 5 Parenting Styles and Their Effects on Life
  'd3a6bbb7-4022-4a9c-b516-f2a5ccd3ce90', -- 4 Parenting Styles and Their Effects On You
  '8751a555-bfc1-4b9f-97cd-b503e6693f7e'  -- Positive Discipline at School
);

-- Managing Emotions collection
UPDATE bonuses SET collection_id = '6bea22fc-577d-4ca1-a0cc-0a94387e2654'
WHERE id IN (
  '5c873f85-954e-4d61-8e7a-264e66eb2ad9'  -- Coping with Tantrums
);

-- Activities & Play collection
UPDATE bonuses SET collection_id = '60c2f64c-2dd1-43e3-9d3f-76326f9ae519'
WHERE id IN (
  'd1c8f4c9-0d56-4cca-b5f2-c9c72e3ebd02'  -- Easy Water Sensory Play Ideas for Toddlers
);

-- Special Topics collection
UPDATE bonuses SET collection_id = 'ea0caae0-7cca-4922-b8e7-168f7c8c53ab'
WHERE id IN (
  'aec25797-a135-4126-9f04-c4f93537facb', -- 10 Characteristics Of Highly Toxic Parents
  'd771b7aa-3c2c-4a6e-bdd7-705b717b1958'  -- Top 5 Bilingual Parenting Mistakes
);
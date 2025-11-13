-- Insert the "Why Your Child Acts This Way" ebook as a bonus

INSERT INTO bonuses (
  title,
  description,
  category,
  thumbnail,
  duration,
  locked,
  completed,
  progress,
  is_new,
  tags,
  view_url,
  unlock_requirement
) VALUES (
  'Why Your Child Acts This Way - Complete Interactive Ebook',
  '29 meta-analyzed studies, 3,500+ children in research samples, and word-for-word scripts for every situation. Validated by peer-reviewed research.',
  'ebook',
  '/ebook-cover.png',
  '5 Chapters',
  false,
  false,
  0,
  true,
  ARRAY['Neuroscience', 'All Profiles', 'Research-Based', 'Interactive'],
  '/ebook',
  null
);

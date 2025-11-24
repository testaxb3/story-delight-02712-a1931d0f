-- Update official community names to be simpler (just the brain profile name)
UPDATE communities
SET name = 'INTENSE'
WHERE id = 'ddaf4069-2106-4f42-b6d9-8d3352ba985e' AND is_official = true;

UPDATE communities
SET name = 'DEFIANT'
WHERE id = 'cea49707-0b83-4cc1-8cac-78472ae8359a' AND is_official = true;

UPDATE communities
SET name = 'DISTRACTED'
WHERE id = 'ec50da3d-0d1a-4370-be99-707d7bbc68ea' AND is_official = true;
-- Delete the old long message
DELETE FROM script_request_messages 
WHERE id = 'f4fd50b9-4bdf-456b-9ea5-5d9f63530eda';

-- Insert the new optimized message
INSERT INTO script_request_messages (script_request_id, sender_id, sender_type, message)
VALUES (
  '1a13827a-1244-460a-93cf-51d512bd56c3',
  '89f7b0fe-5da1-4931-ad5c-12ac95b9150f',
  'admin',
  E'Joanne, here''s the secret:\n\nAt 3, her brain can''t process "STOP doing X."\n\nWhat works: tell her WHAT TO DO instead.\n\nInstead of "stop climbing" → "Feet on the floor"\nInstead of "stop screaming" → "Soft voice"\n\nGet close, touch her shoulder, say the action. If she doesn''t respond, gently guide her body.\n\nI just added a complete script on this to the app → "Keeps doing the thing you just asked them to stop" in Daily Responsibilities.'
);
-- Fix line breaks in what_doesnt_work for Social/DISTRACTED script
UPDATE public.scripts
SET what_doesnt_work = 'Most parents try interrupting from across the room: "Hey buddy, maybe let your friend have a turn talking!"

When that doesn''t work, they get more direct: "You''ve been talking about Minecraft for 40 minutes. Talk about something else."

When that doesn''t work, they rescue the situation by suggesting an activity: "Why don''t you two go play outside?"

This approach fails because it treats social blindness like a choice. Your DISTRACTED child isn''t ignoring social cues on purpose—their brain literally isn''t RECEIVING the data. They''re hyperfocused on their own interest, which creates tunnel vision. The subtle signals (body language, tone shifts, decreased engagement) don''t penetrate the hyperfocus bubble.

Telling them "read the room" is like telling a colorblind person "just see the red." The neurological equipment isn''t there.'
WHERE title = 'Playdate monologue - talks AT friend for 40 minutes straight about single topic'
AND category = 'Social'
AND profile = 'DISTRACTED';
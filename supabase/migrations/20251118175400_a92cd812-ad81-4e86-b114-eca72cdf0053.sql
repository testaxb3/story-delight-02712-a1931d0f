
-- Fix Chapter 8 line breaks for "35 Strategies to Get Your Child Off Screens"
UPDATE ebooks
SET content = jsonb_set(
  content,
  '{chapters,7,content}',
  '[
    {"type": "heading2", "content": "50+ Screen-Free Activities Kids Actually Enjoy"},
    {"type": "paragraph", "content": "**The key: Replacement, not just removal.**"},
    {"type": "paragraph", "content": "You can''t just take away screens and leave a void. You must fill that void with activities that are **immediately engaging, require minimal setup**, and provide the stimulation their brains crave."},
    {"type": "callout", "calloutType": "TRY", "content": {"title": "The Activity Menu", "body": "Print this list and post it on your fridge. When kids say \"I''m bored,\" point to the menu and say: **\"Pick something, or I''ll pick for you.\"**"}},
    {"type": "heading2", "content": "Physical Activities (For High-Energy Kids)"},
    {"type": "list", "items": ["**Trampoline jumping** → Releases endorphins, regulates sensory system", "**Bike riding or scootering** → Neighborhood laps or park trails", "**Dance party** → Create playlists, learn TikTok dances (without the phone)", "**Obstacle course** → Use furniture, pillows, tape for indoor courses", "**Sports practice** → Shooting hoops, kicking soccer ball, catch", "**Skateboarding or rollerblading** → Driveway practice", "**Jump rope or hopscotch** → Classic playground games", "**Yoga or stretching** → YouTube-free routines from library books", "**Swimming** → Pool, lake, or sprinkler", "**Hiking or nature walks** → Local trails, identify plants/animals"]},
    {"type": "heading2", "content": "Creative Activities (For Maker Kids)"},
    {"type": "list", "items": ["**LEGO building** → Free build or follow instruction books", "**Drawing or painting** → Still life, imagination drawings, painting rocks", "**Clay sculpting** → Air-dry clay or Play-Doh creations", "**Friendship bracelets** → Macrame or beading", "**Origami** → Follow library books for paper folding", "**Cardboard creations** → Build cities, rockets, or forts", "**Sewing projects** → Hand-stitching or simple sewing machine projects", "**Music** → Practice instrument, write songs, make instruments", "**Photography** → Real camera (not phone) photo scavenger hunts", "**Woodworking** → Simple projects with parent supervision"]},
    {"type": "heading2", "content": "Social Activities (For Connection)"},
    {"type": "list", "items": ["**Board games** → Family game night classics (Ticket to Ride, Catan, Codenames)", "**Card games** → Uno, Go Fish, Poker, Magic the Gathering", "**Cooking together** → Kids choose and help prepare meals", "**Baking** → Cookies, muffins, bread (kids measure and mix)", "**Invite a friend over** → Old-school playdates with outdoor activities", "**Neighborhood games** → Kickball, capture the flag, hide and seek", "**Volunteering** → Food bank, animal shelter, community cleanup", "**Family projects** → Organize garage, plant garden, paint room", "**Puzzle building** → 500-1000 piece puzzles as family activity", "**Reading aloud** → Take turns reading chapter books together"]},
    {"type": "heading2", "content": "Quiet Activities (For Wind-Down Time)"},
    {"type": "list", "items": ["**Reading** → Graphic novels, chapter books, magazines", "**Audiobooks** → Listen while drawing or doing puzzles", "**Journaling** → Daily gratitude, feelings check-in, creative writing", "**Coloring books** → Detailed adult coloring books are calming", "**Model building** → Airplanes, cars, ships (requires focus)", "**Knitting or crocheting** → Repetitive, meditative crafts", "**Brain teasers** → Sudoku, crosswords, logic puzzles", "**Stargazing** → Identify constellations, watch for meteors", "**Meditation or breathing exercises** → Guided practices from library", "**Letter writing** → Pen pals, thank you notes, letters to future self"]},
    {"type": "heading2", "content": "Productive Activities (For Growing Responsibility)"},
    {"type": "list", "items": ["**Age-appropriate chores** → Laundry, vacuuming, organizing", "**Pet care** → Walking dog, grooming, training tricks", "**Gardening** → Plant vegetables, flowers, or indoor plants", "**Car washing** → Earn money by washing family cars", "**Organizing** → Closet, toys, bookshelf (surprisingly fun)", "**Budgeting practice** → Track allowance, plan savings goals", "**Meal planning** → Plan weekly meals, make grocery list", "**Teaching younger siblings** → Read to them, help with homework", "**Research projects** → Pick a topic of interest and create a presentation", "**Starting a business** → Lemonade stand, dog walking, lawn mowing"]},
    {"type": "callout", "calloutType": "REMEMBER", "content": {"title": "The First Week Is Key", "body": "Kids will resist these activities at first because **their dopamine system is still recalibrating**. By week 2-3, they''ll naturally gravitate toward these alternatives."}},
    {"type": "heading2", "content": "The Boredom Jar"},
    {"type": "paragraph", "content": "One of the best tools for beating \"I''m bored\" complaints:"},
    {"type": "heading2", "content": "How to Create a Boredom Jar:"},
    {"type": "paragraph", "content": "**Step 1**: Sit down with your kids and brainstorm 30-50 screen-free activities they''d enjoy"},
    {"type": "paragraph", "content": "**Step 2**: Write each activity on a slip of paper and put them in a jar"},
    {"type": "paragraph", "content": "**Step 3**: When kids complain about boredom, they must pick 3 activities from the jar and choose one to do"},
    {"type": "paragraph", "content": "**Step 4**: Once completed, they earn 30 minutes of screen time (if they want it)"},
    {"type": "callout", "calloutType": "TRY", "content": {"title": "Pro Tip", "body": "Color-code activities: **Red** = High energy, **Blue** = Quiet time, **Green** = Social, **Yellow** = Creative. Kids pick from the appropriate color based on mood and time of day."}},
    {"type": "heading2", "content": "The 3-Zone Activity System"},
    {"type": "paragraph", "content": "Structure your home with dedicated activity zones:"},
    {"type": "paragraph", "content": "**Zone 1: The Movement Zone** → Trampoline, sports equipment, bikes. Kids can release energy here anytime."},
    {"type": "paragraph", "content": "**Zone 2: The Creation Station** → Art supplies, LEGO, craft materials. Always accessible, minimal cleanup required."},
    {"type": "paragraph", "content": "**Zone 3: The Quiet Corner** → Books, puzzles, coloring books. A cozy space for wind-down activities."},
    {"type": "callout", "calloutType": "SCIENCE", "content": {"title": "Environmental Design Matters", "body": "Research shows that **visible, accessible alternatives** reduce screen-seeking behavior by 60%. If art supplies are buried in a closet, kids won''t choose them. Make alternatives easier to access than screens."}},
    {"type": "heading2", "content": "When Nothing Sounds Fun"},
    {"type": "paragraph", "content": "Your child says: *\"None of that sounds fun. I just want my tablet.\"*"},
    {"type": "paragraph", "content": "Your response: *\"I hear you. Your brain is still adjusting. You don''t have to have fun—you just have to move your body. Go outside for 10 minutes. If you still feel bored after that, we''ll talk.\"*"},
    {"type": "paragraph", "content": "**What usually happens**: After 10 minutes of movement, their mood shifts. They find something to do. The craving for screens fades."},
    {"type": "callout", "calloutType": "REMEMBER", "content": {"title": "Activity Resistance Is Normal", "body": "During the first 2 weeks, kids will reject alternatives and insist nothing is fun. **This is withdrawal, not truth**. By week 3, they''ll rediscover the joy in offline activities."}}
  ]'::jsonb
)
WHERE slug = '35-strategies-to-get-your-child-off-screens-v2'

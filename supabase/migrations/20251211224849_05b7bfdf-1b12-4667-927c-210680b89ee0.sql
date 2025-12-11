-- Insert Lesson 2 for Picky Eating Challenge
INSERT INTO lessons (
  program_id,
  day_number,
  title,
  summary,
  image_url,
  estimated_minutes,
  content
) VALUES (
  (SELECT id FROM programs WHERE slug = 'picky-eating-challenge'),
  2,
  'Creating a Positive Mealtime Environment',
  'Does your dining table feel more like a battleground than a place of enjoyment? If mealtime is filled with stress, frustration, and anxiety, it''s time to make a change.',
  '/images/programs/picky-eating-lesson-2.webp',
  8,
  '{
    "version": 2,
    "sections": [
      {
        "type": "text",
        "data": {
          "content": "Does your dining table feel more like a battleground than a place of enjoyment? If mealtime is filled with stress, frustration, and anxiety, it''s time to make a change.",
          "variant": "lead"
        }
      },
      {
        "type": "divider",
        "data": { "style": "dots" }
      },
      {
        "type": "text",
        "data": {
          "content": "Why a Positive Mealtime Environment Matters",
          "variant": "heading"
        }
      },
      {
        "type": "text",
        "data": {
          "content": "The environment during meals plays a significant role in a child''s willingness to eat and try new foods. A tense or pressured atmosphere can increase anxiety and resistance, leading to more picky eating behaviors. On the other hand, a positive and relaxed environment can help children feel safe, making them more open to exploring different foods and enjoying the experience of eating."
        }
      },
      {
        "type": "numbered-list",
        "data": {
          "title": "7 Strategies for Better Mealtimes",
          "colorScheme": "blue",
          "items": [
            {
              "number": 1,
              "title": "Set a Consistent Mealtime Routine",
              "description": "Children thrive on routine and predictability. Try to have meals at the same time each day, and make it a family event. Knowing when to expect meals can reduce anxiety and help children come to the table more willingly."
            },
            {
              "number": 2,
              "title": "Keep Mealtimes Short and Sweet",
              "description": "Toddlers have short attention spans and sitting at the table for too long can lead to restlessness. Aim for mealtimes to last about 20-30 minutes. This is usually enough time for children to eat without feeling bored or pressured."
            },
            {
              "number": 3,
              "title": "Turn Off Distractions",
              "description": "Create a calm environment by turning off the TV, putting away devices, and minimizing other distractions. This helps your child focus on eating and enjoying the meal, rather than being overstimulated by background noise."
            },
            {
              "number": 4,
              "title": "Engage in Pleasant Conversation",
              "description": "Use mealtimes as an opportunity to connect with your child. Talk about fun topics, ask about their day, or share a story. Avoid discussing negative topics or criticizing eating habits during meals. Keeping the conversation light and engaging makes mealtimes more enjoyable."
            },
            {
              "number": 5,
              "title": "Encourage, Don''t Pressure",
              "description": "Encourage your child to try new foods, but avoid pressuring them to eat. Pressure can lead to negative associations with certain foods and make picky eating worse. Instead, offer new foods alongside familiar favorites and allow your child to choose what and how much to eat."
            },
            {
              "number": 6,
              "title": "Involve Your Child in Meal Preparation",
              "description": "Toddlers are more likely to eat foods they''ve helped prepare. Let your child wash vegetables, stir ingredients, or set the table. This involvement can increase their interest in the meal and give them a sense of ownership over what they eat."
            },
            {
              "number": 7,
              "title": "Create a Comfortable Setting",
              "description": "Ensure that your child''s seating is comfortable and that they can easily reach their food. Use child-sized utensils and plates to make eating easier. A comfortable setting can make a big difference in how your child approaches mealtime."
            }
          ]
        }
      },
      {
        "type": "divider",
        "data": { "style": "line" }
      },
      {
        "type": "text",
        "data": {
          "content": "Mealtime Mood Chart",
          "variant": "heading"
        }
      },
      {
        "type": "callout",
        "data": {
          "variant": "activity",
          "title": "Today''s Activity",
          "content": "Create a Mealtime Mood Chart to help your child express how they feel about meals. Draw different faces on a piece of paper – happy, neutral, and sad. Before and after each meal, ask your child to point to how they feel. This can help you understand their feelings towards mealtime and identify any issues that need to be addressed."
        }
      }
    ]
  }'::jsonb
);
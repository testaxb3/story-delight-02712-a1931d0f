INSERT INTO lessons (program_id, day_number, title, summary, image_url, audio_url, estimated_minutes, content)
SELECT 
  p.id,
  3,
  'Introducing New Foods',
  'Introducing new foods to a picky eater can sometimes feel like an uphill battle. It''s normal for toddlers to be hesitant or even outright refuse to try new foods. However, with patience, persistence, and a few smart strategies, you can make this process easier and more enjoyable for both you and your child.',
  '/images/programs/picky-eating/lesson-3.webp',
  '/audio/programs/picky-eating/lesson-3.mp3',
  5,
  '[
    {
      "type": "hero",
      "title": "Lesson 3. Introducing New Foods",
      "image_url": "/images/programs/picky-eating/lesson-3.webp"
    },
    {
      "type": "text",
      "content": "Introducing new foods to a picky eater can sometimes feel like an uphill battle. It''s normal for toddlers to be hesitant or even outright refuse to try new foods.\n\nHowever, with patience, persistence, and a few smart strategies, you can make this process easier and more enjoyable for both you and your child."
    },
    {
      "type": "heading",
      "level": 2,
      "content": "The Importance of Repeated Exposure"
    },
    {
      "type": "text",
      "content": "One of the most effective ways to get a picky eater to try new foods is through repeated exposure. Research shows that it can take 10 to 15 exposures to a new food before a child is willing to try it.\n\nThis doesn''t mean they need to eat it every time – it''s about getting them familiar with the food in a low-pressure way. Repeated exposure helps reduce neophobia, the fear of new foods, and builds familiarity and acceptance over time."
    },
    {
      "type": "heading",
      "level": 2,
      "content": "Strategies for Introducing New Foods"
    },
    {
      "type": "numbered-list",
      "items": [
        {
          "title": "Offer New Foods Alongside Favorites:",
          "content": "When introducing a new food, pair it with something your child already likes. This way, the new food doesn''t feel as intimidating. For example, if your child loves pasta, try adding a new vegetable to the dish. They might not eat the new food right away, but seeing it next to something they enjoy can make them more comfortable."
        },
        {
          "title": "Use the \"One Bite\" Rule:",
          "content": "Encourage your child to take just one bite of the new food. If they don''t like it, they don''t have to eat any more. The key is to keep this process stress-free. If they refuse, don''t push it. The goal is to make them feel safe exploring new foods without pressure."
        },
        {
          "title": "Get Creative with Food Presentation:",
          "content": "Presentation matters, especially for toddlers. Make new foods fun and visually appealing. Use cookie cutters to shape fruits and vegetables, create colorful food arrangements, or use dips and sauces that your child likes. Making food fun can entice your child to try something new."
        },
        {
          "title": "Involve Your Child in Cooking:",
          "content": "Children are more likely to try foods they''ve helped prepare. Involve your child in cooking by letting them wash vegetables, stir ingredients, or sprinkle cheese. This hands-on experience makes new foods less intimidating and gives your child a sense of pride in what they''ve made."
        },
        {
          "title": "Make New Foods a Part of Daily Life:",
          "content": "Talk about new foods, show them at the grocery store, or read books about food together. The more familiar your child becomes with different foods outside of mealtime, the more open they might be to trying them."
        },
        {
          "title": "Use Sensory Play:",
          "content": "Before eating new foods, let your child explore them through touch and smell. This sensory exploration can help them become more comfortable with new textures and flavors. Set up a \"food play\" station where they can feel and smell different foods without the pressure to eat them."
        }
      ]
    }
  ]'::jsonb
FROM programs p
WHERE p.slug = 'picky-eating-challenge';
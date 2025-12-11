-- Update Lesson 3 with v2 structured content format
UPDATE lessons
SET content = '{
  "version": 2,
  "sections": [
    {
      "type": "text",
      "data": {
        "content": "Introducing new foods to a picky eater can sometimes feel like an uphill battle. It''s normal for toddlers to be hesitant or even outright refuse to try new foods.",
        "variant": "lead"
      }
    },
    {
      "type": "text",
      "data": {
        "content": "However, with patience, persistence, and a few smart strategies, you can make this process easier and more enjoyable for both you and your child."
      }
    },
    {
      "type": "callout",
      "data": {
        "variant": "info",
        "title": "The Science Behind It",
        "content": "Research shows that it can take 10 to 15 exposures to a new food before a child is willing to try it. Repeated exposure helps reduce neophobia (the fear of new foods) and builds familiarity and acceptance over time."
      }
    },
    {
      "type": "numbered-list",
      "data": {
        "title": "Strategies for Introducing New Foods",
        "colorScheme": "orange",
        "items": [
          {
            "number": 1,
            "title": "Offer New Foods Alongside Favorites",
            "description": "When introducing a new food, pair it with something your child already likes. This way, the new food doesn''t feel as intimidating. For example, if your child loves pasta, try adding a new vegetable to the dish."
          },
          {
            "number": 2,
            "title": "Use the \"One Bite\" Rule",
            "description": "Encourage your child to take just one bite of the new food. If they don''t like it, they don''t have to eat any more. The key is to keep this process stress-free."
          },
          {
            "number": 3,
            "title": "Get Creative with Presentation",
            "description": "Presentation matters! Use cookie cutters to shape fruits and vegetables, create colorful food arrangements, or use dips and sauces that your child likes. Making food fun can entice your child to try something new."
          },
          {
            "number": 4,
            "title": "Involve Your Child in Cooking",
            "description": "Children are more likely to try foods they''ve helped prepare. Let them wash vegetables, stir ingredients, or sprinkle cheese. This hands-on experience makes new foods less intimidating."
          },
          {
            "number": 5,
            "title": "Make New Foods Part of Daily Life",
            "description": "Talk about new foods, show them at the grocery store, or read books about food together. The more familiar your child becomes with different foods outside of mealtime, the more open they might be to trying them."
          },
          {
            "number": 6,
            "title": "Use Sensory Play",
            "description": "Before eating new foods, let your child explore them through touch and smell. Set up a \"food play\" station where they can feel and smell different foods without the pressure to eat them."
          }
        ]
      }
    },
    {
      "type": "callout",
      "data": {
        "variant": "tip",
        "title": "Remember",
        "content": "This doesn''t mean they need to eat the new food every time – it''s about getting them familiar with the food in a low-pressure way."
      }
    }
  ]
}'::jsonb
WHERE day_number = 3 
AND program_id = (SELECT id FROM programs WHERE slug = 'picky-eating-challenge');
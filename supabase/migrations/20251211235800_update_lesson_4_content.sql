-- Update Lesson 4 content to Structured JSON format with Timeline and Cards
UPDATE lessons
SET 
  title = 'Kids and Meal Prep',
  summary = 'Involving kids in meal planning and preparation is more than just a fun activity; it''s a powerful tool to encourage curiosity and expand their palate.',
  content = '{
  "version": 2,
  "sections": [
    {
      "type": "hero",
      "data": {
        "title": "Kids and Meal Prep",
        "coverImage": "/images/lessons/28-day-picky-eater-4.webp"
      }
    },
    {
      "type": "text",
      "data": {
        "content": "Imagine your toddler stirring a bowl of salad, carefully placing vegetables on a plate, or eagerly tasting a sauce they helped prepare. Involving kids in meal planning and preparation is more than just a fun activity; it''s a powerful tool to encourage curiosity and expand their palate."
      }
    },
    {
      "type": "heading",
      "data": {
        "text": "Why Involvement in Meal Prep Matters",
        "level": 2
      }
    },
    {
      "type": "text",
      "data": {
        "content": "Kids are naturally curious and love to explore their environment, including what goes into their tummies. By involving them in the kitchen, you tap into this curiosity. They learn about different ingredients, textures, and tastes, and are more likely to try foods they''ve had a hand in making."
      }
    },
    {
      "type": "text",
      "data": {
        "content": "Participating in meal prep also gives children a sense of control and accomplishment, which can be particularly motivating for toddlers asserting their independence."
      }
    },
    {
      "type": "numbered-list",
      "data": {
        "title": "Benefits of Involving Kids in Meal Prep",
        "variant": "timeline",
        "colorScheme": "orange",
        "items": [
          {
            "number": 1,
            "title": "Builds Food Familiarity",
            "description": "Handling different ingredients helps kids become more familiar with various foods, making them less intimidating. Touching, smelling, and seeing foods before tasting them can make trying new things less daunting."
          },
          {
            "number": 2,
            "title": "Encourages Healthy Eating Habits",
            "description": "When children participate in preparing their meals, they are more likely to make healthier food choices. They learn where their food comes from and what goes into making a meal, which can foster an appreciation for fresh, whole foods."
          },
          {
            "number": 3,
            "title": "Promotes Independence and Confidence",
            "description": "Kids feel proud when they can say, \"I made this!\" It boosts their confidence and encourages them to try new things, both in and out of the kitchen."
          },
          {
             "number": 4,
             "title": "Quality Family Time",
             "description": "Cooking together is a great way to spend time as a family. It provides an opportunity for parents and kids to bond, communicate, and enjoy each other''s company."
          }
        ]
      }
    },
    {
      "type": "numbered-list",
      "data": {
        "title": "What to Keep in Mind",
        "colorScheme": "orange",
        "items": [
          {
            "number": 1,
            "title": "Start Simple",
            "description": "Begin with easy tasks that are safe for toddlers, such as washing vegetables, stirring ingredients, or tearing lettuce for a salad. As they get more comfortable, you can introduce more complex tasks."
          },
          {
            "number": 2,
            "title": "Give Them Choices",
            "description": "Let your child have a say in meal planning. Offer two or three healthy options and let them choose what they''d like to help prepare. For example, \"Would you like to help make a fruit salad or a veggie wrap today?\" Giving them choices helps them feel involved and invested in the meal."
          },
          {
            "number": 3,
            "title": "Use Kid-Friendly Tools",
            "description": "Equip your kitchen with child-safe utensils like plastic knives, small rolling pins, and mixing bowls. These tools allow your child to participate safely and independently."
          },
          {
            "number": 4,
            "title": "Make it Fun",
            "description": "Turn cooking into a fun, sensory experience. Play upbeat music, let them wear a special apron, or use cookie cutters to create fun shapes. The more enjoyable the process, the more eager they will be to participate."
          },
           {
            "number": 5,
            "title": "Teach Basic Skills",
            "description": "Use meal prep time to teach simple kitchen skills, like washing hands before cooking, measuring ingredients, or following simple recipes. These skills are not only useful but also give children a sense of responsibility."
          }
        ]
      }
    },
     {
      "type": "cta",
      "data": {
        "text": "Kid-Friendly Recipe Cards",
        "description": "Download our set of Kid-Friendly Recipe Cards, designed especially for children. Our recipes offer healthy twists on old favorites.",
        "buttonText": "Download PDF",
        "buttonAction": "next"
      }
    }
  ]
}'::jsonb
WHERE 
  day_number = 4 AND 
  program_id = (SELECT id FROM programs WHERE slug = 'picky-eating-challenge');

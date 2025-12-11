UPDATE lessons 
SET content = '{
  "version": 2,
  "sections": [
    {
      "type": "heading",
      "data": { "level": 2, "text": "Why Involvement in Meal Prep Matters" }
    },
    {
      "type": "text",
      "data": { "content": "Kids are naturally curious and love to explore their environment. When they''re involved in meal preparation, they develop a sense of ownership over the food they help create. This involvement can transform mealtime from a battleground into a collaborative experience." }
    },
    {
      "type": "text",
      "data": { "content": "Research shows that children who participate in cooking are more likely to try new foods. The hands-on experience demystifies ingredients and makes the final dish feel like an accomplishment rather than something foreign." }
    },
    {
      "type": "heading",
      "data": { "level": 2, "text": "Benefits of Involving Kids in Meal Prep" }
    },
    {
      "type": "numbered-list",
      "data": {
        "title": "Key Benefits",
        "colorScheme": "orange",
        "items": [
          { "number": 1, "title": "Increased Food Acceptance", "description": "When kids help prepare a meal, they''re more invested in eating it. The pride of creation often overrides initial hesitation about new ingredients." },
          { "number": 2, "title": "Skill Development", "description": "Cooking teaches valuable life skills—measuring, following instructions, and understanding cause and effect. These skills build confidence that extends beyond the kitchen." },
          { "number": 3, "title": "Quality Time Together", "description": "Meal prep becomes bonding time. The kitchen transforms into a space for conversation, laughter, and shared accomplishment." },
          { "number": 4, "title": "Understanding Where Food Comes From", "description": "Hands-on cooking helps children connect ingredients to meals, fostering appreciation for food and potentially reducing waste." }
        ]
      }
    },
    {
      "type": "heading",
      "data": { "level": 2, "text": "What to Keep in Mind" }
    },
    {
      "type": "callout",
      "data": {
        "variant": "tip",
        "title": "Age-Appropriate Tasks",
        "content": "Match tasks to your child''s abilities. Toddlers can wash vegetables or tear lettuce. Older kids can measure ingredients or stir mixtures. The goal is participation, not perfection."
      }
    },
    {
      "type": "callout",
      "data": {
        "variant": "warning",
        "title": "Expect Mess",
        "content": "Cooking with kids is messy—embrace it! Lay down a mat, use aprons, and remember that the experience matters more than a spotless kitchen."
      }
    },
    {
      "type": "callout",
      "data": {
        "variant": "info",
        "title": "Start Simple",
        "content": "Begin with recipes that have few ingredients and simple steps. Smoothies, salads, and sandwiches are great starting points before progressing to more complex dishes."
      }
    }
  ]
}'::jsonb
WHERE id = '3764446d-cbf3-439b-b38a-01205f126665';
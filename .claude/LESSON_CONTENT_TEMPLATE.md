# Lesson Content Template v2

**MANDATORY**: Always reference this template when creating or editing lesson content.

## JSON Structure (version 2)

```json
{
  "version": 2,
  "sections": [
    // Array of section objects
  ]
}
```

## Valid Section Types

### 1. `text` - Paragraph Text
```json
{
  "type": "text",
  "data": {
    "content": "Your paragraph content here.",
    "variant": "default" | "lead" | "highlight"
  }
}
```
- **default**: Regular paragraph
- **lead**: First paragraph, slightly larger/bolder (use for opening)
- **highlight**: Important text that stands out

### 2. `heading` - Section Headers
```json
{
  "type": "heading",
  "data": {
    "text": "Section Title",
    "level": 2 | 3
  }
}
```
- Level 2 = Major section
- Level 3 = Subsection

### 3. `numbered-list` - Numbered Items with Cards
```json
{
  "type": "numbered-list",
  "data": {
    "title": "List Title (optional)",
    "subtitle": "Brief description (optional)",
    "colorScheme": "blue" | "orange" | "green" | "purple",
    "variant": "default" | "timeline",
    "items": [
      {
        "number": 1,
        "title": "Item Title",
        "description": "Item description text"
      }
    ]
  }
}
```

### 4. `callout` - Highlighted Boxes
```json
{
  "type": "callout",
  "data": {
    "variant": "info" | "warning" | "success" | "tip",
    "title": "Callout Title (optional)",
    "content": "Callout message content"
  }
}
```
- **info** (blue): General information, "Did you know?"
- **warning** (amber): Cautions, things to avoid
- **success** (green): Achievements, positive reinforcement
- **tip** (purple): Actionable advice, challenges

**⚠️ CRITICAL**: Always use `"variant"`, never `"type"` inside data!

### 5. `divider` - Visual Separators
```json
{
  "type": "divider",
  "data": {
    "style": "line" | "dots" | "space"
  }
}
```

### 6. `accordion` - Expandable Sections
```json
{
  "type": "accordion",
  "data": {
    "title": "Section Title (optional)",
    "items": [
      {
        "title": "Accordion Item Title",
        "content": "Expanded content text"
      }
    ]
  }
}
```

### 7. `reflection-form` - Interactive Reflection
```json
{
  "type": "reflection-form",
  "data": {
    "title": "Reflection Title",
    "description": "Instructions for reflection",
    "fields": [
      {
        "label": "Field Label",
        "placeholder": "Placeholder text (optional)",
        "description": "Field hint (optional)"
      }
    ]
  }
}
```

### 8. `hero` - Cover Image (Use Sparingly)
```json
{
  "type": "hero",
  "data": {
    "title": "Lesson Title",
    "subtitle": "Optional subtitle",
    "coverImage": "/images/programs/{program-slug}/lesson-{XX}.webp"
  }
}
```
**Note**: Prefer using `lesson.image_url` database field instead of hero section.

### 9. `cta` - Call to Action
```json
{
  "type": "cta",
  "data": {
    "text": "CTA Heading",
    "description": "Supporting text",
    "buttonText": "Button Label",
    "buttonAction": "next" | "diary" | "close"
  }
}
```

## Recommended Lesson Structure

```json
{
  "version": 2,
  "sections": [
    // 1. Opening (hook the reader)
    { "type": "text", "data": { "content": "...", "variant": "lead" } },
    
    // 2. Context/Problem
    { "type": "text", "data": { "content": "..." } },
    
    // 3. Warning or Key Insight
    { "type": "callout", "data": { "variant": "warning", "title": "...", "content": "..." } },
    
    // 4. Divider
    { "type": "divider", "data": { "style": "dots" } },
    
    // 5. Main Content Heading
    { "type": "heading", "data": { "text": "Main Section Title", "level": 2 } },
    
    // 6. Explanation
    { "type": "text", "data": { "content": "..." } },
    
    // 7. Numbered List (strategies, steps, etc.)
    { "type": "numbered-list", "data": { "title": "...", "colorScheme": "blue", "items": [...] } },
    
    // 8. Divider
    { "type": "divider", "data": { "style": "line" } },
    
    // 9. Actionable Tip
    { "type": "callout", "data": { "variant": "tip", "title": "Today's Challenge", "content": "..." } },
    
    // 10. Preview of Next Lesson
    { "type": "callout", "data": { "variant": "info", "content": "Tomorrow, you'll learn..." } },
    
    // 11. CTA
    { "type": "cta", "data": { "text": "Ready to continue?", "buttonText": "Back to Lessons", "buttonAction": "close" } }
  ]
}
```

## Image Path Convention

All lesson images must follow this pattern:
```
/images/programs/{program-slug}/lesson-{XX}.webp
```

Examples:
- `/images/programs/picky-eating-challenge/lesson-01.webp`
- `/images/programs/picky-eating-challenge/lesson-02.webp`

## Common Mistakes to AVOID

❌ Using `"type": "warning"` inside callout data
✅ Use `"variant": "warning"`

❌ Using `"variant": "activity"` 
✅ Use `"variant": "tip"` for activities/challenges

❌ Mixing `"type": "text"` with `"data": { "variant": "heading" }`
✅ Use separate `"type": "heading"` sections for headers

❌ Inconsistent image paths
✅ Always use `/images/programs/{slug}/lesson-{XX}.webp`

❌ Missing `"version": 2` at root level
✅ Always include version field

## Validation Checklist

Before saving lesson content:

- [ ] Root has `"version": 2`
- [ ] Root has `"sections": []` array
- [ ] All callouts use `"variant"` not `"type"`
- [ ] All variants are valid: `info`, `warning`, `success`, `tip`
- [ ] Image paths follow convention
- [ ] No trailing commas in JSON
- [ ] All required fields present for each section type

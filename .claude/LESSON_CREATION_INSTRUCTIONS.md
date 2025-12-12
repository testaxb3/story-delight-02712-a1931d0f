# Lesson Creation Instructions

**MANDATORY**: Follow these steps for every lesson creation or edit.

## Pre-Creation Checklist

1. [ ] Read `.claude/LESSON_CONTENT_TEMPLATE.md` first
2. [ ] Identify target program slug (e.g., `picky-eating-challenge`)
3. [ ] Determine lesson number (day_number)
4. [ ] Prepare image with correct path: `/images/programs/{slug}/lesson-{XX}.webp`

## Workflow

### Step 1: Prepare Image
```
Path: /images/programs/{program-slug}/lesson-{XX}.webp
Example: /images/programs/picky-eating-challenge/lesson-06.webp
```

### Step 2: Build Content JSON

Start with the template structure:

```json
{
  "version": 2,
  "sections": [
    // Build sections here
  ]
}
```

### Step 3: Validate Before Saving

Run through validation checklist:

- [ ] `"version": 2` present at root
- [ ] All `callout` sections use `"variant"` not `"type"`
- [ ] Variants are valid: `info`, `warning`, `success`, `tip`
- [ ] No invalid variants like `"activity"` (use `"tip"` instead)
- [ ] `numbered-list` has valid `colorScheme`: `blue`, `orange`, `green`, `purple`
- [ ] JSON is valid (no trailing commas, balanced brackets)

### Step 4: Database Insert/Update

```sql
-- New lesson
INSERT INTO lessons (program_id, day_number, title, image_url, content)
SELECT 
  p.id,
  {LESSON_NUMBER},
  '{TITLE}',
  '/images/programs/{slug}/lesson-{XX}.webp',
  '{CONTENT_JSON}'::jsonb
FROM programs p
WHERE p.slug = '{program-slug}';

-- Update existing
UPDATE lessons 
SET content = '{CONTENT_JSON}'::jsonb,
    image_url = '/images/programs/{slug}/lesson-{XX}.webp'
WHERE day_number = {LESSON_NUMBER}
AND program_id = (SELECT id FROM programs WHERE slug = '{program-slug}');
```

## Section Order Recommendation

1. **Opening Hook** - `text` with `variant: "lead"`
2. **Context/Problem** - `text` paragraphs
3. **Key Insight** - `callout` with `variant: "warning"` or `"info"`
4. **Divider** - `divider` with `style: "dots"`
5. **Main Content** - `heading` + `text` + `numbered-list`
6. **Divider** - `divider` with `style: "line"`
7. **Action Item** - `callout` with `variant: "tip"` for challenge
8. **Next Preview** - `callout` with `variant: "info"`
9. **CTA** - `cta` section

## Valid Callout Variants

| Variant | Color | Use For |
|---------|-------|---------|
| `info` | Blue | General info, previews, "did you know" |
| `warning` | Amber | Cautions, things to avoid, problems |
| `success` | Green | Achievements, positive reinforcement |
| `tip` | Purple | Activities, challenges, action items |

## Common Errors & Fixes

### Error: "Cannot read properties of undefined (reading 'icon')"
**Cause**: Invalid callout variant
**Fix**: Change `variant` to one of: `info`, `warning`, `success`, `tip`

### Error: Missing cover image
**Cause**: `image_url` is null or incorrect path
**Fix**: Set `image_url` to `/images/programs/{slug}/lesson-{XX}.webp`

### Error: Visual diagram labels overlapping
**Cause**: Too many labels or invalid positions
**Fix**: Use max 5-6 labels with valid positions: `top-left`, `top-right`, `bottom-left`, `bottom-right`, `left`, `right`

## File Locations

- Template: `.claude/LESSON_CONTENT_TEMPLATE.md`
- These instructions: `.claude/LESSON_CREATION_INSTRUCTIONS.md`
- Components: `src/components/Lessons/content/`
- Types: `src/types/lesson-content.ts`

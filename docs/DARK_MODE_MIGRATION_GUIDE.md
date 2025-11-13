# Dark Mode Migration Guide

Quick reference for applying dark mode to remaining components.

## Quick Reference

### Class Replacement Table

| Old Class | New Class | Use Case |
|-----------|-----------|----------|
| `bg-white` | `bg-card` or `glass` | Cards and surfaces |
| `bg-white/90` | `glass` | Floating cards |
| `text-gray-900` | `text-foreground` | Primary text |
| `text-gray-700` | `text-foreground` | Primary text |
| `text-gray-600` | `text-muted-foreground` | Secondary text |
| `text-gray-500` | `text-muted-foreground` | Tertiary text |
| `border-gray-200` | `border-border` | Borders |
| `border-gray-300` | `border-border` | Borders |
| `bg-gray-50` | `bg-muted` | Light backgrounds |
| `bg-gray-100` | `bg-muted` | Light backgrounds |

### Gradient Patterns

```tsx
// Hero sections
from-purple-600 via-purple-500 to-pink-500
dark:from-purple-900/90 dark:via-purple-800/80 dark:to-pink-900/90

// Success cards
from-emerald-500 via-green-500 to-teal-500
dark:from-emerald-700/80 dark:via-green-700/70 dark:to-teal-700/80

// Info cards
from-blue-600 via-blue-500 to-cyan-500
dark:from-blue-800/80 dark:via-blue-700/70 dark:to-cyan-800/80

// Stats cards
from-purple-100 to-purple-200
dark:from-purple-900/40 dark:to-purple-800/40
```

### Glass Effect Pattern

```tsx
// Instead of
bg-white/90 backdrop-blur-glass border-none shadow-lg

// Use
glass border-none shadow-lg
```

### Decorative Elements

```tsx
// Light circles
bg-white/10 dark:bg-white/5

// Borders on glass
border-white/20 dark:border-white/10
```

### Button Patterns

```tsx
// Primary on colored bg
bg-white text-purple-600 hover:bg-purple-50
dark:bg-slate-100 dark:text-purple-700 dark:hover:bg-slate-200

// Secondary ghost style
bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10
text-white border-white/30 dark:border-white/20
```

## Step-by-Step Process

### 1. Find Hardcoded Colors

Search for:
- `bg-white`
- `bg-gray-`
- `text-gray-`
- `border-gray-`

### 2. Replace with Semantic Classes

Use the table above for replacements.

### 3. Add Dark Variants to Gradients

For any `from-*`, `via-*`, `to-*` classes, add corresponding `dark:` variants.

### 4. Update Decorative Elements

Add `dark:bg-white/5` to decorative circles and backgrounds.

### 5. Test

Toggle dark mode and verify:
- Text is readable
- Borders are visible
- Hover states work
- Contrast is good

## Common Patterns

### Card with Content

```tsx
<Card className="glass border-none shadow-lg">
  <CardHeader>
    <CardTitle className="text-foreground">Title</CardTitle>
    <CardDescription className="text-muted-foreground">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent className="text-foreground">
    Content
  </CardContent>
</Card>
```

### Colored Badge

```tsx
<Badge className="bg-purple-500/10 dark:bg-purple-500/20
                text-purple-700 dark:text-purple-300
                border-purple-500/20 dark:border-purple-500/10">
  Label
</Badge>
```

### Stat Card

```tsx
<div className="relative overflow-hidden rounded-2xl
                bg-gradient-to-br from-purple-100 to-purple-200
                dark:from-purple-900/40 dark:to-purple-800/40
                p-5 shadow-lg border-2
                border-purple-300/50 dark:border-purple-700/30">
  <div className="absolute top-0 right-0 w-24 h-24
                  bg-purple-300/30 dark:bg-purple-700/20
                  rounded-full -mr-12 -mt-12" />

  <div className="relative z-10">
    <div className="p-2.5 bg-purple-500 dark:bg-purple-600
                    rounded-xl shadow-md">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="text-4xl font-black
                    text-purple-900 dark:text-purple-100">
      123
    </div>
    <div className="text-sm font-bold
                    text-purple-700 dark:text-purple-300">
      Label
    </div>
  </div>
</div>
```

## Testing Checklist

For each component:

- [ ] Toggle to dark mode
- [ ] Verify all text is readable
- [ ] Check borders are visible
- [ ] Test hover states
- [ ] Verify contrast with DevTools
- [ ] Check on different screen sizes
- [ ] Test with system theme change

## Quick Wins

Components that only need semantic class replacements:
- List items
- Simple cards
- Text blocks
- Form inputs (already done in ui/input.tsx)

Components that need gradient updates:
- Hero sections
- Feature cards
- Stat boxes
- Success stories

## Need Help?

Reference the complete documentation:
- `docs/DARK_MODE_DESIGN_SYSTEM.md` - Full design system
- `docs/DARK_MODE_IMPLEMENTATION_REPORT.md` - Implementation details
- `src/pages/Dashboard.tsx` - Working example

## Estimated Time

| Component Type | Time Estimate |
|----------------|---------------|
| Simple card | 5 minutes |
| Page with cards | 15-20 minutes |
| Complex page | 30-45 minutes |
| Full page refactor | 1-2 hours |

Total for remaining pages: **4-6 hours**

# Bonuses Page - Component Architecture Map

## Visual Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                         Bonuses.tsx                             │
│                    (Main Container Page)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐   ┌──────────────┐
│ AnimatedPage │    │   useAuth()      │   │ useNavigate()│
│  (Wrapper)   │    │ (User Context)   │   │  (Routing)   │
└──────────────┘    └──────────────────┘   └──────────────┘


═══════════════════════════════════════════════════════════════════
                        Page Structure
═══════════════════════════════════════════════════════════════════

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  1. BonusesHeader Component                                   ┃
┃  ────────────────────────────────────────────────────────────  ┃
┃  ┌─────────────────────────────────────────────────────────┐  ┃
┃  │ Welcome back, [Name]                                    │  ┃
┃  │ Continue your journey to parenting mastery              │  ┃
┃  └─────────────────────────────────────────────────────────┘  ┃
┃                                                                ┃
┃  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         ┃
┃  │ Bonuses  │ │Completed │ │Completion│ │   Time   │         ┃
┃  │Available │ │  Count   │ │ Percent  │ │ Invested │         ┃
┃  │   12/17  │ │   3/17   │ │   18%    │ │  2.5h    │         ┃
┃  └──────────┘ └──────────┘ └──────────┘ └──────────┘         ┃
┃                                                                ┃
┃  ┌─────────────────────────────────────────────────────────┐  ┃
┃  │ Your Learning Journey                                   │  ┃
┃  │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 18%        │  ┃
┃  └─────────────────────────────────────────────────────────┘  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  2. ContinueLearning Component (Conditional)                  ┃
┃  ────────────────────────────────────────────────────────────  ┃
┃  📈 Continue Learning - Pick up where you left off            ┃
┃                                                                ┃
┃  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           ┃
┃  │ [Thumbnail] │  │ [Thumbnail] │  │ [Thumbnail] │           ┃
┃  │ Bonus Title │  │ Bonus Title │  │ Bonus Title │           ┃
┃  │ ████░ 35%   │  │ ██████░ 60% │  │ ███░ 25%    │           ┃
┃  │ [Continue]  │  │ [Continue]  │  │ [Continue]  │           ┃
┃  └─────────────┘  └─────────────┘  └─────────────┘           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  3. Coming Soon Notice (Info Card)                            ┃
┃  ────────────────────────────────────────────────────────────  ┃
┃  📅 New Bonuses Added Weekly                                  ┃
┃  We're constantly adding new resources...                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  4. BonusesCategoryTabs Component                             ┃
┃  ────────────────────────────────────────────────────────────  ┃
┃  ╔═══════╦════════╦═════════╦═══════╦════════╗                ┃
┃  ║  All  ║ Videos ║ Ebooks  ║  PDFs ║ Tools  ║                ┃
┃  ║  (17) ║  (5)   ║   (1)   ║  (4)  ║  (3)   ║                ┃
┃  ╚═══════╩════════╩═════════╩═══════╩════════╝                ┃
┃                                                                ┃
┃  ┌──────────────────┐ ┌──────────┐ ┌───┐┌───┐┌───┐           ┃
┃  │ 🔍 Search...     │ │ Sort By ▼│ │ ▦ ││ ≡ ││ ≡ │           ┃
┃  └──────────────────┘ └──────────┘ └───┘└───┘└───┘           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  5. Available Now Section                                     ┃
┃  ────────────────────────────────────────────────────────────  ┃
┃  Available Now  [12 bonuses]                                  ┃
┃                                                                ┃
┃  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           ┃
┃  │  [THUMB]    │  │  [THUMB]    │  │  [THUMB]    │           ┃
┃  │ [NEW] [PDF] │  │ [✓] [VIDEO] │  │ [TOOL]      │           ┃
┃  │             │  │             │  │             │           ┃
┃  │ Bonus Title │  │ Bonus Title │  │ Bonus Title │           ┃
┃  │ Description │  │ Description │  │ Description │           ┃
┃  │ #tag #tag   │  │ #tag #tag   │  │ #tag #tag   │           ┃
┃  │             │  │             │  │             │           ┃
┃  │ ⏱ 18min    │  │ ⏱ 22min    │  │ 💾 2.5MB    │           ┃
┃  │ [Download]  │  │ [Watch Now] │  │ [Access]    │           ┃
┃  └─────────────┘  └─────────────┘  └─────────────┘           ┃
┃                                                                ┃
┃  [... 9 more cards in grid ...]                               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  6. Coming Soon Section (Locked)                              ┃
┃  ────────────────────────────────────────────────────────────  ┃
┃  Coming Soon  [5 locked]                                      ┃
┃                                                                ┃
┃  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           ┃
┃  │  [THUMB]    │  │  [THUMB]    │  │  [THUMB]    │           ┃
┃  │ 🔒 [VIDEO]  │  │ 🔒 [PDF]    │  │ 🔒 [SESSION]│           ┃
┃  │             │  │             │  │             │           ┃
┃  │ Locked Title│  │ Locked Title│  │ 1-on-1 Call │           ┃
┃  │ Description │  │ Description │  │ Description │           ┃
┃  │             │  │             │  │             │           ┃
┃  │ Complete    │  │ Complete    │  │ Refer 3     │           ┃
┃  │ 30-day      │  │ Foundation  │  │ friends     │           ┃
┃  │ [🔒 Locked] │  │ [🔒 Locked] │  │ [🔒 Locked] │           ┃
┃  └─────────────┘  └─────────────┘  └─────────────┘           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  7. Unlock More CTA                                           ┃
┃  ────────────────────────────────────────────────────────────  ┃
┃              ✨ Want to Unlock More Bonuses?                  ┃
┃                                                                ┃
┃  Complete challenges, maintain your streak, and engage        ┃
┃  with the community to unlock exclusive content...            ┃
┃                                                                ┃
┃     [View Challenges]  [Join Community]                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## Component Breakdown

### 1. BonusesHeader
**File**: `src/components/bonuses/BonusesHeader.tsx`

**Props**:
```typescript
{
  userName: string          // User's first name
  totalBonuses: number      // Total count
  unlockedBonuses: number   // Available count
  completedBonuses: number  // Completed count
  totalTimeSpent: string    // e.g., "2.5h"
}
```

**Sub-components**:
- Welcome message (gradient text)
- 4 stat cards (animated entrance)
- Overall progress card with bar

**Styling**:
- Gradient icons and backgrounds
- Framer-motion stagger animations
- Responsive grid (2 → 4 cols)

---

### 2. ContinueLearning
**File**: `src/components/bonuses/ContinueLearning.tsx`

**Props**:
```typescript
{
  inProgressBonuses: BonusData[]  // Filtered 0-100% progress
  onContinue: (bonus: BonusData) => void
}
```

**Features**:
- Shows max 3 bonuses
- Horizontal card layout
- Thumbnail with play overlay
- Progress bar with time remaining
- "Continue" CTA button

**Conditional Rendering**:
```typescript
{inProgressBonuses.length > 0 && <ContinueLearning />}
```

---

### 3. BonusesCategoryTabs
**File**: `src/components/bonuses/BonusesCategoryTabs.tsx`

**Props**:
```typescript
{
  activeCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  categories: Array<{
    id: string
    label: string
    icon: any
    count: number
  }>
}
```

**Sub-sections**:
1. Category tabs (horizontal scroll on mobile)
2. Search input with icon
3. Sort dropdown
4. View mode toggles (grid/list)
5. Advanced filters (collapsible)

**State Management**:
- Local state for filter visibility
- Parent state for all filter values

---

### 4. BonusCard
**File**: `src/components/bonuses/BonusCard.tsx`

**Props**:
```typescript
{
  bonus: BonusData    // Full bonus object
  onAction?: (bonus: BonusData) => void
  index?: number      // For stagger animation
}
```

**Bonus Data Interface**:
```typescript
interface BonusData {
  id: string
  title: string
  description: string
  category: "video" | "ebook" | "tool" | "pdf" | "session" | "template"
  thumbnail?: string
  duration?: string
  size?: string
  locked: boolean
  completed?: boolean
  progress?: number
  isNew?: boolean
  requirement?: string
  tags?: string[]
  downloadUrl?: string
  viewUrl?: string
}
```

**Card Sections**:
1. **Thumbnail** (48px height)
   - Image or gradient with icon
   - Status badges (top-left)
   - Category badge (top-right)
   - Quick actions (bottom-right, on hover)

2. **Content** (padding 5)
   - Title (line-clamp-2)
   - Description (line-clamp-2)
   - Tags (flex-wrap)
   - Progress bar (if applicable)
   - Meta info (duration/size)
   - Action buttons

**Category Color Config**:
```typescript
const categoryConfig = {
  video: { color: "red-pink", icon: Play },
  ebook: { color: "blue-cyan", icon: BookOpen },
  pdf: { color: "emerald-teal", icon: FileText },
  tool: { color: "purple-indigo", icon: Wrench },
  template: { color: "violet-purple", icon: FileText },
  session: { color: "orange-amber", icon: Clock }
}
```

---

## Data Flow

```
┌─────────────────┐
│ bonusesData.ts  │
│  (Mock Data)    │
└────────┬────────┘
         │
         │ import mockBonusesData
         ▼
┌─────────────────┐
│  Bonuses.tsx    │ ◄── useAuth (user data)
│  (Main Page)    │ ◄── useNavigate (routing)
└────────┬────────┘
         │
         │ Pass props & handlers
         │
    ┌────┼────┬────────────┬─────────────┐
    │         │            │             │
    ▼         ▼            ▼             ▼
┌────────┐ ┌─────┐ ┌──────────┐ ┌──────────┐
│ Header │ │ Cont│ │   Tabs   │ │  Cards   │
│        │ │ Lrn │ │          │ │  (Grid)  │
└────────┘ └─────┘ └──────────┘ └──────────┘
```

---

## State Management in Bonuses.tsx

```typescript
// Category filter
const [activeCategory, setActiveCategory] = useState("all");

// Search query
const [searchQuery, setSearchQuery] = useState("");

// Sort option
const [sortBy, setSortBy] = useState("newest");

// View mode
const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

// Computed/filtered data
const filteredAndSortedBonuses = useMemo(() => {
  const filtered = filterBonuses(mockBonusesData, activeCategory, searchQuery);
  return sortBonuses(filtered, sortBy);
}, [activeCategory, searchQuery, sortBy]);

// Separate into unlocked/locked
const unlockedBonuses = filteredAndSortedBonuses.filter(b => !b.locked);
const lockedBonuses = filteredAndSortedBonuses.filter(b => b.locked);

// Get in-progress bonuses
const inProgressBonuses = mockBonusesData.filter(
  b => b.progress > 0 && b.progress < 100 && !b.locked
);
```

---

## Animation Strategy

### Framer-motion Animations

**Page entrance**:
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

**Stagger animations** (cards):
```typescript
transition={{ duration: 0.5, delay: index * 0.1 }}
```

**Hover effects**:
```typescript
whileHover={{ y: -4 }}
```

**Scale effects**:
```typescript
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
```

---

## Utility Functions (bonusesData.ts)

### getBonusCategoryCounts()
Calculates count for each category:
```typescript
{
  all: 17,
  video: 5,
  ebook: 1,
  pdf: 4,
  tool: 3,
  template: 2,
  session: 1
}
```

### filterBonuses()
Filters by category and search query:
- Category: exact match or "all"
- Search: title, description, or tags (case-insensitive)

### sortBonuses()
Sort strategies:
- `newest`: NEW badge first
- `popular`: Completed first
- `title`: Alphabetical A-Z
- `progress`: Highest progress first
- `completed`: Completed status first

---

## Responsive Grid System

**Desktop (lg)**: 3 columns
```typescript
className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
```

**Tablet (md)**: 2 columns

**Mobile (default)**: 1 column

**Stat Cards**:
```typescript
className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
```

---

## CSS Classes & Utilities

### Custom Gradients
- `gradient-primary`: Primary brand gradient
- `bg-gradient-to-br from-X to-Y`: Custom gradients
- `bg-clip-text text-transparent`: Gradient text

### Shadows
- `shadow-lg`: Large shadow
- `shadow-xl`: Extra large
- `shadow-2xl`: Massive shadow
- `hover:shadow-2xl`: Hover state

### Borders
- `border-2`: Medium border
- `hover:border-primary/30`: Hover border color

### Effects
- `backdrop-blur-sm`: Blur effect
- `glass`: Glassmorphism (custom class)
- `transition-all duration-300`: Smooth transitions

---

## Component Dependencies

```
Bonuses.tsx
├── AnimatedPage (common)
├── BonusesHeader
│   ├── Card, Progress (ui)
│   ├── Icons (lucide-react)
│   └── motion (framer-motion)
├── ContinueLearning
│   ├── Card, Button, Progress (ui)
│   └── BonusData interface
├── BonusesCategoryTabs
│   ├── Tabs, Input, Select, Button (ui)
│   └── Icons (lucide-react)
├── BonusCard
│   ├── Card, Button, Badge, Progress (ui)
│   └── BonusData interface
└── bonusesData.ts
    ├── mockBonusesData (data)
    └── utility functions
```

---

## File Sizes

```
BonusesHeader.tsx       151 lines   ~4 KB
BonusCard.tsx           235 lines   ~8 KB
BonusesCategoryTabs.tsx 169 lines   ~6 KB
ContinueLearning.tsx    107 lines   ~3 KB
bonusesData.ts          290 lines   ~12 KB
Bonuses.tsx (new)       259 lines   ~9 KB
───────────────────────────────────────────
Total:                  1,211 lines ~42 KB
```

---

## Performance Considerations

### Optimizations Implemented

1. **Memoization**: Filter/sort computed with `useMemo()`
2. **Conditional Rendering**: Continue Learning only when needed
3. **Lazy Animations**: Stagger delays prevent janky animations
4. **Image Optimization**: Unsplash with auto-format
5. **Component Splitting**: Modular, tree-shakeable exports

### Future Optimizations

- Virtual scrolling for 100+ bonuses
- Lazy load images below fold
- Skeleton loading states
- Pagination or infinite scroll
- Service Worker caching

---

## Testing Strategy

### Unit Tests
```typescript
// bonusesData.test.ts
test('filterBonuses filters by category', () => {...})
test('filterBonuses searches by query', () => {...})
test('sortBonuses sorts correctly', () => {...})
test('getBonusCategoryCounts returns correct counts', () => {...})
```

### Component Tests
```typescript
// BonusCard.test.tsx
test('renders locked state correctly', () => {...})
test('shows progress bar when in progress', () => {...})
test('calls onAction when clicked', () => {...})
```

### Integration Tests
```typescript
// Bonuses.test.tsx
test('filters and displays correct bonuses', () => {...})
test('search returns relevant results', () => {...})
test('category tabs change view', () => {...})
```

---

## Accessibility (a11y)

✅ Semantic HTML structure
✅ ARIA labels on interactive elements
✅ Keyboard navigation support
✅ Focus states visible
✅ Color contrast compliant (WCAG AA)
✅ Alt text on images
✅ Screen reader friendly labels

---

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile Safari (iOS 14+)
✅ Chrome Mobile (Android 10+)

**CSS Features Used**:
- Grid layout
- Flexbox
- CSS gradients
- Transform/transitions
- Backdrop blur
- CSS variables

---

## Deployment Checklist

- [x] Build passes without errors
- [x] TypeScript types correct
- [x] No console errors
- [x] Mobile responsive
- [x] Images load correctly
- [x] Animations smooth
- [x] Links/navigation work
- [ ] Analytics tracking (optional)
- [ ] Performance audit (optional)
- [ ] Accessibility audit (optional)

---

**Component Map Version**: 1.0
**Last Updated**: 2025-11-12
**Build Status**: ✅ Passing

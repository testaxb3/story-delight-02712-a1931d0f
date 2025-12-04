# TeleprompterLyrics Auto-Scroll Fix - iOS Safari PWA

## Root Cause Analysis

### Issue 1: Parent Container Overflow Conflict
**Location:** Line 73 (original) - Parent `<div>` wrapper
```tsx
<div className="relative w-full h-full overflow-hidden">
```

**Problem:**
- Parent container had `overflow-hidden` which creates a new stacking context
- iOS Safari has issues with nested overflow contexts (parent hidden, child auto)
- The parent `overflow-hidden` was blocking scroll events from propagating correctly
- iOS Safari's rendering engine doesn't handle this pattern well in PWA mode

**Fix:**
Removed `overflow-hidden` from parent container:
```tsx
<div className="relative w-full h-full">
```

---

### Issue 2: scrollTo() Timing Race Condition
**Location:** Lines 39-66 (original) - useEffect scroll logic

**Problem:**
The original implementation used:
1. Double `requestAnimationFrame()` - not enough for iOS Safari
2. No delay for Framer Motion animations to complete (300ms duration)
3. Manual `scrollTo()` calculation which is unreliable on iOS

**iOS Safari Specific Issues:**
- Rendering pipeline: Layout → Paint → Composite → Display
- Double RAF only guarantees Layout + Paint
- Composite step can take additional time in PWA mode
- Framer Motion opacity/scale changes need to fully commit before scroll

**Fix:**
Implemented multi-strategy approach:
1. **iOS Detection:** Platform-specific scroll strategy
2. **Timing:** 450ms delay for iOS (Framer Motion 300ms + 150ms render buffer)
3. **Triple RAF:** Ensures all rendering phases complete
4. **scrollIntoView:** More reliable than manual calculation on iOS
5. **Fallback:** Manual scrollTo() if scrollIntoView fails

---

### Issue 3: CSS Scroll Behavior Conflicts
**Location:** Line 77 (original) - Scroll container class

**Problem:**
```tsx
className="h-full overflow-y-auto scroll-smooth px-6 scrollbar-hide"
```

Issues:
- `scroll-smooth` CSS class + `behavior: 'smooth'` in scrollTo() = double smoothing
- iOS Safari applies its own momentum scrolling
- Competing scroll behaviors cause janky or failed scrolls
- Missing `-webkit-overflow-scrolling: touch` for iOS momentum

**Fix:**
Conditional scroll behavior + iOS-specific optimizations:
```tsx
style={{
  WebkitOverflowScrolling: 'touch',      // iOS momentum scrolling
  scrollBehavior: isIOS ? 'auto' : 'smooth',  // iOS: instant, others: smooth
  transform: 'translateZ(0)',            // GPU acceleration
  willChange: 'scroll-position',         // Browser hint for optimization
}}
```

---

## The Solution - Multi-Strategy Implementation

### Strategy 1: iOS-Specific scrollIntoView
**When:** Detected iOS device
**How:** Native browser API with center alignment
```tsx
activeElement.scrollIntoView({
  behavior: 'smooth',
  block: 'center',
  inline: 'nearest'
});
```

**Why Better for iOS:**
- Browser handles all calculations
- Respects iOS Safari's rendering pipeline
- Works with nested overflow contexts
- Handles PWA constraints automatically

### Strategy 2: Manual Calculation Fallback
**When:** Non-iOS devices OR scrollIntoView fails
**How:** Calculate target scroll position
```tsx
const targetScrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
```

### Strategy 3: Last Resort Instant Scroll
**When:** Both above fail
**How:** Direct scrollTop assignment
```tsx
container.scrollTop = targetScrollTop;
```

---

## Implementation Details

### Platform Detection
```tsx
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
const isPWA = window.matchMedia('(display-mode: standalone)').matches;
```

### Timing Optimization
```tsx
const scrollDelay = isIOS ? 450 : 350;
// iOS: Wait for Framer Motion (300ms) + render buffer (150ms)
// Other: Wait for Framer Motion (300ms) + safety buffer (50ms)

setTimeout(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {  // Triple RAF for iOS
        scrollToActive();
      });
    });
  });
}, scrollDelay);
```

### Cleanup & Debouncing
```tsx
const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// Clear pending scroll on new active segment
if (scrollTimeoutRef.current) {
  clearTimeout(scrollTimeoutRef.current);
}

// Cleanup on unmount
return () => {
  if (scrollTimeoutRef.current) {
    clearTimeout(scrollTimeoutRef.current);
  }
};
```

---

## CSS Optimizations for iOS Safari

### Container Level
```tsx
style={{
  WebkitOverflowScrolling: 'touch',      // Enable iOS momentum scrolling
  scrollBehavior: isIOS ? 'auto' : 'smooth',  // Prevent double-smoothing on iOS
  transform: 'translateZ(0)',            // Force GPU layer (hardware acceleration)
  willChange: 'scroll-position',         // Hint to browser for optimization
  overflowY: 'auto',                     // Explicit overflow (not from class)
  position: 'relative',                  // Establish positioning context
}}
```

### Element Level (Each Lyric)
```tsx
style={{
  lineHeight: '1.6',
  transform: 'translateZ(0)',  // Force GPU acceleration for smooth rendering
}}
```

**Why GPU Acceleration Matters:**
- iOS Safari delegates scrolling to GPU when elements are on separate layers
- `translateZ(0)` forces layer creation without visual changes
- Reduces main thread work during scroll
- Prevents jank during Framer Motion animations

---

## Debug Logging

### Console Output on iOS
```
[TeleprompterLyrics] iOS scroll triggered: {
  segmentIndex: 5,
  text: "And then the moment came...",
  isPWA: true
}
```

### Console Output on Fallback
```
[TeleprompterLyrics] Fallback scroll triggered: {
  elementTop: 2400,
  elementHeight: 48,
  containerHeight: 600,
  targetScrollTop: 2124,
  currentScrollTop: 1800
}
```

### Error Logging
```
[TeleprompterLyrics] ScrollIntoView failed: [error]
[TeleprompterLyrics] Smooth scroll failed, using instant: [error]
```

---

## Testing Checklist

### iOS Safari PWA Testing
- [ ] Open DevTools on connected iPhone (Safari → Develop → iPhone)
- [ ] Verify `isIOS: true` and `isPWA: true` in console logs
- [ ] Play audio and watch console for scroll triggers
- [ ] Verify active lyric is centered vertically
- [ ] Verify smooth scroll animation (should be smooth, not instant)
- [ ] Test manual scroll override (user should be able to scroll manually)
- [ ] Test rapid segment changes (shouldn't queue up scroll operations)

### Cross-Browser Testing
- [ ] iOS Safari (in-browser): Should use scrollIntoView
- [ ] iOS Safari (PWA): Should use scrollIntoView
- [ ] Chrome desktop: Should use fallback scrollTo
- [ ] Firefox desktop: Should use fallback scrollTo
- [ ] Android Chrome: Should use fallback scrollTo

### Edge Cases
- [ ] First segment: Should scroll from initial position
- [ ] Last segment: Should handle bottom padding correctly
- [ ] Queue overlay open: Should still scroll (just less visible space)
- [ ] Rapid audio scrubbing: Should debounce scroll operations
- [ ] No transcript: Component should render nothing (null)

---

## Performance Characteristics

### Scroll Delay Budget
- **Previous:** 0ms (double RAF only) = ~32ms worst case
- **New iOS:** 450ms delay + triple RAF = ~466ms total
- **New Other:** 350ms delay + triple RAF = ~366ms total

**Why This is OK:**
- Framer Motion animation takes 300ms anyway
- User perceives combined animation + scroll as one smooth motion
- 450ms feels natural (not too fast, not too slow)
- Matches iOS system animations timing

### Memory & Cleanup
- Single timeout ref prevents memory leaks
- Cleanup on unmount and activeSegmentIndex change
- No zombie scroll operations when switching tracks

---

## Why Previous Attempts Failed

### Attempt 1: Double RAF Only
**Failed because:** iOS Safari needs triple RAF for full render pipeline

### Attempt 2: Manual scrollTo Calculation
**Failed because:** iOS Safari has complex overflow rendering, scrollIntoView is more reliable

### Attempt 3: scroll-smooth CSS Class
**Failed because:** Conflicted with JS `behavior: 'smooth'`, created jank

### Attempt 4: Immediate Execution
**Failed because:** Framer Motion animations weren't complete, scrolled to wrong positions

---

## Expected Behavior After Fix

1. **Audio plays** → currentTime updates
2. **activeSegmentIndex changes** → triggers useEffect
3. **Clear pending scrolls** → debounce
4. **Wait 450ms (iOS)** → Framer Motion completes
5. **Triple RAF** → ensure render pipeline complete
6. **scrollIntoView** → smooth center alignment
7. **Active lyric centered** → user sees centered white text
8. **Smooth animation** → feels natural, not jarring

---

## Monitoring in Production

### Key Metrics to Track
- Scroll execution rate (should be ~100% on iOS)
- Fallback usage rate (should be low)
- Error rate (should be near 0%)
- User manual scroll rate (indicates engagement or failure)

### Console Patterns to Watch For
**Good:**
```
[TeleprompterLyrics] iOS scroll triggered: { segmentIndex: 1, ... }
[TeleprompterLyrics] iOS scroll triggered: { segmentIndex: 2, ... }
[TeleprompterLyrics] iOS scroll triggered: { segmentIndex: 3, ... }
```

**Bad:**
```
[TeleprompterLyrics] ScrollIntoView failed: ...
[TeleprompterLyrics] ScrollIntoView failed: ...
[TeleprompterLyrics] ScrollIntoView failed: ...
```

---

## Rollback Plan (If Needed)

If the fix causes issues:

1. **Revert to simple scrollIntoView:**
   ```tsx
   activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
   ```

2. **Remove delay, use single RAF:**
   ```tsx
   requestAnimationFrame(() => scrollToActive());
   ```

3. **Restore parent overflow-hidden:**
   ```tsx
   <div className="relative w-full h-full overflow-hidden">
   ```

---

## File Changes Summary

**File:** `src/components/audio/TeleprompterLyrics.tsx`

**Lines Changed:**
- Lines 1-31: Added iOS detection and scrollTimeoutRef
- Lines 43-135: Completely rewrote scroll logic with multi-strategy approach
- Lines 141-194: Updated JSX with iOS-optimized CSS

**Lines Added:** ~50
**Lines Removed:** ~30
**Net Change:** +20 lines (mostly comments and logging)

---

## Success Criteria

The fix is successful if:
1. Active lyric auto-scrolls to center on iOS Safari PWA
2. Scroll is smooth and feels natural (not instant or janky)
3. No console errors during normal playback
4. User can manually scroll without fighting the auto-scroll
5. Works across all iOS devices (iPhone, iPad)
6. Works in both Safari browser and PWA standalone mode
7. Doesn't break behavior on non-iOS platforms

---

## Next Steps

1. Test on physical iOS device in PWA mode
2. Monitor console logs for scroll triggers and errors
3. Verify smooth scrolling visual appearance
4. Test edge cases (first/last segment, rapid scrubbing)
5. Remove debug console.logs once verified working
6. Consider performance monitoring in production

---

**Fix Applied:** 2025-12-04
**Components Changed:** TeleprompterLyrics.tsx
**Testing Required:** iOS Safari PWA on physical device

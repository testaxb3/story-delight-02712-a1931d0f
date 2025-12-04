# Quick Test Guide - TeleprompterLyrics Scroll Fix

## Test on iOS Device (PWA Mode)

### Setup
1. **Deploy/Build the app** with the updated TeleprompterLyrics.tsx
2. **Open in iOS Safari** on your iPhone/iPad
3. **Add to Home Screen** (PWA mode)
4. **Open from Home Screen** (not Safari browser)

### Test Steps

#### Test 1: Basic Auto-Scroll
1. Open a track with transcript/lyrics
2. Open fullscreen player
3. Play the audio
4. **WATCH:** Active lyric should auto-scroll to center as audio progresses
5. **CHECK CONSOLE:** Open Safari DevTools (Mac → Safari → Develop → [Your iPhone] → [App])
6. **EXPECT:** Console logs showing `[TeleprompterLyrics] iOS scroll triggered:`

**SUCCESS:** Active lyric stays centered, scrolls smoothly, white text is always visible

**FAIL:** Lyrics disappear off bottom, no scrolling, or console errors

---

#### Test 2: Manual Override
1. While audio is playing
2. **Manually scroll** up to look at previous lyrics
3. **Wait** for next segment to become active
4. **EXPECT:** Auto-scroll resumes and brings you back to active lyric

**SUCCESS:** Can manually scroll, auto-scroll gracefully takes back control

**FAIL:** Auto-scroll fights with manual scroll, or doesn't resume

---

#### Test 3: Rapid Segment Changes
1. **Scrub audio** rapidly through different parts
2. **EXPECT:** Scroll operations don't queue up, debounces correctly
3. **CHECK CONSOLE:** Should not see dozens of scroll logs stacking up

**SUCCESS:** Smooth scrolling even with rapid changes, no lag/jank

**FAIL:** Scroll lags behind, multiple scrolls queue, or UI freezes

---

#### Test 4: Edge Cases
1. **First segment:** Should scroll from top padding to center
2. **Last segment:** Should scroll to bottom with bottom padding visible
3. **Queue open:** Scroll should still work in reduced visible space
4. **Background playback:** Switch apps, come back - should resume correct position

---

## Console Log Checklist

### On iOS PWA - Expected Logs
```
[TeleprompterLyrics] iOS scroll triggered: {
  segmentIndex: 0,
  text: "First lyric line...",
  isPWA: true
}
[TeleprompterLyrics] iOS scroll triggered: {
  segmentIndex: 1,
  text: "Second lyric line...",
  isPWA: true
}
```

### On Desktop Browser - Expected Logs
```
[TeleprompterLyrics] Fallback scroll triggered: {
  elementTop: 800,
  elementHeight: 48,
  containerHeight: 600,
  targetScrollTop: 524,
  currentScrollTop: 200
}
```

### Red Flags - Should NOT See
```
[TeleprompterLyrics] ScrollIntoView failed: ...
[TeleprompterLyrics] Smooth scroll failed, using instant: ...
```

---

## Visual Checklist

- [ ] Active lyric is **WHITE and BOLD** (text-white font-black)
- [ ] Active lyric is **CENTERED vertically** in viewport
- [ ] Inactive lyrics are **dimmed** (text-white/50)
- [ ] Scroll is **SMOOTH**, not instant jumps
- [ ] **No white screen flashes** during scroll
- [ ] **No layout shifts** or jank
- [ ] Manual scrolling is **responsive** (not blocked)

---

## Quick Debug Commands

### Check iOS Detection
Open console and run:
```javascript
console.log({
  isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
  isPWA: window.matchMedia('(display-mode: standalone)').matches
});
```

**Expected on iOS PWA:** `{ isIOS: true, isPWA: true }`

### Force Scroll Test
```javascript
// Find the scroll container
const container = document.querySelector('[class*="overflow-y-auto"]');
console.log('Container:', container);
console.log('ScrollTop:', container?.scrollTop);
console.log('ScrollHeight:', container?.scrollHeight);
console.log('ClientHeight:', container?.clientHeight);
```

---

## Performance Check

### Good Performance
- Scroll triggers within 450ms of segment change
- Smooth 60fps animation
- No dropped frames during scroll
- Memory stable (no leaks)

### Bad Performance
- Scroll lags by 1+ seconds
- Janky animation (< 30fps)
- Frame drops visible
- Memory increasing over time

---

## If It Doesn't Work

### Step 1: Verify Console Logs
- Are scroll triggers firing?
- Any errors?
- Is `isIOS` detected correctly?

### Step 2: Check Element Refs
```javascript
// In browser console
const activeElement = document.querySelector('[class*="font-black"]');
console.log('Active element:', activeElement);
console.log('Is in viewport:', activeElement?.getBoundingClientRect());
```

### Step 3: Manual Scroll Test
```javascript
// Try manual scroll in console
const container = document.querySelector('[class*="overflow-y-auto"]');
container?.scrollTo({ top: 500, behavior: 'smooth' });
```

If manual scroll works → timing issue
If manual scroll fails → CSS/layout issue

---

## Rollback Quick Fix

If completely broken, temporary fix:
```tsx
// In TeleprompterLyrics.tsx, replace entire useEffect with:
useEffect(() => {
  if (activeSegmentIndex >= 0 && activeRef.current) {
    activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}, [activeSegmentIndex]);
```

---

## Success = Ship It

If all tests pass:
1. Remove debug `console.log` statements (optional, can keep for monitoring)
2. Commit changes
3. Deploy to production
4. Monitor real user behavior

**Files Changed:**
- `src/components/audio/TeleprompterLyrics.tsx`

**No Breaking Changes:**
- Backwards compatible
- Fallback strategies for all platforms
- Graceful degradation if features unsupported

---

## Contact Info for Issues

If issues persist:
1. Check SCROLL_FIX_ANALYSIS.md for detailed technical explanation
2. Verify iOS Safari version (requires iOS 13+ for scrollIntoView options)
3. Test on multiple iOS devices (older devices may behave differently)
4. Check for conflicting CSS from parent components

**Test Device Recommendations:**
- iPhone 12+ (modern iOS)
- iPhone 8 (older iOS)
- iPad Pro (large screen)
- iPad Mini (small screen)

All should work with this fix!

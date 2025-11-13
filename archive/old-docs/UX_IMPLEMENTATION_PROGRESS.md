# UX Improvements Implementation Plan

## Status: IN PROGRESS

This document tracks the implementation of 9 UX improvements requested.

---

## ✅ COMPLETED

### 2. Integrate Enhanced Quiz Questions
**Status**: ✅ Already implemented
**Location**: `src/lib/quizQuestions.ts` + `src/pages/Quiz.tsx`
**Details**: Enhanced quiz with 15 scientific questions already integrated and working.

---

## 🚧 IN PROGRESS

### 1. Fix Language Inconsistency
**Status**: 🚧 In progress
**Files found**:
- Translation system exists: `src/lib/translations/en.ts` + `src/lib/translations/pt.ts`
- Hook exists: `src/hooks/useTranslation.ts`
- Need to find hardcoded PT-BR strings and replace

**Next steps**:
1. Search for all hardcoded Portuguese strings
2. Add to en.ts if missing
3. Replace with useTranslation() hook calls
4. Set default language to EN-US

---

## 📋 PENDING

### 3. Add Loading Skeletons
**Priority**: High (visual polish)
**Estimated**: 2 hours
**Plan**:
- Create skeleton components
- Replace spinners in Scripts, Dashboard, Community, Videos

### 4. Complete Video Watch Tracking
**Priority**: High (functionality)
**Estimated**: 2 hours
**Plan**:
- Create useVideoProgress hook
- Track watch timestamps
- Show "Continue where you left off"
- Progress bars on video cards

### 5. Complete Photo Upload Feature
**Priority**: Medium
**Estimated**: 2 hours
**Plan**:
- Integrate PhotoUpload component into Profile page
- Display photos in TopBar child selector
- Supabase Storage integration

### 6. Optimize Mobile Experience
**Priority**: Medium
**Estimated**: 4-6 hours
**Plan**:
- Reduce bottom nav height
- Icon-only on mobile
- Larger touch targets
- Better responsive cards

### 7. Implement Push Notification Permissions UI
**Priority**: High (engagement)
**Estimated**: 3 hours
**Plan**:
- Create permission modal
- Improve subscription page UI
- Settings toggles
- Trigger logic for notifications

### 8. Add Community Moderation Tools
**Priority**: Medium
**Estimated**: 3-4 hours
**Plan**:
- Flag button on posts
- Admin moderation queue
- Auto-hide flagged posts
- Community guidelines modal

### 9. Enable Leaderboard & Streaks
**Priority**: High (gamification)
**Estimated**: 4 hours
**Plan**:
- Fix tracker_days schema (migration)
- Re-enable streak calculation
- Build leaderboard with rankings
- Streak celebrations

---

## 📊 Progress Tracker

| Task | Status | Time Est. | Priority |
|------|--------|-----------|----------|
| Enhanced Quiz | ✅ Done | 0h (already done) | - |
| Language Fix | 🚧 In Progress | 3h | Critical |
| Loading Skeletons | ⏳ Pending | 2h | High |
| Video Tracking | ⏳ Pending | 2h | High |
| Photo Upload | ⏳ Pending | 2h | Medium |
| Mobile Optimization | ⏳ Pending | 6h | Medium |
| Push Notifications | ⏳ Pending | 3h | High |
| Moderation Tools | ⏳ Pending | 4h | Medium |
| Leaderboard | ⏳ Pending | 4h | High |

**Total Estimated**: 26 hours remaining
**Completed**: 1/9 tasks

---

## 🎯 Implementation Strategy

Given the scope (26 hours of work), I recommend:

**Option A**: Implement all 9 incrementally with commits after each
**Option B**: Focus on highest impact first (Language, Leaderboard, Notifications)
**Option C**: Quick wins first (Language, Skeletons, Quiz) then complex features

**Recommended**: Option C - Build momentum with quick wins

---

Last updated: 2025-10-22

# Phase 1: Analysis

## 1. User Impact
For "Exhausted Emily" (using the app at 8pm), the primary goal is **cognitive offloading**. The current dashboard requires her to decide "what to do", whereas the new **Predictive AI Brief** will *tell* her what to do based on the time of day (e.g., "Bedtime Routine" at 8pm).
- **Benefit:** Reduces decision fatigue.
- **Emotional Result:** Moves from "Overwhelmed" to "Guided/Supported".
- **Visuals:** The "2050 Premium" aesthetic (dark mode, glowing accents) reduces eye strain in low-light environments (bedroom context) compared to stark white interfaces.

## 2. Performance
- **Current Status:** ~620ms FCP, good but potentially fragile with heavy blurs.
- **Cost of Change:** Adding complex "glassmorphism" (backdrop-filter) and 3D transforms (`perspective`) increases GPU usage.
- **Mitigation Strategy:**
    - Use `will-change: transform` sparingly.
    - Replace multiple large `div` based glows with CSS `radial-gradient` on a single canvas or simplified container where possible to reduce DOM depth.
    - **Strict Constraint:** Eliminate `setInterval` in `HeroMetricsCard` (blocks main thread) in favor of `requestAnimationFrame` or Framer Motion's `useSpring` for values.
    - Ensure images (ebook covers) have `loading="lazy"` and proper `width/height` to prevent layout shifts (CLS).
- **Budget Impact:** Bundle size change should be negligible (< 2KB) as we are mostly refactoring existing components and using existing libraries (`framer-motion`, `lucide-react`).

## 3. Alternatives
1.  **Static List (Status Quo):**
    - *Pros:* Fastest to render.
    - *Cons:* High cognitive load ("What do I click?"). Fails the "Premium" feel.
2.  **Search-First Interface:**
    - *Pros:* Flexible.
    - *Cons:* "Exhausted Emily" doesn't want to type at 8pm. She wants 1-tap solutions.
3.  **Predictive Cards (Selected):**
    - *Pros:* Zero input required. High relevance.
    - *Cons:* Needs accurate time-based logic (easy to implement).
    - *Why Best:* Best fits the "Guide me" mental model of the target persona.

## 4. Risks
- **Visual Noise:** Too many glowing elements might look "gamified" rather than "calming".
    - *Mitigation:* Stick to the "Deep Space" palette (#0a0a0f) and ensure text contrast is WCAG AA compliant (4.5:1).
- **Performance on Old Devices (iPhone 8/X):** `backdrop-filter` can be laggy.
    - *Mitigation:* Fallback to solid semi-transparent backgrounds if CSS support is lacking (though standard in 2025 context, older devices might struggle).
- **Data Gaps:** New users might see empty rings/charts.
    - *Mitigation:* Robust empty states (e.g., "Start your first script to see magic here").

## 5. Metrics
- **Primary Metric:** Time to Script Start (Target: < 5s).
- **Secondary Metric:** Retention (Day 1 to Day 7).
- **Hypothesis:** By presenting the *right* script at the *right* time via the AI Brief, we increase script completion rates by 15%.

---

# Phase 2: Design (Specifications)

## Component: `AIDailyBrief` (Refined)
- **Dimensions:** Full width, min-height 140px.
- **Visuals:**
    - Background: `rgba(255, 255, 255, 0.03)` + `backdrop-filter: blur(20px)`.
    - Border: 1px solid `rgba(255,255,255,0.1)` + Dynamic Color Glow based on category.
- **Interaction:**
    - Tap: Scale 0.98, Haptic 'medium'.
    - Pulse animation on the "Start" icon.
- **Content:** Dynamic based on `new Date().getHours()`.
    - 19:00 - 05:00: Sleep/Bedtime (Purple/Indigo).
    - 05:00 - 09:00: Morning Routine (Orange/Amber).
    - 09:00 - 17:00: General/Discipline (Cyan/Blue).
    - 17:00 - 19:00: Mealtime/Bath (Green/Teal).

## Component: `HeroMetricsCard` (Optimized)
- **Animation:** Remove `setInterval`. Use `useSpring` for the counter value.
- **Visuals:** Deepen the "Mesh Gradient" to ensure white text is legible.

## Component: `CategoryRings`
- **Logic:** If < 3 categories, center the existing ones.
- **Empty State:** If 0 categories, show a "greyed out" placeholder ring with a "Start" CTA.

## Navigation
- **"See All" Links:** Update to `navigate('/scripts?category=sleep')` etc., based on context.


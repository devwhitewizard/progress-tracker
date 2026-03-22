# Responsiveness Fixes TODO

## Plan Steps:
1. [ ] Edit src/styles/globals.css - Add @media (max-width: 480px) for phone paddings/sidebar/button scaling
2. [ ] Edit src/components/HabitTracker.jsx - Fix table th widths (52px → min(44px,52px)), select minWidth remove/flex:1
3. [ ] Edit src/components/Dashboard.jsx - Grid minmax(240px → 200px), sparkline height rem-based (60px → 4rem)
4. [ ] Edit src/App.jsx - Header padding clamp(1.5rem,4vw,2.5rem)
5. [ ] Test: npm run dev, check DevTools 320px/480px/1024px all views
6. [ ] attempt_completion

Current: Starting step 1

# Derived State: The Unnecessary Copy

**ID:** `fe-018-derived-state-antipattern`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `react`, `state`, `useEffect`, `derived-state`, `anti-pattern`  
**Prerequisites:** None

---

## The Scenario

You have a `UserProfile` component that receives a user object as a prop and displays formatted information (full name, initials, account age). A developer created local state copies of the props and syncs them with `useEffect`. When the parent changes the user (e.g., switching between profiles), the displayed information sometimes shows stale data for a render cycle before updating, causing a visible flicker.

## The Bug

The component copies props into state using `useEffect`, creating the "derived state" anti-pattern. Since `useEffect` runs after render, the component first renders with stale state from the previous user, then re-renders when the effect updates the state. Values that could simply be computed from props during render are instead stored in state with a sync delay.

## Your Task

1. Remove the unnecessary state copies and `useEffect` sync
2. Compute derived values directly from props during render
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/UserProfile.tsx` | Profile component with derived state anti-pattern |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) — Computing values during render
- [Derived State Anti-pattern](https://react.dev/blog/2018/06/07/you-probably-dont-need-derived-state) — Why copying props to state is problematic

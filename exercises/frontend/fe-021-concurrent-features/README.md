# Concurrent Features: Misplaced Transitions

**ID:** `fe-021-concurrent-features`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 30 minutes  
**Tags:** `react`, `concurrent`, `startTransition`, `useTransition`, `performance`  
**Prerequisites:** None

---

## The Scenario

Your team built a product search page that filters through 5,000 items with a fuzzy-matching algorithm. Performance was terrible, so a developer added `useTransition` to "fix" it. The input now feels sluggish -- characters appear with a visible delay after typing, and users on slower devices are filing complaints. The expensive computation, ironically, still blocks the UI.

## The Bug

The `startTransition` is wrapping the wrong state update. The text input's state change (which should be **urgent** so the user sees immediate keyboard feedback) is deferred inside a transition. Meanwhile, the expensive filtered list computation runs synchronously on every render outside any transition. This is exactly backwards -- the cheap input update is deferred while the expensive work runs at full priority.

## Your Task

1. Examine `src/SearchPage.tsx` and identify which state update is inside the transition
2. Restructure so the input value updates **urgently** (outside any transition)
3. Move the expensive derived computation to be driven by a **deferred** state value
4. Ensure the input always reflects the user's typing immediately
5. All tests must pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/SearchPage.tsx` | Search page with misplaced transition |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [useTransition](https://react.dev/reference/react/useTransition) -- marking state updates as non-urgent
- [useDeferredValue](https://react.dev/reference/react/useDeferredValue) -- deferring re-rendering of part of the UI
- [Urgent vs Transition updates](https://react.dev/blog/2022/03/29/react-v18#new-feature-transitions) -- understanding priority

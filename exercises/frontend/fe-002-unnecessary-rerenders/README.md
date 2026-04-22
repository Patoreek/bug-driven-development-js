# Unnecessary Re-renders

**ID:** `fe-002-unnecessary-rerenders`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `react`, `performance`, `memo`, `useCallback`, `useMemo`  
**Prerequisites:** None

---

## The Scenario

Your team built a todo list for a project management tool. Users report that the app feels sluggish when typing in the search box, especially with lots of todos. A performance profile shows that every `TodoItem` component re-renders whenever the user types a single character in the search input, even though the individual items haven't changed.

## The Bug

The `TodoItem` child component re-renders on every keystroke in the search box, even though its props (the todo data and the toggle handler) haven't logically changed. The parent is creating new object and function references on every render, defeating any memoization.

## Your Task

1. Examine `src/TodoApp.tsx` and identify why child components re-render unnecessarily
2. Apply memoization techniques to prevent unnecessary re-renders of `TodoItem`
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/TodoApp.tsx` | Todo app with parent and child components |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [React.memo](https://react.dev/reference/react/memo) — memoizing components
- [useCallback](https://react.dev/reference/react/useCallback) — memoizing functions
- [useMemo](https://react.dev/reference/react/useMemo) — memoizing computed values

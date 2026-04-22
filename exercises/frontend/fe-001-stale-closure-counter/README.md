# Stale Closure Counter

**ID:** `fe-001-stale-closure-counter`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `react`, `hooks`, `closures`, `useState`, `setTimeout`  
**Prerequisites:** None

---

## The Scenario

You're on a team building a dashboard for a logistics company. One widget displays a counter that dispatchers use to log incoming packages. They often click the "Add Package" button several times in quick succession, but the count only goes up by one instead of matching the number of clicks. A senior dev wrote the component last sprint and is now on vacation.

## The Bug

When the "Increment" button is clicked multiple times rapidly (before the delayed update fires), the counter doesn't reflect every click. For example, clicking three times in a row results in the count only increasing by 1 instead of 3. The delayed update seems to "forget" some clicks.

## Your Task

1. Examine `src/Counter.tsx` and identify why rapid clicks are lost
2. Fix the state update logic so every click is correctly counted
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/Counter.tsx` | Counter component with delayed increment |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [React useState](https://react.dev/reference/react/useState) — state hook reference
- [Closures in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) — how closures capture variables
- [Functional updates](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state) — using a function with setState

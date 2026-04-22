# Conditional Hook Call

**ID:** `fe-007-conditional-hook`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `react`, `hooks`, `rules-of-hooks`, `useState`, `useEffect`  
**Prerequisites:** None

---

## The Scenario

A teammate wrote a greeting component that shows a personalized welcome message when the user is logged in. It works great during initial testing, but after a few login/logout cycles in the browser, the app crashes with a cryptic error about hooks being called in a different order. The component sometimes throws on render and other times works fine.

## The Bug

A React hook is called inside a conditional block. React relies on hooks being called in the same order every render. When the condition changes, the hook call order shifts, causing React's internal state tracking to break.

## Your Task

1. Examine `src/UserGreeting.tsx` and find the hook that violates the rules of hooks
2. Restructure the code so all hooks are called unconditionally at the top level
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/UserGreeting.tsx` | Greeting component with conditional hook |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) — hooks must be called at the top level
- [Conditional rendering](https://react.dev/learn/conditional-rendering) — how to conditionally show content

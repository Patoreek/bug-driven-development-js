# useEffect Infinite Loop

**ID:** `fe-004-useeffect-infinite-loop`  
**Difficulty:** ★☆☆☆☆  
**Estimated Time:** 10 minutes  
**Tags:** `react`, `hooks`, `useEffect`, `dependency-array`  
**Prerequisites:** None

---

## The Scenario

A junior developer on your team wrote a user profile component that fetches user data based on a configuration object. During code review, the component appeared fine, but in the browser it makes hundreds of API calls per second and eventually crashes the tab. The network tab shows the same request firing in an endless loop.

## The Bug

A `useEffect` has an object in its dependency array that is recreated on every render. Since objects are compared by reference (not value), React sees a "new" dependency each time and re-runs the effect, which triggers a state update, which causes another render, creating an infinite loop.

## Your Task

1. Examine `src/UserProfile.tsx` and identify the infinite loop cause
2. Fix the dependency array so the effect only runs when the actual values change
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/UserProfile.tsx` | User profile component with fetch effect |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [useEffect dependencies](https://react.dev/reference/react/useEffect#specifying-reactive-dependencies) — how dependency comparison works
- [Referential equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) — why `{} !== {}`

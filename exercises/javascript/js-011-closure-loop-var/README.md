# Closure Over Loop Variable

**ID:** `js-011-closure-loop-var`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 10 minutes
**Tags:** `javascript`, `closures`, `var`, `let`, `scoping`
**Prerequisites:** None

---

## The Scenario

You inherited a legacy codebase that still has `var` declarations everywhere. A colleague wrote some utility functions that create callbacks inside loops. In testing, every callback produces the same value -- the final value of the loop counter -- instead of the value it should have captured at creation time. You need to fix the scoping issue.

## The Bug

Functions created inside a loop using `var` all close over the **same** variable. By the time any callback executes, the loop has already finished and the variable holds its final value. Every callback sees the same number.

## Your Task

1. Fix `createTimers` so each callback captures its own index value
2. Fix `createHandlers` so each handler captures the correct button index
3. Fix `createMultipliers` so each function multiplies by the correct factor
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy functions with closure-in-loop issues |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) -- closures in loops
- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) -- block scoping
- [MDN: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var) -- function scoping

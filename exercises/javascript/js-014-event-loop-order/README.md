# Event Loop Execution Order

**ID:** `js-014-event-loop-order`
**Difficulty:** ★★★★☆
**Estimated Time:** 20 minutes
**Tags:** `javascript`, `event-loop`, `microtasks`, `macrotasks`, `promises`, `async`
**Prerequisites:** None

---

## The Scenario

Your team is building an initialization system that sets up resources in a specific order: load config, then connect to the database, then start the server. A developer mixed synchronous code, Promises, `queueMicrotask`, and `setTimeout` in the pipeline. The app crashes on startup because the database connection tries to use a config value that hasn't been set yet -- the initialization order is wrong.

## The Bug

The code assumes that mixing `setTimeout` (macrotask), `Promise.resolve().then()` (microtask), `queueMicrotask()`, and synchronous code will execute in the order they're written. It won't. The event loop processes: synchronous code first, then all microtasks, then one macrotask, and so on. The functions schedule operations in the wrong task queues.

## Your Task

1. Fix `processQueue` so items are processed in the correct order
2. Fix `initializeApp` so resources are set up in the correct dependency order
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy async pipeline functions |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop) -- microtasks vs macrotasks
- [MDN: queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask) -- microtask scheduling
- [MDN: Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) -- .then() is a microtask

# AbortController Cleanup

**ID:** `js-020-abortcontroller-cleanup`
**Difficulty:** ★★★★★
**Estimated Time:** 30 minutes
**Tags:** `javascript`, `abortcontroller`, `abort-signal`, `async`, `resource-cleanup`
**Prerequisites:** None

---

## The Scenario

Your team is building a data fetching layer with timeout support, cancellable long-running operations, a debounced search that cancels stale requests, and event listeners that clean up automatically. Everything uses `AbortController` -- the standard API for cancellation in JavaScript. But the implementation is riddled with subtle bugs: timeouts never actually cancel requests, cancelled operations run to completion anyway, debounced calls pile up instead of cancelling, and event listeners leak because they are never removed.

## The Bug

Six issues across four functions:

1. **`fetchWithTimeout`**: The abort signal is never passed to `fetch`, so the timeout fires but the request is not actually cancelled
2. **`fetchWithTimeout`**: The timeout timer is never cleared on success, so it fires after the request completes
3. **`cancellableOperation`**: Does not check if the signal is already aborted before starting the operation
4. **`cancellableOperation`**: Does not listen for the `abort` event during execution, so mid-operation cancellation has no effect
5. **`createCancellableDebounce`**: Never aborts the previous controller and never resolves the pending promise when cancelled, so calls accumulate and promises hang forever
6. **`addAbortableEventListener`**: Does not pass the `{ signal }` option to `addEventListener`, so the listener is never removed on abort and is not guarded against an already-aborted signal

## Your Task

1. Fix `fetchWithTimeout` to pass the signal to fetch and clear the timeout on completion
2. Fix `cancellableOperation` to check `signal.aborted` and race against the `abort` event
3. Fix `createCancellableDebounce` to abort the previous controller and resolve the pending promise with `undefined` when cancelled
4. Fix `addAbortableEventListener` to guard against an already-aborted signal and pass `{ signal }` to `addEventListener`
5. Ensure all tests pass
6. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy AbortController-based cancellation utilities |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) -- creating and using abort controllers
- [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) -- the signal object
- [MDN: fetch() - Using AbortController](https://developer.mozilla.org/en-US/docs/Web/API/fetch#aborting_a_fetch) -- cancelling fetch requests
- [MDN: addEventListener - signal option](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#signal) -- auto-removing listeners

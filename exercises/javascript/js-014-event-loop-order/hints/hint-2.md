# Hint 2 -- Medium

The event loop order is: **synchronous code** -> **microtasks** (Promise.then, queueMicrotask) -> **macrotasks** (setTimeout).

For `processQueue` and `initializeApp`, mixing `setTimeout` and `queueMicrotask` causes operations to execute in the wrong order. Consider using `async/await` to enforce sequential execution instead of manually scheduling tasks in different queues.

For `demonstrateEventLoop`, the sync code runs first regardless of where it appears relative to `setTimeout`/`queueMicrotask` calls.
